
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Send, 
  Paperclip, 
  FileText, 
  AlertCircle, 
  X, 
  Download, 
  MessageSquare, 
  Sparkles,
  CreditCard,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditReportData, 
  RecommendedDispute,
  getSuccessfulDisputePhrases,
} from '@/utils/creditReportParser';
import { useToast } from '@/hooks/use-toast';
import { saveDisputeLetter } from '@/lib/supabase';
import { MessageType } from './types';
import ChatHeader from './chat/ChatHeader';
import ChatMessages from './chat/ChatMessages';
import ChatInput from './chat/ChatInput';
import AgentAvatar from './AgentAvatar';
import { 
  generateManualDisputeLetter, 
  generateAutomaticDisputeLetter, 
  DisputeType, 
  getSampleDisputeLanguage 
} from './services/disputeService';
import { useReportAnalysis } from './hooks/useReportAnalysis';
import { Link } from 'react-router-dom';

interface DisputeAgentProps {
  onGenerateDispute?: (disputeData: any) => void;
}

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
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<RecommendedDispute | null>(null);

  const { 
    reportData, 
    setReportData, 
    isProcessingFile, 
    setIsProcessingFile, 
    sampleReportsLoaded, 
    samplePhrases, 
    processReport 
  } = useReportAnalysis();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus on input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);
  
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
  
  // Check subscription status
  const hasSubscription = profile?.has_subscription === true;
  
  // Modified handleSendMessage to check subscription
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Check for subscription if user is trying to use functionality
    if (!hasSubscription && inputValue.trim().toLowerCase().includes('dispute')) {
      // Add user message
      const userMessage: MessageType = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      
      // Add subscription required message
      const subscriptionMessage: MessageType = {
        id: Date.now().toString(),
        content: "I'd love to help you with dispute letters, but this feature requires a premium subscription. Would you like to upgrade to access the dispute letter generator and AI analysis?",
        sender: 'agent',
        timestamp: new Date(),
        requiresSubscription: true,
      };
      
      setMessages(prev => [...prev, subscriptionMessage]);
      return;
    }
    
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
    
    // Process the report
    const data = await processReport(file, (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    if (data) {
      // Now handle the analysis results
      await handleReportAnalysis(data);
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
      
      // If no analysis results exist or they're empty, create some default ones
      if (!data.analysisResults || !data.analysisResults.recommendedDisputes || data.analysisResults.recommendedDisputes.length === 0) {
        console.log("No discrepancies found in analysis, generating defaults from accounts");
        
        // Create default disputes from accounts
        const defaultDisputes: RecommendedDispute[] = [];
        
        // If we have accounts, create a dispute for each one
        if (data.accounts && data.accounts.length > 0) {
          data.accounts.forEach(account => {
            // Look for negative remarks or late payments first
            if (account.remarks && account.remarks.length > 0) {
              defaultDisputes.push({
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                bureau: account.bureau || 'All Bureaus',
                reason: 'Negative Remark',
                description: `The negative remarks on this ${account.accountName} account are inaccurate and should be removed.`,
                severity: 'high',
                legalBasis: [{
                  law: 'FCRA',
                  section: 'Section 611(a)',
                  description: 'Requires investigation of disputed information'
                }]
              });
            } 
            // Check for late payments
            else if (account.paymentStatus && (
                account.paymentStatus.toLowerCase().includes('late') ||
                account.paymentStatus.toLowerCase().includes('delinquent') ||
                account.paymentStatus.toLowerCase().includes('collection')
            )) {
              defaultDisputes.push({
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                bureau: account.bureau || 'All Bureaus',
                reason: 'Late Payment',
                description: `The late payment record on this ${account.accountName} account is inaccurate and should be corrected.`,
                severity: 'high',
                legalBasis: [{
                  law: 'FCRA',
                  section: 'Section 611(a)',
                  description: 'Requires investigation of disputed information'
                }]
              });
            }
            // Default for all accounts - balance verification
            else {
              defaultDisputes.push({
                accountName: account.accountName,
                accountNumber: account.accountNumber,
                bureau: account.bureau || 'All Bureaus',
                reason: 'Account Verification',
                description: `Please verify all information for this ${account.accountName} account including balance, payment history, and account status.`,
                severity: 'medium',
                legalBasis: [{
                  law: 'FCRA',
                  section: 'Section 611(a)',
                  description: 'Requires investigation of disputed information'
                }]
              });
            }
          });
        }
        
        // If we couldn't extract accounts or create disputes, create a generic one
        if (defaultDisputes.length === 0) {
          console.log("Creating generic dispute since no accounts were found");
          defaultDisputes.push({
            accountName: "Unknown Account",
            bureau: "All Bureaus",
            reason: "Credit Report Information",
            description: "I dispute all negative items on my credit report as potentially inaccurate and request full verification.",
            severity: "high",
            legalBasis: [{
              law: 'FCRA',
              section: 'Section 611(a)',
              description: 'Requires investigation of disputed information'
            }]
          });
        }
        
        // Create analysis results
        if (!data.analysisResults) {
          data.analysisResults = {
            totalDiscrepancies: defaultDisputes.length,
            highSeverityIssues: defaultDisputes.filter(d => d.severity === 'high').length,
            accountsWithIssues: defaultDisputes.length,
            recommendedDisputes: defaultDisputes
          };
        } else {
          data.analysisResults.recommendedDisputes = defaultDisputes;
          data.analysisResults.totalDiscrepancies = defaultDisputes.length;
          data.analysisResults.highSeverityIssues = defaultDisputes.filter(d => d.severity === 'high').length;
          data.analysisResults.accountsWithIssues = defaultDisputes.length;
        }
        
        setReportData({...data});
        
        // Create message about found issues
        const foundIssuesMessage: MessageType = {
          id: Date.now().toString(),
          content: `I've analyzed your credit report and identified ${defaultDisputes.length} potential issues that could be disputed. Would you like me to help you create dispute letters for these items?`,
          sender: 'agent',
          timestamp: new Date(),
          hasDiscrepancies: true,
          discrepancies: defaultDisputes,
        };
        
        setMessages(prev => [...prev, foundIssuesMessage]);
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
            return {
              ...dispute,
              sampleDisputeLanguage: await getSampleDisputeLanguage(
                dispute.accountName, 
                dispute.reason, 
                dispute.bureau
              )
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
  
  const handleDiscrepancySelection = (discrepancy: RecommendedDispute) => {
    // Set input value to generate dispute for this specific discrepancy
    setInputValue(`Generate a dispute letter for the issue with ${discrepancy.accountName} reported by ${discrepancy.bureau}`);
    setTimeout(() => handleSendMessage(), 100);
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
            const fullDispute = {
              ...currentDispute,
              explanation: userMessage
            };
            
            const disputeData = {
              ...fullDispute,
              timestamp: new Date(),
              letterContent: generateManualDisputeLetter(fullDispute, samplePhrases)
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
      
      // If user mentioned a specific bureau, filter by that
      if (!targetDispute && (lowerCaseMessage.includes('experian') || 
                           lowerCaseMessage.includes('equifax') || 
                           lowerCaseMessage.includes('transunion'))) {
        let bureau = '';
        if (lowerCaseMessage.includes('experian')) bureau = 'Experian';
        else if (lowerCaseMessage.includes('equifax')) bureau = 'Equifax';
        else if (lowerCaseMessage.includes('transunion')) bureau = 'TransUnion';
        
        const bureauDisputes = recommendedDisputes.filter(d => 
          d.bureau.toLowerCase() === bureau.toLowerCase() || 
          d.bureau.toLowerCase() === 'all bureaus'
        );
        
        if (bureauDisputes.length > 0) {
          targetDispute = bureauDisputes[0];
        }
      }
      
      // If still no specific dispute selected, take the highest priority dispute
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
        console.log("Selected dispute for letter generation:", targetDispute);
        
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
            console.log("Generating letter for dispute:", targetDispute);
            
            // Generate the letter
            const { disputeData, letterContent } = await generateAutomaticDisputeLetter(
              targetDispute,
              profile,
              sampleReportsLoaded
            );
            
            console.log("Letter generated successfully");
            
            // Notify parent component about generated dispute
            if (onGenerateDispute) {
              onGenerateDispute(disputeData);
            }
            
            // Save to Supabase if user is logged in
            if (user && user.id) {
              try {
                await saveDisputeLetter(user.id, disputeData);
                console.log("Letter saved to Supabase");
              } catch (saveError) {
                console.error("Error saving to Supabase, continuing anyway:", saveError);
              }
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
              content: `I encountered an error while generating your dispute letter: ${error instanceof Error ? error.message : "Unknown error"}. Let me try again with a simplified approach.`,
              sender: 'agent',
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, errorMessage]);
            
            // Try again with a fallback approach
            setTimeout(async () => {
              try {
                // Create a simplified dispute letter
                const simplifiedLetter = `
[YOUR NAME]
[YOUR ADDRESS]
[CITY, STATE ZIP]

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${targetDispute.bureau}
[BUREAU ADDRESS]

Re: Dispute of Inaccurate Information - ${targetDispute.accountName}

To Whom It May Concern:

I am writing to dispute the following information in my credit report under the Fair Credit Reporting Act, Section 611(a):

Account Name: ${targetDispute.accountName}
${targetDispute.accountNumber ? `Account Number: ${targetDispute.accountNumber}` : ''}
Reason for Dispute: ${targetDispute.reason}

This information is inaccurate because: ${targetDispute.description}

As required by law, please investigate this matter and remove this inaccurate information from my credit report.

Sincerely,

[YOUR SIGNATURE]
[YOUR NAME]
`;

                // Create dispute data
                const simplifiedDisputeData = {
                  bureau: targetDispute.bureau,
                  accountName: targetDispute.accountName,
                  accountNumber: targetDispute.accountNumber,
                  errorType: targetDispute.reason,
                  explanation: targetDispute.description,
                  timestamp: new Date(),
                  letterContent: simplifiedLetter
                };
                
                // Notify parent component
                if (onGenerateDispute) {
                  onGenerateDispute(simplifiedDisputeData);
                }
                
                const recoveryMessage: MessageType = {
                  id: Date.now().toString(),
                  content: `I've created a simplified dispute letter for the ${targetDispute.accountName} account. You can now download it or send it to ${targetDispute.bureau}.`,
                  sender: 'agent',
                  timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, recoveryMessage]);
                setDisputeGenerated(true);
              } catch (fallbackError) {
                console.error("Even fallback letter generation failed:", fallbackError);
                
                const finalErrorMessage: MessageType = {
                  id: Date.now().toString(),
                  content: `I'm sorry, but I'm having technical difficulties generating the dispute letter. You can still create a dispute letter manually using the letter generator in the Dispute Letters section of the app.`,
                  sender: 'agent',
                  timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, finalErrorMessage]);
              } finally {
                setIsAgentTyping(false);
              }
            }, 2000);
          } finally {
            setIsAgentTyping(false);
          }
        }, 3000);
        
        return;
      } else {
        const noDisputeMessage: MessageType = {
          id: Date.now().toString(),
          content: "I'd be happy to help you create a dispute letter. To get started, please tell me which account on your credit report you'd like to dispute and what issue you're having with it.",
          sender: 'agent',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, noDisputeMessage]);
        setIsAgentTyping(false);
        return;
      }
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
    }, 100);
  };
  
  // Component JSX would be here
  return (
    <div className="relative h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Chat interface components would go here */}
    </div>
  );
};

export default DisputeAgent;
