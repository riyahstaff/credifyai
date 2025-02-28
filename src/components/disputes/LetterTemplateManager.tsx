
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Copy, FileText, Check } from 'lucide-react';

interface LetterTemplate {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

interface LetterTemplateManagerProps {
  onSelectTemplate: (template: LetterTemplate) => void;
}

const LetterTemplateManager: React.FC<LetterTemplateManagerProps> = ({ onSelectTemplate }) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<LetterTemplate[]>([
    {
      id: '1',
      name: 'Standard FCRA Dispute',
      content: `
To Whom It May Concern:

I am writing in accordance with my rights under the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681 et seq., to dispute inaccurate information appearing on my credit report.

After reviewing my credit report from [BUREAU], I have identified the following item(s) that are inaccurate or incomplete:

Account Name: [ACCOUNT_NAME]
Account Number: [ACCOUNT_NUMBER]
Reason for Dispute: [DISPUTE_REASON]

This information is [inaccurate/incomplete] because [EXPLANATION]. I have attached supporting documentation that verifies my claim.

Under Section 611(a) of the FCRA, you are required to conduct a reasonable investigation into this matter and remove or correct any information that cannot be verified. Additionally, under Section 623 of the FCRA, data furnishers are required to provide accurate information to consumer reporting agencies.

Please investigate this matter and correct your records within the 30-day timeframe provided by the FCRA. Furthermore, please provide me with notification of the results of your investigation.

Sincerely,
[YOUR_NAME]
      `,
      createdAt: new Date('2023-08-15'),
    },
    {
      id: '2',
      name: 'Advanced Debt Validation',
      content: `
To Whom It May Concern:

Re: Account #[ACCOUNT_NUMBER] with [ACCOUNT_NAME]

I am writing to dispute the information that [ACCOUNT_NAME] has furnished to the credit reporting agencies regarding my account #[ACCOUNT_NUMBER].

I hereby demand validation and verification of this alleged debt pursuant to the Fair Debt Collection Practices Act (FDCPA) and the Fair Credit Reporting Act (FCRA). I specifically request that you provide all of the following:

1. Complete account and transaction records showing how the reported balance was calculated
2. A copy of any signed agreement between myself and the original creditor
3. Documentation showing your legal right to report this account
4. Verification that the statute of limitations on this debt has not expired
5. Proof that you have complied with all applicable state laws regarding debt collection

Until this debt is validated, I demand that you cease reporting this disputed information to any credit reporting agency. According to the FCRA, unverified information must be removed from my credit report.

If you cannot provide the above documentation within 30 days as required by law, you must remove all references to this account from my credit report immediately and notify me when this action has been completed.

This letter is not an acknowledgment that I owe this debt and does not restart any statute of limitations.

Sincerely,
[YOUR_NAME]
      `,
      createdAt: new Date('2023-09-22'),
    },
    {
      id: '3',
      name: 'Identity Theft Dispute',
      content: `
To: [BUREAU]
[BUREAU_ADDRESS]

Re: Identity Theft Dispute - Request for Block under FCRA Section 605B

To Whom It May Concern:

I am a victim of identity theft and I am writing to request that you block the following fraudulent information from my credit report, pursuant to Section 605B of the Fair Credit Reporting Act (FCRA), 15 U.S.C. § 1681c-2:

Account Name: [ACCOUNT_NAME]
Account Number: [ACCOUNT_NUMBER]
Fraudulent Items: [SPECIFIC_ITEMS]

I have discovered this fraudulent account on my credit report dated [REPORT_DATE]. I did not open or authorize this account, nor did I authorize anyone else to do so.

Enclosed with this letter is:
1. A copy of my identity theft report filed with [POLICE_DEPARTMENT/FTC]
2. A copy of my government-issued identification
3. A copy of proof of address

As required by the FCRA, I am hereby certifying that:
1. The information identified above resulted from identity theft
2. I did not authorize anyone to use my identity to establish the account(s) listed
3. I am providing this declaration under penalty of perjury

Under Section 605B, you are required to block this fraudulent information from my credit report within four business days after receiving this request. Additionally, you must promptly notify the furnisher of this information that it may be the result of identity theft.

Please confirm in writing when you have completed this action.

Sincerely,
[YOUR_NAME]
      `,
      createdAt: new Date('2023-10-05'),
    }
  ]);
  
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setTemplateContent(content);
        
        // Try to extract a name from the first line if no name is set
        if (!templateName) {
          const firstLine = content.split('\n')[0].trim();
          if (firstLine && firstLine.length < 50) {
            setTemplateName(firstLine);
          } else {
            setTemplateName(file.name.replace(/\.[^/.]+$/, ""));
          }
        }
        
        toast({
          title: "Template loaded",
          description: "Letter template content has been loaded.",
        });
      } catch (error) {
        toast({
          title: "Error loading template",
          description: "Failed to read the template file. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleSaveTemplate = () => {
    if (!templateName || !templateContent) {
      toast({
        title: "Missing information",
        description: "Please provide a template name and content.",
        variant: "destructive",
      });
      return;
    }
    
    const newTemplate: LetterTemplate = {
      id: Date.now().toString(),
      name: templateName,
      content: templateContent,
      createdAt: new Date(),
    };
    
    setTemplates([...templates, newTemplate]);
    
    toast({
      title: "Template saved",
      description: "Your letter template has been saved successfully.",
    });
    
    // Reset form
    setTemplateName('');
    setTemplateContent('');
    setFileUploadOpen(false);
  };
  
  const handleSelectTemplate = (template: LetterTemplate) => {
    onSelectTemplate(template);
    
    toast({
      title: "Template selected",
      description: `"${template.name}" will be used for your dispute letter.`,
    });
  };
  
  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setTemplates(templates.filter(template => template.id !== id));
    
    toast({
      title: "Template deleted",
      description: "The letter template has been removed.",
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  return (
    <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
          Letter Templates
        </h3>
        
        <button
          onClick={() => setFileUploadOpen(!fileUploadOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-credify-teal text-white rounded-lg hover:bg-credify-teal-dark transition-colors"
        >
          <Upload size={16} />
          <span>Upload Template</span>
        </button>
      </div>
      
      {fileUploadOpen && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-credify-navy/40 rounded-lg">
          <h4 className="font-medium text-credify-navy dark:text-white mb-3">
            Add New Template
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Template Name
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-credify-navy/60 border border-gray-200 dark:border-gray-700/50 rounded-lg"
                placeholder="Enter a name for this template"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Upload File
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept=".txt,.text,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                  />
                  <div className="w-full px-3 py-2 bg-white dark:bg-credify-navy/60 border border-gray-200 dark:border-gray-700/50 border-dashed rounded-lg text-credify-navy-light dark:text-white/70 text-sm flex items-center justify-center">
                    <Upload size={16} className="mr-2" />
                    <span>Choose a file or drag & drop</span>
                  </div>
                </div>
                <span className="text-xs text-credify-navy-light dark:text-white/70">
                  or
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-credify-navy-light dark:text-white/70 mb-1">
                Template Content
              </label>
              <textarea
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-credify-navy/60 border border-gray-200 dark:border-gray-700/50 rounded-lg min-h-[200px]"
                placeholder="Paste your template text here..."
              ></textarea>
              <p className="mt-1 text-xs text-credify-navy-light dark:text-white/70">
                Use placeholders like [ACCOUNT_NAME], [DISPUTE_REASON], etc. for dynamic content.
              </p>
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFileUploadOpen(false)}
                className="px-4 py-2 text-credify-navy-light dark:text-white/70 hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-credify-teal text-white rounded-lg hover:bg-credify-teal-dark transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className="border border-gray-200 dark:border-gray-700/30 rounded-lg p-3 hover:border-credify-teal dark:hover:border-credify-teal/70 hover:shadow-sm cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-credify-teal/10 rounded-md">
                  <FileText size={18} className="text-credify-teal" />
                </div>
                <div>
                  <h4 className="font-medium text-credify-navy dark:text-white">
                    {template.name}
                  </h4>
                  <p className="text-xs text-credify-navy-light dark:text-white/70">
                    Added {formatDate(template.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(template.content);
                    toast({
                      title: "Copied",
                      description: "Template content copied to clipboard",
                    });
                  }}
                  className="p-1.5 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={(e) => handleDeleteTemplate(template.id, e)}
                  className="p-1.5 text-credify-navy-light hover:text-red-500 dark:text-white/70 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-credify-navy/60 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LetterTemplateManager;
