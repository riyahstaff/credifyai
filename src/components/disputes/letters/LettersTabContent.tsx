
import React, { useState } from 'react';
import { 
  FileText, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  Download,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  laws: string[];
  content: string;
  resolvedAt?: string;
}

interface LettersTabContentProps {
  letters: Letter[];
  isLoading: boolean;
  onViewLetter: (letter: Letter) => void;
  onDownloadLetter: (letter: Letter) => void;
  onSendLetter: (letter: Letter) => void;
  onCreateNewLetter: () => void;
}

const LettersTabContent: React.FC<LettersTabContentProps> = ({
  letters,
  isLoading,
  onViewLetter,
  onDownloadLetter,
  onSendLetter,
  onCreateNewLetter
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'sent' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter letters based on active tab
  const filteredLetters = (() => {
    let filtered = [...letters];
    
    // Apply tab filter
    if (activeTab === 'drafts') {
      filtered = filtered.filter(letter => letter.status === 'draft');
    } else if (activeTab === 'sent') {
      filtered = filtered.filter(letter => letter.status === 'in-progress');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(letter => letter.status === 'resolved');
    }
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(letter => 
        letter.title.toLowerCase().includes(term) || 
        letter.recipient.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  })();
  
  return (
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="p-2.5 bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 rounded-lg text-credify-navy-light dark:text-white/70 hover:bg-gray-50 dark:hover:bg-credify-navy/60">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-credify-teal animate-spin mb-4" />
            <h3 className="text-lg font-medium text-credify-navy dark:text-white">Loading your dispute letters...</h3>
          </div>
        </div>
      ) : (
        <>
          {/* Letters List */}
          {filteredLetters.length > 0 ? (
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
                            onClick={() => onViewLetter(letter)}
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
                            onClick={() => onViewLetter(letter)}
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            title="Download"
                            className="p-1.5 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg transition-colors"
                            onClick={() => onDownloadLetter(letter)}
                          >
                            <Download size={18} />
                          </button>
                          <button 
                            title="Send"
                            className="p-1.5 text-credify-navy-light hover:text-credify-teal dark:text-white/70 dark:hover:text-credify-teal hover:bg-gray-100 dark:hover:bg-gray-800/30 rounded-lg transition-colors"
                            onClick={() => onSendLetter(letter)}
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
          ) : (
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
                onClick={onCreateNewLetter}
                className="btn-primary"
              >
                Create Your First Letter
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LettersTabContent;
