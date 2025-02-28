
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AgentAvatar from './AgentAvatar';
import { 
  Send, 
  Paperclip, 
  FileText, 
  AlertCircle, 
  X, 
  Download, 
  MessageSquare, 
  Sparkles,
  Check,
  Upload,
  FileUp,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  processCreditReport, 
  CreditReportData, 
  CreditReportAccount, 
  RecommendedDispute, 
  generateDisputeLetterForDiscrepancy,
  loadSampleReports,
  getSuccessfulDisputePhrases
} from '@/utils/creditReportParser';
import { useToast } from '@/hooks/use-toast';
import { Profile, saveDisputeLetter } from '@/lib/supabase';

interface DisputeAgentProps {
  onGenerateDispute?: (disputeData: any) => void;
}

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isLoading?: boolean;
  isFileUpload?: boolean;
  hasDiscrepancies?: boolean;
  discrepancies?: RecommendedDispute[];
};

type DisputeType = {
  bureau: string;
  accountName: string;
  errorType: string;
  explanation: string;
};

const AGENT_NAME = "CLEO";
const AGENT_FULL_NAME = "Credit Litigation Expert Operator";

const DisputeAgent: React.FC<DisputeAgentProps> = ({ onGenerateDispute }) => {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [currentDispute, setCurrentDispute] = useState<DisputeType | null>(null);
  const [disputeGenerated, setDisputeGenerated] = useState(false);
  const [reportData, setReportData] = useState<CreditReportData | null>(null);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<RecommendedDispute | null>(null);
  const [sampleReportsLoaded, setSampleReportsLoaded] = useState(false);
  const [samplePhrases, setSamplePhrases] = useState<Record<string, string[]>>({});
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load sample reports and successful phrases on component mount
  useEffect(() => {
    const loadSamples = async () => {
      try {
        // Load sample reports
        await loadSampleReports();
        setSampleReportsLoaded(true);
        
        // Load successful dispute phrases
        const phrases = await getSuccessfulDisputePhrases();
        setSamplePhrases(phrases);
        
        console.log("Sample reports and phrases loaded successfully");
      } catch (error) {
        console.error("Error loading sample data:", error);
      }
    };
    
    loadSamples();
  }, []);
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: MessageType = {
        id: Date.now().toString(),
        content: `Hello${profile?.full_name ? ' ' + profile.full_name.split(' ')[0] : ''}! I'm ${AGENT_NAME}, your ${AGENT_FULL_NAME}. I can help you analyze your credit reports and automatically identify errors and discrepancies across all three bureaus. Upload your credit report to get started!`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    }
  }, [profile, messages]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAgentTyping(true);
    
    // Simulate agent analyzing the message
    setTimeout(() => {
      handleAgentResponse(userMessage.content);
    }, 1000 + Math.random() * 1000);
  };
  
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Add upload message
    const uploadMessage: MessageType = {
      id: Date.now().toString(),
      content: `Uploaded ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      isFileUpload: true,
    };
    
    setMessages(prev => [...prev, uploadMessage]);
    setIsAgentTyping(true);
    setIsProcessingFile(true);
    
    // Add a processing message to indicate we're working on the file
    const processingMessage: MessageType = {
      id: Date.now().toString(),
      content: `I'm analyzing your credit report from ${file.name}. This will take a moment as I carefully scan through all accounts, personal information, and potential discrepancies...`,
      sender: 'agent',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, processingMessage]);
    
    try {
      // Process the report - don't set a timeout here, let it take as long as needed
      console.log("Starting credit report processing...");
      const data = await processCreditReport(file);
      console.log("Credit report processing complete.");
      setReportData(data);
      
      // Now handle the analysis results
      handleReportAnalysis(data);
    } catch (error) {
      console.error("Error processing credit report:", error);
      
      const errorMessage: MessageType = {
        id: Date.now().toString(),
        content: `I encountered an error processing your credit report: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure you've uploaded a valid credit report file.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsAgentTyping(false);
      setIsProcessingFile(false);
    }
  };
  
  const handleReportAnalysis = async (data: CreditReportData) => {
    console.log("Analyzing report data:", data);
    
    try {
      // Add a transitional message to show analysis steps
      const analysisStepsMessage: MessageType = {
        id: Date.now().toString(),
        content: `I'm examining your report for discrepancies, inaccuracies, and potential violations of the Fair Credit Reporting Act (FCRA). Checking account balances, payment statuses, and personal information across all bureaus...`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, analysisStepsMessage]);
      
      // Wait a moment to show the analysis is thorough
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!data.analysisResults || !data.analysisResults.recommendedDisputes || data.analysisResults.recommendedDisputes.length === 0) {
        // No discrepancies found
        const noIssuesMessage: MessageType = {
          id: Date.now().toString(),
          content: `I've analyzed your credit report and didn't find any significant discrepancies between bureaus. Your credit information appears to be consistent across the credit bureaus. Is there anything specific you're concerned about that I should look into further?`,
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, noIssuesMessage]);
        setIsAgentTyping(false);
        setIsProcessingFile(false);
        return;
      }
      
      // Discrepancies found - first populate sample dispute language for each
      console.log("Populating sample dispute language for recommendations...");
      
      // Use Promise.all to wait for all the sample dispute language to be populated
      const { totalDiscrepancies, highSeverityIssues, accountsWithIssues, recommendedDisputes } = data.analysisResults;
      
      // Process each dispute to add sample language
      const enhancedDisputes = await Promise.all(
        recommendedDisputes.map(async (dispute) => {
          try {
            const sampleLanguage = await getSampleDisputeLanguage(
              dispute.accountName, 
              dispute.reason, 
              dispute.bureau
            );
            return {
              ...dispute,
              sampleDisputeLanguage: sampleLanguage
            };
          } catch (error) {
            console.error("Error getting sample dispute language:", error);
            return dispute;
          }
        })
      );
      
      // Update the analysis results with enhanced disputes
      data.analysisResults.recommendedDisputes = enhancedDisputes;
      setReportData({...data});
      
      console.log("Sample dispute language populated successfully.");
      
      // Create sample reports message if samples were loaded
      if (sampleReportsLoaded) {
        const sampleLoadedMessage: MessageType = {
          id: Date.now().toString(),
          content: `Based on sample credit reports and past successful disputes, I've enhanced my analysis to identify the most likely successful dispute strategies.`,
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, sampleLoadedMessage]);
        
        // Wait a moment to simulate deep analysis
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Create summary message
      const summaryMessage: MessageType = {
        id: Date.now().toString(),
        content: `I've completed my analysis of your credit report and found ${totalDiscrepancies} discrepancies across ${accountsWithIssues} accounts/items, including ${highSeverityIssues} high-severity issues that should be disputed immediately. Here are the key issues I found:`,
        sender: 'agent',
        timestamp: new Date(),
        hasDiscrepancies: true,
        discrepancies: enhancedDisputes,
      };
      
      setMessages(prev => [...prev, summaryMessage]);
      
      // Wait a moment before showing detailed explanation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add detailed explanation of high severity issues
      const highSeverityDisputes = enhancedDisputes.filter(d => d.severity === 'high');
      
      if (highSeverityDisputes.length > 0) {
        const highSeverityMessage: MessageType = {
          id: Date.now().toString(),
          content: `The most urgent issues to address are:\n\n${highSeverityDisputes.map((dispute, index) => 
            `${index + 1}. ${dispute.accountName}: ${dispute.description} (reported by ${dispute.bureau})`
          ).join('\n\n')}\n\nWould you like me to generate dispute letters for these issues automatically?`,
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, highSeverityMessage]);
      } else {
        const recommendationMessage: MessageType = {
          id: Date.now().toString(),
          content: `Would you like me to generate dispute letters for any of these issues automatically?`,
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, recommendationMessage]);
      }
    } catch (error) {
      console.error("Error during report analysis:", error);
      
      const errorMessage: MessageType = {
        id: Date.now().toString(),
        content: `I encountered an error while analyzing your credit report: ${error instanceof Error ? error.message : "Unknown error"}. Let's try again or you can ask me about specific accounts you're concerned about.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAgentTyping(false);
      setIsProcessingFile(false);
    }
  };
  
  const handleAgentResponse = (userMessage: string) => {
    // Don't process new messages if we're still processing a file
    if (isProcessingFile) {
      const busyMessage: MessageType = {
        id: Date.now().toString(),
        content: "I'm still analyzing your credit report. This may take a few moments as I thoroughly scan for discrepancies and potential disputes.",
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, busyMessage]);
      setIsAgentTyping(false);
      return;
    }
    
    // Simple pattern matching to simulate AI conversation
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // If there's a current dispute in progress - this is kept from the original flow for manual disputes
    if (currentDispute) {
      if (Object.values(currentDispute).filter(Boolean).length === 3) {
        // We need the explanation now
        setCurrentDispute({
          ...currentDispute,
          explanation: userMessage
        });
        
        // Response after receiving explanation
        const explanationResponse: MessageType = {
          id: Date.now().toString(),
          content: "Thank you for providing the details. I'm now generating your personalized dispute letter citing the appropriate FCRA regulations and legal precedent.",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, explanationResponse]);
        
        // Generate the dispute letter with a real delay to simulate work
        setIsAgentTyping(true);
        
        setTimeout(async () => {
          try {
            const disputeData = {
              ...currentDispute,
              explanation: userMessage,
              timestamp: new Date(),
              letterContent: generateDisputeLetter({
                ...currentDispute,
                explanation: userMessage
              })
            };
            
            // Notify parent component about generated dispute
            if (onGenerateDispute) {
              onGenerateDispute(disputeData);
            }
            
            // Save to Supabase if user is logged in
            if (user && user.id) {
              await saveDisputeLetter(user.id, disputeData);
            }
            
            const generatedResponse: MessageType = {
              id: Date.now().toString(),
              content: "I've generated your dispute letter! It includes citations to FCRA Section 611 regarding accuracy disputes and Section 623 regarding furnisher responsibilities. You can now download it or send it directly to the credit bureau.",
              sender: 'agent',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, generatedResponse]);
            setDisputeGenerated(true);
          } catch (error) {
            console.error("Error generating dispute letter:", error);
            
            const errorMessage: MessageType = {
              id: Date.now().toString(),
              content: `I encountered an error while generating your dispute letter: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
              sender: 'agent',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsAgentTyping(false);
          }
        }, 3000);
        
        return;
      }
      
      // Handle partial dispute information collection
      if (!currentDispute.bureau) {
        // Bureau was just asked
        setCurrentDispute({
          ...currentDispute,
          bureau: userMessage
        });
        
        const nextQuestion: MessageType = {
          id: Date.now().toString(),
          content: "Which account or item on your credit report contains the error? (For example: 'Bank of America Credit Card', 'Chase Auto Loan', etc.)",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsAgentTyping(false);
        return;
      }
      
      if (!currentDispute.accountName) {
        // Account name was just asked
        setCurrentDispute({
          ...currentDispute,
          accountName: userMessage
        });
        
        const nextQuestion: MessageType = {
          id: Date.now().toString(),
          content: "What type of error are you disputing? (For example: 'Incorrect balance', 'Account not mine', 'Late payment', 'Account shown as open but was closed', etc.)",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsAgentTyping(false);
        return;
      }
      
      if (!currentDispute.errorType) {
        // Error type was just asked
        setCurrentDispute({
          ...currentDispute,
          errorType: userMessage
        });
        
        const nextQuestion: MessageType = {
          id: Date.now().toString(),
          content: "Please provide additional details to explain why this information is incorrect. This will strengthen your dispute case.",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, nextQuestion]);
        setIsAgentTyping(false);
        return;
      }
    }
    
    // Handle user asking about sample reports
    if (lowerCaseMessage.includes('sample') && lowerCaseMessage.includes('report')) {
      const sampleInfoResponse: MessageType = {
        id: Date.now().toString(),
        content: `I've been trained on a library of sample credit reports and successful dispute letters. This allows me to identify the most effective dispute strategies and language for your specific situation. My analysis is enhanced with real-world examples of successful dispute outcomes.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, sampleInfoResponse]);
      setIsAgentTyping(false);
      return;
    }
    
    // Handle user asking for successful dispute tips
    if ((lowerCaseMessage.includes('successful') || lowerCaseMessage.includes('effective')) && 
        (lowerCaseMessage.includes('dispute') || lowerCaseMessage.includes('tips'))) {
      
      // Get some sample tips based on loaded phrases
      let tipContent = "Based on my analysis of successful dispute letters, here are some effective strategies:\n\n";
      
      if (Object.keys(samplePhrases).length > 0) {
        // Add tips from sample phrases
        tipContent += "1. For balance disputes: \"" + (samplePhrases.balanceDisputes?.[0] || "Be specific about the correct balance and provide documentation.") + "\"\n\n";
        tipContent += "2. For late payment disputes: \"" + (samplePhrases.latePaymentDisputes?.[0] || "Provide proof of on-time payment and reference any special circumstances.") + "\"\n\n";
        tipContent += "3. For account ownership disputes: \"" + (samplePhrases.accountOwnershipDisputes?.[0] || "Clearly state that the account does not belong to you and request full verification.") + "\"\n\n";
        tipContent += "4. Always include: specific dates, account numbers, and references to supporting documentation.\n\n";
        tipContent += "5. Cite the relevant FCRA sections that protect your rights.";
      } else {
        // Default tips if phrases aren't loaded
        tipContent += "1. Be specific about the error and explain clearly why it's incorrect.\n\n";
        tipContent += "2. Provide supporting documentation whenever possible.\n\n";
        tipContent += "3. Reference the FCRA sections that protect your rights.\n\n";
        tipContent += "4. Follow up if you don't receive a response within 30 days.\n\n";
        tipContent += "5. Keep copies of all correspondence and document everything.";
      }
      
      const tipsResponse: MessageType = {
        id: Date.now().toString(),
        content: tipContent,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, tipsResponse]);
      setIsAgentTyping(false);
      return;
    }
    
    // Handle user asking to generate a dispute letter for a discrepancy
    if (reportData && reportData.analysisResults && 
       (lowerCaseMessage.includes('generate') || 
        lowerCaseMessage.includes('create letter') || 
        lowerCaseMessage.includes('dispute') || 
        lowerCaseMessage.includes('yes') || 
        lowerCaseMessage.includes('please'))) {
      
      // Look for reference to specific account or issue
      let targetDispute: RecommendedDispute | null = null;
      
      const { recommendedDisputes } = reportData.analysisResults;
      
      // If user mentioned an account name, try to find a matching dispute
      for (const dispute of recommendedDisputes) {
        if (lowerCaseMessage.includes(dispute.accountName.toLowerCase())) {
          targetDispute = dispute;
          break;
        }
      }
      
      // If no specific account mentioned, take the highest priority dispute
      if (!targetDispute && recommendedDisputes.length > 0) {
        // Start with high severity disputes
        const highSeverityDisputes = recommendedDisputes.filter(d => d.severity === 'high');
        if (highSeverityDisputes.length > 0) {
          targetDispute = highSeverityDisputes[0];
        } else {
          targetDispute = recommendedDisputes[0];
        }
      }
      
      if (targetDispute) {
        // Store selected dispute for reference
        setSelectedDiscrepancy(targetDispute);
        
        // Generate response about creating the dispute
        const generatingMessage: MessageType = {
          id: Date.now().toString(),
          content: `I'll generate a dispute letter for the issue with ${targetDispute.accountName} regarding the ${targetDispute.reason.toLowerCase()} reported by ${targetDispute.bureau}. The letter will cite relevant FCRA regulations and include all necessary details.`,
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, generatingMessage]);
        setIsAgentTyping(true);
        
        // Generate the letter with a real delay to show that work is being done
        setTimeout(async () => {
          try {
            // Create user info with defaults if profile properties are missing
            const userInfo = {
              name: profile?.full_name || "[YOUR NAME]",
              address: "[YOUR ADDRESS]", // Default as these are not in the Profile type
              city: "[CITY]",
              state: "[STATE]",
              zip: "[ZIP]"
            };
            
            // Actually generate the letter - this is async now
            const letterContent = await generateDisputeLetterForDiscrepancy(targetDispute, userInfo);
            
            const disputeData = {
              bureau: targetDispute.bureau,
              accountName: targetDispute.accountName,
              accountNumber: targetDispute.accountNumber,
              errorType: targetDispute.reason,
              explanation: targetDispute.description,
              timestamp: new Date(),
              letterContent: letterContent
            };
            
            // Notify parent component about generated dispute
            if (onGenerateDispute) {
              onGenerateDispute(disputeData);
            }
            
            // Save to Supabase if user is logged in
            if (user && user.id) {
              await saveDisputeLetter(user.id, disputeData);
            }
            
            // If we have sample report data loaded, mention it
            let successMessage = `I've generated your dispute letter for ${targetDispute.accountName}! It includes all relevant details about the ${targetDispute.reason.toLowerCase()} and cites the appropriate FCRA regulations.`;
            
            if (sampleReportsLoaded) {
              successMessage += ` The letter incorporates language from previously successful dispute letters for similar issues.`;
            }
            
            successMessage += ` You can now download it or send it directly to ${targetDispute.bureau}.`;
            
            const generatedResponse: MessageType = {
              id: Date.now().toString(),
              content: successMessage,
              sender: 'agent',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, generatedResponse]);
            setDisputeGenerated(true);
          } catch (error) {
            console.error("Error generating dispute letter:", error);
            
            const errorMessage: MessageType = {
              id: Date.now().toString(),
              content: `I encountered an error while generating your dispute letter: ${error instanceof Error ? error.message : "Unknown error"}. Please try again.`,
              sender: 'agent',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, errorMessage]);
          } finally {
            setIsAgentTyping(false);
          }
        }, 3000);
        
        return;
      }
    }
    
    // Handle upload requests
    if (
      lowerCaseMessage.includes('upload') || 
      lowerCaseMessage.includes('credit report') || 
      lowerCaseMessage.includes('attach') || 
      lowerCaseMessage.includes('file')
    ) {
      const response: MessageType = {
        id: Date.now().toString(),
        content: "I'd be happy to analyze your credit report. Please upload your credit report file using the attachment button below, and I'll automatically identify any discrepancies or errors across the three credit bureaus.",
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      setIsAgentTyping(false);
      return;
    }
    
    // Handle initial inquiry about disputes
    if (
      lowerCaseMessage.includes('dispute') || 
      lowerCaseMessage.includes('letter') || 
      lowerCaseMessage.includes('error') ||
      lowerCaseMessage.includes('inaccurate') ||
      lowerCaseMessage.includes('incorrect')
    ) {
      // If we already have report data, reference it
      if (reportData && reportData.analysisResults) {
        const response: MessageType = {
          id: Date.now().toString(),
          content: "Based on the credit report you uploaded, I've already identified some discrepancies that you can dispute. Would you like me to help you create dispute letters for any of these issues?",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
      } else {
        const response: MessageType = {
          id: Date.now().toString(),
          content: "I can help you identify errors and create dispute letters. To get started, please upload your credit report file using the attachment button below. I'll automatically analyze it and find discrepancies between the credit bureaus.",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
      }
      
      setIsAgentTyping(false);
      return;
    }
    
    // Default response if no specific patterns matched
    const defaultResponse: MessageType = {
      id: Date.now().toString(),
      content: "I'm here to help analyze your credit reports and create dispute letters for any errors or discrepancies I find. Upload your credit report using the attachment button, and I'll automatically scan for issues across all three bureaus.",
      sender: 'agent',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, defaultResponse]);
    setIsAgentTyping(false);
  };
  
  const generateDisputeLetter = (dispute: DisputeType) => {
    // Enhanced letter template with FCRA citations and legal language
    const bureauAddresses = {
      'experian': 'Experian\nP.O. Box 4500\nAllen, TX 75013',
      'equifax': 'Equifax Information Services LLC\nP.O. Box 740256\nAtlanta, GA 30374',
      'transunion': 'TransUnion LLC\nConsumer Dispute Center\nP.O. Box 2000\nChester, PA 19016'
    };
    
    const bureau = dispute.bureau.toLowerCase();
    const bureauAddress = bureauAddresses[bureau as keyof typeof bureauAddresses] || '[BUREAU ADDRESS]';
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Try to find appropriate sample language based on dispute type
    let additionalLanguage = "";
    if (samplePhrases) {
      if (dispute.errorType.toLowerCase().includes('balance')) {
        additionalLanguage = samplePhrases.balanceDisputes?.[0] || "";
      } else if (dispute.errorType.toLowerCase().includes('late') || dispute.errorType.toLowerCase().includes('payment')) {
        additionalLanguage = samplePhrases.latePaymentDisputes?.[0] || "";
      } else if (dispute.errorType.toLowerCase().includes('not mine') || dispute.errorType.toLowerCase().includes('fraud')) {
        additionalLanguage = samplePhrases.accountOwnershipDisputes?.[0] || "";
      } else if (dispute.errorType.toLowerCase().includes('closed')) {
        additionalLanguage = samplePhrases.closedAccountDisputes?.[0] || "";
      }
    }
    
    // Add the sample language if available
    const explanation = additionalLanguage ? 
      `${dispute.explanation}\n\n${additionalLanguage}` : 
      dispute.explanation;
    
    return `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

${currentDate}

${dispute.bureau}
${bureauAddress}

Re: Dispute of Inaccurate Information - Account #[ACCOUNT NUMBER]

To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from ${dispute.bureau}, I have identified the following item that is inaccurate and requires investigation and correction:

Account Name: ${dispute.accountName}
Account Number: [ACCOUNT NUMBER]
Reason for Dispute: ${dispute.errorType}

This information is inaccurate because: ${explanation}

Under Section 611(a) of the FCRA, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, Section 623 of the FCRA places responsibilities on furnishers of information to provide accurate data to consumer reporting agencies.

I request that you:
1. Conduct a thorough investigation of this disputed information
2. Forward all relevant information to the furnisher of this information
3. Provide me with copies of any documentation used to verify this debt
4. Remove the disputed item if it cannot be properly verified
5. Send me an updated copy of my credit report showing the results of your investigation

Please complete your investigation within the 30-day timeframe (or 45 days if based on information I provide) as required by the FCRA. If you have any questions or need additional information, please contact me at the address listed above.

Sincerely,

[YOUR SIGNATURE]
[YOUR PRINTED NAME]

Enclosures:
- Copy of credit report with disputed item highlighted
- [LIST ANY SUPPORTING DOCUMENTATION]
    `;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const resetConversation = () => {
    setMessages([]);
    setCurrentDispute(null);
    setDisputeGenerated(false);
    setReportData(null);
    setSelectedDiscrepancy(null);
    
    // Add back welcome message
    setTimeout(() => {
      const welcomeMessage: MessageType = {
        id: Date.now().toString(),
        content: `Hello${profile?.full_name ? ' ' + profile.full_name.split(' ')[0] : ''}! I'm ${AGENT_NAME}, your ${AGENT_FULL_NAME}. I can help you analyze your credit reports and automatically identify errors and discrepancies across all three bureaus. Upload your credit report to get started!`,
        sender: 'agent',
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    }, 300);
  };
  
  // Async helper function to get sample dispute language
  const getSampleDisputeLanguage = async (accountName: string, field: string, bureau: string): Promise<string> => {
    try {
      // Import from creditReportParser
      const { getSampleDisputeLanguage } = await import('@/utils/creditReportParser');
      
      // Call the actual function
      return await getSampleDisputeLanguage(accountName, field, bureau);
    } catch (error) {
      console.error("Error getting sample dispute language:", error);
      
      // Fallback to a default response if the function fails
      let disputeType = 'general';
      const fieldLower = field.toLowerCase();
      
      if (fieldLower.includes('balance')) {
        disputeType = 'balance';
      } else if (fieldLower.includes('payment') || fieldLower.includes('late')) {
        disputeType = 'late_payment';
      } else if (fieldLower.includes('status')) {
        disputeType = 'account_status';
      } else if (fieldLower.includes('date')) {
        disputeType = 'dates';
      } else if (accountName === "Personal Information") {
        disputeType = 'personal_information';
      }
      
      const defaultLanguage = {
        'balance': 'The balance shown on this account is incorrect and does not reflect my actual financial obligation. This error violates Metro 2 reporting standards which require accurate balance reporting.',
        'late_payment': 'This account is incorrectly reported as delinquent. According to my records, all payments have been made on time. This error violates FCRA Section 623 which requires furnishers to report accurate information.',
        'account_status': 'The account status is being reported incorrectly. This violates FCRA accuracy requirements and Metro 2 standards for proper status code reporting.',
        'dates': 'The dates associated with this account are inaccurate and do not align with the actual account history. This violates Metro 2 standards for date reporting.',
        'personal_information': 'My personal information is reported incorrectly. This error affects my credit profile and violates FCRA requirements for accurate consumer information.'
      };
      
      return defaultLanguage[disputeType as keyof typeof defaultLanguage] || 
        `The ${field} for this account is being inaccurately reported by ${bureau}. This information is incorrect and should be investigated and corrected.`;
    }
  };
  
  // Render a discrepancy item with action button
  const renderDiscrepancy = (discrepancy: RecommendedDispute, index: number) => {
    return (
      <div 
        key={`${discrepancy.accountName}-${discrepancy.reason}-${index}`}
        className="bg-white dark:bg-credify-navy/40 rounded-lg p-3 mb-2 border border-gray-200 dark:border-gray-700/50 shadow-sm"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${
              discrepancy.severity === 'high' 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : discrepancy.severity === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : 'bg-blue-100 dark:bg-blue-900/30'
            }`}>
              <AlertCircle size={14} className={`${
                discrepancy.severity === 'high' 
                  ? 'text-red-600 dark:text-red-400' 
                  : discrepancy.severity === 'medium'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <h4 className="font-medium text-credify-navy dark:text-white text-sm">
              {discrepancy.accountName}
            </h4>
          </div>
          <span className="text-xs bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 px-2 py-0.5 rounded">
            {discrepancy.bureau}
          </span>
        </div>
        <p className="text-xs text-credify-navy-light dark:text-white/70 mb-2">
          {discrepancy.description}
        </p>
        {discrepancy.sampleDisputeLanguage && (
          <div className="flex items-start gap-1 text-xs text-credify-navy-light dark:text-white/70 mb-2 p-1 bg-credify-teal/5 border border-credify-teal/10 rounded">
            <Lightbulb size={12} className="text-credify-teal mt-0.5 shrink-0" />
            <p className="italic">{discrepancy.sampleDisputeLanguage.substring(0, 100)}...</p>
          </div>
        )}
        <button
          onClick={() => {
            setInputValue(`Generate a dispute letter for the issue with ${discrepancy.accountName} reported by ${discrepancy.bureau}`);
            setTimeout(() => handleSendMessage(), 100);
          }}
          className="text-xs bg-credify-teal/10 text-credify-teal hover:bg-credify-teal/20 transition-colors rounded px-2 py-1 flex items-center gap-1"
        >
          <FileText size={12} />
          <span>Create Dispute Letter</span>
        </button>
      </div>
    );
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.text"
        className="hidden"
      />
      
      {/* Chat bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="bg-white dark:bg-credify-navy/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700/50 w-full max-w-md mb-4 flex flex-col"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 480 }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700/30">
              <div className="flex items-center gap-3">
                <AgentAvatar size="sm" isSpeaking={isAgentTyping} />
                <div>
                  <h3 className="font-semibold text-credify-navy dark:text-white flex items-center gap-1">
                    {AGENT_NAME}
                    <span className="bg-credify-teal/10 text-credify-teal text-xs px-1.5 py-0.5 rounded-full ml-1">AI</span>
                  </h3>
                  <p className="text-xs text-credify-navy-light dark:text-white/70">{AGENT_FULL_NAME}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={resetConversation}
                  className="p-1.5 text-gray-500 hover:text-credify-navy dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-full transition-colors"
                  title="New conversation"
                >
                  <FileText size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-credify-navy dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-full transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'agent' && (
                    <div className="mr-2 mt-1">
                      <AgentAvatar size="sm" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[85%] p-3 rounded-xl shadow-sm ${
                      message.sender === 'user' 
                        ? 'bg-credify-teal text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-credify-navy/60 text-credify-navy dark:text-white rounded-tl-none'
                    }`}
                  >
                    {message.isFileUpload ? (
                      <div className="flex items-center gap-2">
                        <FileUp size={16} />
                        <span>{message.content}</span>
                      </div>
                    ) : (
                      message.content
                    )}
                    
                    {/* Render discrepancies list if this message has them */}
                    {message.hasDiscrepancies && message.discrepancies && message.discrepancies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600/30">
                        <h4 className="font-medium text-sm mb-2">Discrepancies Found:</h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                          {message.discrepancies.slice(0, 3).map((discrepancy, index) => 
                            renderDiscrepancy(discrepancy, index)
                          )}
                          {message.discrepancies.length > 3 && (
                            <div className="text-center text-xs">
                              + {message.discrepancies.length - 3} more issues found
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isAgentTyping && (
                <div className="flex justify-start">
                  <div className="mr-2 mt-1">
                    <AgentAvatar size="sm" isSpeaking={true} />
                  </div>
                  <div className="bg-gray-100 dark:bg-credify-navy/60 text-credify-navy dark:text-white p-3 rounded-xl rounded-tl-none shadow-sm flex items-center">
                    <span className="flex gap-1">
                      <span className="animate-bounce">•</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                    </span>
                  </div>
                </div>
              )}
              
              {/* Processing indicator for file uploads */}
              {isProcessingFile && !isAgentTyping && (
                <div className="flex justify-center my-2">
                  <div className="bg-credify-teal/10 text-credify-navy dark:text-white border border-credify-teal/30 rounded-lg p-2 flex items-center gap-2 text-sm">
                    <Loader2 size={16} className="animate-spin text-credify-teal" />
                    <span>Analyzing your credit report...</span>
                  </div>
                </div>
              )}
              
              {disputeGenerated && (
                <div className="flex justify-center">
                  <div className="bg-credify-teal/10 text-credify-teal border border-credify-teal/20 rounded-xl p-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Check size={16} className="text-credify-teal" />
                      <span className="font-medium">Dispute Letter Generated</span>
                    </div>
                    <button 
                      className="bg-credify-teal text-white py-1.5 px-3 rounded-lg text-sm flex items-center gap-1.5"
                      onClick={() => {
                        // This would trigger the download or preview in the parent component
                        if (onGenerateDispute && selectedDiscrepancy) {
                          const userInfo = {
                            name: profile?.full_name || "[YOUR NAME]",
                            address: "[YOUR ADDRESS]", // Default values since these are not in Profile type
                            city: "[CITY]",
                            state: "[STATE]",
                            zip: "[ZIP]"
                          };
                          
                          // Note: This is async but we're using it in an event handler
                          // so we need to handle it with care
                          generateDisputeLetterForDiscrepancy(selectedDiscrepancy, userInfo)
                            .then(letterContent => {
                              onGenerateDispute({
                                bureau: selectedDiscrepancy.bureau,
                                accountName: selectedDiscrepancy.accountName,
                                accountNumber: selectedDiscrepancy.accountNumber,
                                errorType: selectedDiscrepancy.reason,
                                explanation: selectedDiscrepancy.description,
                                timestamp: new Date(),
                                letterContent: letterContent
                              });
                            })
                            .catch(error => {
                              console.error("Error generating letter for download:", error);
                              toast({
                                title: "Error",
                                description: "Failed to generate dispute letter. Please try again.",
                                variant: "destructive",
                              });
                            });
                        } else if (onGenerateDispute && currentDispute) {
                          onGenerateDispute({
                            ...currentDispute,
                            timestamp: new Date(),
                            letterContent: generateDisputeLetter(currentDispute as DisputeType)
                          });
                        }
                      }}
                    >
                      <Download size={14} />
                      <span>Download Letter</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700/30">
              <div className="flex items-center bg-gray-100 dark:bg-credify-navy/40 rounded-full px-3 py-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:outline-none py-2 px-1 text-credify-navy dark:text-white"
                  disabled={isAgentTyping || isProcessingFile}
                />
                <button 
                  className={`p-2 text-credify-teal ${isProcessingFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-credify-teal/10'} rounded-full transition-colors`}
                  onClick={handleFileSelect}
                  disabled={isProcessingFile}
                  aria-label="Upload credit report"
                >
                  <Upload size={18} />
                </button>
                <button 
                  className={`p-2 text-white bg-credify-teal rounded-full transition-colors ${
                    !inputValue.trim() || isAgentTyping || isProcessingFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-credify-teal-dark'
                  }`}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isAgentTyping || isProcessingFile}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-credify-teal hover:bg-credify-teal-dark text-white px-4 py-3 rounded-full shadow-lg transition-colors"
        aria-label="Open AI assistant"
      >
        {!isOpen ? (
          <>
            <AgentAvatar size="sm" />
            <span className="font-medium">Ask {AGENT_NAME}</span>
            <Sparkles size={16} className="text-white/70" />
          </>
        ) : (
          <X size={24} />
        )}
      </motion.button>
    </div>
  );
};

export default DisputeAgent;
