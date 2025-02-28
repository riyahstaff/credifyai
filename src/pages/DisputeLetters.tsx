
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DisputeAgent from '../components/ai/DisputeAgent';
import DisputePreview from '../components/disputes/DisputePreview';
import DisputeGenerator from '../components/disputes/DisputeGenerator';
import { FileText, Plus, Download, Mail, Eye, Filter, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DisputeLetters = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'sent' | 'resolved'>('all');
  const [showPreview, setShowPreview] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<string>("letters");
  
  // Sample data for dispute letters
  const [letters, setLetters] = useState([
    {
      id: 1,
      title: 'Duplicate Account Dispute (Bank of America)',
      recipient: 'Experian',
      createdAt: 'May 10, 2023',
      status: 'in-progress',
      bureaus: ['Experian', 'TransUnion'],
      laws: ['FCRA § 611', 'FCRA § 623'],
      content: `Dear Experian,\n\nI am writing to dispute a duplicate account appearing on my credit report. The Bank of America account appears twice with different account numbers. This is affecting my credit utilization ratio negatively.\n\nUnder the Fair Credit Reporting Act, I request that you investigate this matter and remove the duplicate entry.\n\nSincerely,\n[YOUR NAME]`
    },
    {
      id: 2,
      title: 'Incorrect Balance Dispute (Chase Card)',
      recipient: 'All Bureaus',
      createdAt: 'Apr 22, 2023',
      status: 'resolved',
      bureaus: ['Experian', 'Equifax', 'TransUnion'],
      laws: ['FCRA § 623'],
      resolvedAt: 'May 12, 2023',
      content: `Dear Credit Bureau,\n\nI am writing to dispute an incorrect balance on my Chase credit card. The current balance is reported as $8,450, but my actual balance is $4,225.\n\nPlease investigate this matter as required by the FCRA and update the information accordingly.\n\nSincerely,\n[YOUR NAME]`
    },
    {
      id: 3,
      title: 'Outdated Address Information Dispute',
      recipient: 'Equifax',
      createdAt: 'May 5, 2023',
      status: 'in-progress',
      bureaus: ['Equifax'],
      laws: ['FCRA § 605'],
      content: `Dear Equifax,\n\nI am writing to request that you update the address information on my credit report. My current report shows an old address that I haven't lived at for over 3 years.\n\nPlease update this information as required by the FCRA.\n\nSincerely,\n[YOUR NAME]`
    },
    {
      id: 4,
      title: 'Late Payment Dispute (Capital One)',
      recipient: 'TransUnion',
      createdAt: 'Mar 15, 2023',
      status: 'resolved',
      bureaus: ['TransUnion'],
      laws: ['FCRA § 623'],
      resolvedAt: 'Apr 10, 2023',
      content: `Dear TransUnion,\n\nI am writing to dispute a late payment record on my Capital One account. I have always made payments on time, and I have included proof of my payment history.\n\nPlease investigate this matter and remove the incorrect late payment notation.\n\nSincerely,\n[YOUR NAME]`
    },
    {
      id: 5,
      title: 'Hard Inquiry Dispute (Unknown Source)',
      recipient: 'All Bureaus',
      createdAt: 'May 1, 2023',
      status: 'in-progress',
      bureaus: ['Experian', 'Equifax', 'TransUnion'],
      laws: ['FCRA § 604', 'FCRA § 611'],
      content: `Dear Credit Bureau,\n\nI am writing to dispute an unauthorized hard inquiry on my credit report. I did not authorize this inquiry and suspect it may be fraudulent.\n\nUnder the FCRA, I request that you investigate and remove this unauthorized inquiry.\n\nSincerely,\n[YOUR NAME]`
    },
  ]);

  const filteredLetters = (() => {
    switch (activeTab) {
      case 'drafts':
        return letters.filter(letter => letter.status === 'draft');
      case 'sent':
        return letters.filter(letter => letter.status === 'in-progress');
      case 'resolved':
        return letters.filter(letter => letter.status === 'resolved');
      default:
        return letters;
    }
  })();
  
  const handleGenerateDispute = (disputeData: any) => {
    // Create a new letter from the dispute data
    console.log('Generated dispute:', disputeData);
    
    const newLetter = {
      id: Date.now(),
      title: `${disputeData.errorType} Dispute (${disputeData.accountName})`,
      recipient: disputeData.bureau,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'draft',
      bureaus: [disputeData.bureau],
      laws: ['FCRA § 611', 'FCRA § 623'],
      content: disputeData.letterContent
    };
    
    // Add the new letter to the letters array
    setLetters(prevLetters => [newLetter, ...prevLetters]);
    
    // Set the current letter and show the preview
    setCurrentLetter(newLetter);
    setShowPreview(true);
    
    toast({
      title: "Dispute letter created",
      description: "Your dispute letter has been generated and is ready for review.",
      duration: 5000,
    });
    
    // Switch to the letters view to show the newly created letter
    setSelectedView("letters");
  };
  
  const handleDownloadLetter = () => {
    if (!currentLetter) return;
    
    // Create text file with letter content
    const element = document.createElement('a');
    const file = new Blob([currentLetter.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${currentLetter.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Letter downloaded",
      description: "Your dispute letter has been downloaded to your device.",
    });
  };
  
  const handleSendLetter = () => {
    // In a real implementation, this would send the letter via API or email
    if (!currentLetter) return;
    
    // Update the letter status to in-progress
    setLetters(prevLetters => 
      prevLetters.map(letter => 
        letter.id === currentLetter.id 
          ? { ...letter, status: 'in-progress' } 
          : letter
      )
    );
    
    toast({
      title: "Letter queued for sending",
      description: "Your dispute letter will be sent to the credit bureau.",
    });
    
    setShowPreview(false);
  };
  
  const handleViewLetter = (letter: any) => {
    setCurrentLetter(letter);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-1">Dispute Letters</h1>
              <p className="text-credify-navy-light dark:text-white/70">Create and manage your credit dispute letters</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSelectedView("generator")}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>Create New Letter</span>
              </button>
            </div>
          </div>
          
          <Tabs value={selectedView} onValueChange={setSelectedView} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="letters">My Letters</TabsTrigger>
              <TabsTrigger value="generator">Create New Letter</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="letters">
              {/* Letters Tab Content */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  {/* Tabs */}
                  <div className="flex border border-gray-200 dark:border-gray-700/50 rounded-lg overflow-hidden">
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'all'
                          ? 'bg-credify-teal text-white'
                          : 'bg-white dark:bg-credify-navy/40 text-credify-navy-light dark:text-white/70 hover:bg-gray-50 dark:hover:bg-credify-navy/60'
                      }`}
                      onClick={() => setActiveTab('all')}
                    >
                      All Letters
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'sent'
                          ? 'bg-credify-teal text-white'
                          : 'bg-white dark:bg-credify-navy/40 text-credify-navy-light dark:text-white/70 hover:bg-gray-50 dark:hover:bg-credify-navy/60'
                      }`}
                      onClick={() => setActiveTab('sent')}
                    >
                      In Progress
                    </button>
                    <button
                      className={`py-2 px-4 text-sm font-medium ${
                        activeTab === 'resolved'
                          ? 'bg-credify-teal text-white'
                          : 'bg-white dark:bg-credify-navy/40 text-credify-navy-light dark:text-white/70 hover:bg-gray-50 dark:hover:bg-credify-navy/60'
                      }`}
                      onClick={() => setActiveTab('resolved')}
                    >
                      Resolved
                    </button>
                  </div>
                  
                  {/* Search & Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 text-credify-navy dark:text-white text-sm rounded-lg focus:ring-credify-teal focus:border-credify-teal block w-full pl-10 p-2.5"
                        placeholder="Search letters..."
                      />
                    </div>
                    
                    <button className="p-2.5 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg text-credify-navy-light dark:text-white/70 hover:bg-gray-50 dark:hover:bg-credify-navy/60">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Letters List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-credify-navy-light dark:text-white/70 uppercase bg-gray-50 dark:bg-gray-800/30">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-tl-lg">Letter Title</th>
                        <th scope="col" className="px-4 py-3">Recipient</th>
                        <th scope="col" className="px-4 py-3">Date Created</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLetters.map((letter, index) => (
                        <tr 
                          key={letter.id} 
                          className={`border-b border-gray-200 dark:border-gray-700/30 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/10 ${
                            index === filteredLetters.length - 1 ? 'rounded-b-lg' : ''
                          }`}
                        >
                          <td className="px-4 py-4 font-medium text-credify-navy dark:text-white">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-credify-teal/10">
                                <FileText size={18} className="text-credify-teal" />
                              </div>
                              <button 
                                onClick={() => handleViewLetter(letter)}
                                className="hover:text-credify-teal transition-colors text-left"
                              >
                                {letter.title}
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-credify-navy-light dark:text-white/70">
                            {letter.recipient}
                          </td>
                          <td className="px-4 py-4 text-credify-navy-light dark:text-white/70">
                            {letter.createdAt}
                          </td>
                          <td className="px-4 py-4">
                            {letter.status === 'in-progress' ? (
                              <div className="flex items-center gap-1.5 text-yellow-700 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-2.5 py-0.5 rounded-full text-xs w-fit">
                                <Clock size={12} />
                                <span>In Progress</span>
                              </div>
                            ) : letter.status === 'resolved' ? (
                              <div className="flex items-center gap-1.5 text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 rounded-full text-xs w-fit">
                                <CheckCircle size={12} />
                                <span>Resolved</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-2.5 py-0.5 rounded-full text-xs w-fit">
                                <AlertCircle size={12} />
                                <span>Draft</span>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                title="View"
                                className="p-1.5 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg transition-colors"
                                onClick={() => handleViewLetter(letter)}
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                title="Download"
                                className="p-1.5 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg transition-colors"
                                onClick={() => {
                                  setCurrentLetter(letter);
                                  handleDownloadLetter();
                                }}
                              >
                                <Download size={18} />
                              </button>
                              <button 
                                title="Send"
                                className="p-1.5 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg transition-colors"
                                onClick={() => {
                                  setCurrentLetter(letter);
                                  handleSendLetter();
                                }}
                              >
                                <Mail size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Empty State (conditionally rendered when no letters match filter) */}
                {filteredLetters.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                      <FileText className="text-credify-navy-light dark:text-white/50" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-credify-navy dark:text-white mb-2">No dispute letters found</h3>
                    <p className="text-credify-navy-light dark:text-white/70 mb-6">
                      {activeTab === 'all' 
                        ? "You haven't created any dispute letters yet." 
                        : `You don't have any ${activeTab} letters.`}
                    </p>
                    <button
                      onClick={() => setSelectedView("generator")}
                      className="btn-primary"
                    >
                      Create Your First Letter
                    </button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="generator">
              {/* Generator Tab Content */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-4 md:p-6">
                <h2 className="text-xl font-bold text-credify-navy dark:text-white mb-6">Create Dispute Letter</h2>
                
                <DisputeGenerator onGenerateDispute={handleGenerateDispute} />
              </div>
            </TabsContent>
            
            <TabsContent value="templates">
              {/* Templates Tab Content */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-4 md:p-6">
                <h2 className="text-xl font-bold text-credify-navy dark:text-white mb-6">Letter Templates</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Template Card */}
                  <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-5 hover:shadow-md transition-all card-hover">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-credify-teal/10">
                        <FileText size={24} className="text-credify-teal" />
                      </div>
                      <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
                        Standard Dispute Letter
                      </h3>
                    </div>
                    
                    <p className="text-credify-navy-light dark:text-white/70 mb-4">
                      General-purpose dispute letter for addressing a wide range of credit report errors.
                    </p>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedView("generator")}
                        className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
                      >
                        Use Template →
                      </button>
                    </div>
                  </div>
                  
                  {/* Template Card */}
                  <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-5 hover:shadow-md transition-all card-hover">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-credify-teal/10">
                        <FileText size={24} className="text-credify-teal" />
                      </div>
                      <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
                        Debt Verification
                      </h3>
                    </div>
                    
                    <p className="text-credify-navy-light dark:text-white/70 mb-4">
                      Request debt validation and verification for accounts reported to credit bureaus.
                    </p>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedView("generator")}
                        className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
                      >
                        Use Template →
                      </button>
                    </div>
                  </div>
                  
                  {/* Template Card */}
                  <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-5 hover:shadow-md transition-all card-hover">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-credify-teal/10">
                        <FileText size={24} className="text-credify-teal" />
                      </div>
                      <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
                        Fraud Alert Letter
                      </h3>
                    </div>
                    
                    <p className="text-credify-navy-light dark:text-white/70 mb-4">
                      Dispute fraudulent accounts or inquiries that appear on your credit report.
                    </p>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedView("generator")}
                        className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
                      >
                        Use Template →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* FCRA Compliance Section */}
          <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl font-bold text-credify-navy dark:text-white mb-4">
                  FCRA-Compliant Dispute Letters
                </h2>
                
                <p className="text-credify-navy-light dark:text-white/70 mb-6">
                  All letters generated by Credify A.I. are fully compliant with the Fair Credit Reporting Act (FCRA) and cite relevant legal sections to strengthen your disputes.
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-credify-teal mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-credify-navy-light dark:text-white/70">
                      <strong className="text-credify-navy dark:text-white">Legally sound language</strong> that clearly states your rights under the FCRA
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-credify-teal mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-credify-navy-light dark:text-white/70">
                      <strong className="text-credify-navy dark:text-white">Specific citations</strong> to relevant FCRA sections applicable to your situation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-credify-teal mt-0.5 flex-shrink-0" size={18} />
                    <span className="text-credify-navy-light dark:text-white/70">
                      <strong className="text-credify-navy dark:text-white">Clear timelines</strong> for credit bureaus to investigate and respond to your dispute
                    </span>
                  </li>
                </ul>
                
                <button
                  onClick={() => setSelectedView("generator")}
                  className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
                >
                  Create your FCRA-compliant letter →
                </button>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800/30 p-6 rounded-lg">
                <div className="p-4 bg-white dark:bg-credify-navy/60 rounded border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700/30 pb-4 mb-4">
                    <FileText className="text-credify-teal" size={24} />
                    <div>
                      <h3 className="font-medium text-credify-navy dark:text-white">Sample Dispute Letter</h3>
                      <p className="text-xs text-credify-navy-light dark:text-white/70">Section 611 FCRA Dispute</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-credify-navy-light dark:text-white/70">
                    <p>[Your Name]</p>
                    <p>[Your Address]</p>
                    <p>[City, State ZIP]</p>
                    <p className="pt-2">[Date]</p>
                    <p className="pt-2">[Credit Bureau Name]</p>
                    <p>[Bureau Address]</p>
                    <p>[City, State ZIP]</p>
                    
                    <p className="pt-3 text-credify-navy dark:text-white">RE: Dispute of Inaccurate Information</p>
                    
                    <p className="pt-3">To Whom It May Concern:</p>
                    
                    <p className="pt-2">I am writing to dispute inaccurate information in my credit report. I have identified the following item(s) that should be corrected:</p>
                    
                    <p className="pt-2 italic text-credify-navy dark:text-white font-medium">
                      [Description of disputed item, account number, and reason for dispute]
                    </p>
                    
                    <p className="pt-2">According to Section 611 of the Fair Credit Reporting Act (FCRA), you are required to conduct a reasonable investigation into this matter...</p>
                    
                    <p className="text-center pt-2 italic">[Letter continues...]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* AI Agent Component */}
      <DisputeAgent onGenerateDispute={handleGenerateDispute} />
      
      {/* Dispute Preview Modal */}
      {showPreview && currentLetter && (
        <DisputePreview 
          letterContent={currentLetter.content || "Your dispute letter content will appear here."}
          onClose={() => setShowPreview(false)}
          onDownload={handleDownloadLetter}
          onSend={handleSendLetter}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default DisputeLetters;
