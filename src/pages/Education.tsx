import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  Book, 
  Search, 
  Play, 
  FileText, 
  BookOpen, 
  ChevronRight, 
  Tag, 
  Clock, 
  ArrowUpRight, 
  Award, 
  BarChart, 
  CreditCard, 
  DollarSign, 
  Check,
  BriefcaseBusiness,
  FileLock2,
  AlertTriangle,
  FileBarChart,
  HandCoins,
  History
} from 'lucide-react';

const Education = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'basics', name: 'Credit Basics' },
    { id: 'repair', name: 'Credit Repair' },
    { id: 'laws', name: 'Legal Rights' },
    { id: 'disputes', name: 'Dispute Strategies' },
    { id: 'scores', name: 'Credit Scores' },
    { id: 'debt', name: 'Debt Management' },
  ];

  const featuredArticles = [
    {
      id: 1,
      title: 'Understanding Your FICO Score: The 5 Key Factors',
      excerpt: 'Learn how payment history (35%), credit utilization (30%), length of credit history (15%), new credit (10%), and credit mix (10%) impact your FICO score and what you can do to improve each factor.',
      category: 'scores',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      icon: <BarChart size={18} className="text-credify-teal" />,
      slug: 'understanding-fico-score'
    },
    {
      id: 2,
      title: 'How to Dispute Errors on Your Credit Report',
      excerpt: 'A comprehensive guide to identifying errors on your credit report and effectively disputing them with the credit bureaus using sample letters, timelines, and what to expect during the process.',
      category: 'disputes',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      icon: <FileText size={18} className="text-credify-teal" />,
      slug: 'dispute-credit-report-errors'
    },
    {
      id: 3,
      title: 'Your Rights Under the Fair Credit Reporting Act',
      excerpt: 'A detailed breakdown of the FCRA, how it protects consumers, and the specific rights it grants you regarding your credit information, including how to enforce these rights when they\'re violated.',
      category: 'laws',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      icon: <Award size={18} className="text-credify-teal" />,
      slug: 'fcra-consumer-rights'
    },
  ];

  const articles = [
    ...featuredArticles,
    {
      id: 4,
      title: 'Credit Utilization: Why 30% Is the Magic Number',
      excerpt: 'Discover why keeping your credit utilization below 30% is crucial for your credit score, how it\'s calculated across individual and total accounts, and actionable strategies to lower it quickly and effectively.',
      category: 'basics',
      readTime: '6 min read',
      icon: <CreditCard size={18} className="text-credify-teal" />,
      slug: 'credit-utilization-strategies'
    },
    {
      id: 5,
      title: 'The Statute of Limitations on Credit Reporting',
      excerpt: 'Learn about the time limits for how long negative items can legally remain on your credit report, what happens when debts reach their statute of limitations, and how to handle time-barred debt collection attempts.',
      category: 'laws',
      readTime: '7 min read',
      icon: <History size={18} className="text-credify-teal" />,
      slug: 'credit-reporting-time-limits'
    },
    {
      id: 6,
      title: 'How to Write an Effective Goodwill Letter',
      excerpt: 'Master the art of goodwill letters with our step-by-step guide, including real-world templates that have helped consumers remove late payments, collections, and other negative items through creditor goodwill.',
      category: 'repair',
      readTime: '9 min read',
      icon: <FileText size={18} className="text-credify-teal" />,
      slug: 'goodwill-letter-guide'
    },
    {
      id: 7,
      title: 'Rebuilding Your Credit After Bankruptcy',
      excerpt: 'A roadmap for credit recovery following bankruptcy, including when to apply for new credit, which products work best for rebuilding, and how to establish positive payment history while avoiding common pitfalls.',
      category: 'repair',
      readTime: '11 min read',
      icon: <DollarSign size={18} className="text-credify-teal" />,
      slug: 'rebuild-credit-after-bankruptcy'
    },
    {
      id: 8,
      title: 'Debt Validation: Your First Line of Defense',
      excerpt: 'Everything you need to know about debt validation letters: when to send them, what to include, your legal rights under the FDCPA, and how to respond when collectors fail to validate debts properly.',
      category: 'disputes',
      readTime: '8 min read',
      icon: <FileLock2 size={18} className="text-credify-teal" />,
      slug: 'debt-validation-guide'
    },
    {
      id: 9,
      title: 'Understanding Hard vs. Soft Credit Inquiries',
      excerpt: 'A complete explanation of how credit inquiries work, which types affect your score, how long they impact your credit, and strategic ways to minimize the effect of necessary hard inquiries.',
      category: 'basics',
      readTime: '5 min read',
      icon: <Search size={18} className="text-credify-teal" />,
      slug: 'hard-soft-credit-inquiries'
    },
    {
      id: 10,
      title: 'The Debt Snowball vs. Avalanche Method',
      excerpt: 'Compare the two most effective debt payoff strategies: the emotionally satisfying snowball method and the mathematically optimal avalanche approach. Learn which one suits your financial situation and personality.',
      category: 'debt',
      readTime: '7 min read',
      icon: <HandCoins size={18} className="text-credify-teal" />,
      slug: 'debt-payoff-methods'
    },
    {
      id: 11,
      title: 'How Credit Scoring Models Differ: FICO vs. VantageScore',
      excerpt: 'An in-depth comparison of the two major credit scoring models, their calculation differences, which lenders use each type, and how to optimize your credit profile for both scoring systems.',
      category: 'scores',
      readTime: '9 min read',
      icon: <FileBarChart size={18} className="text-credify-teal" />,
      slug: 'fico-vs-vantagescore'
    },
    {
      id: 12,
      title: 'Recognizing and Avoiding Credit Repair Scams',
      excerpt: 'Learn to identify warning signs of fraudulent credit repair companies, understand what legitimate services can and cannot legally promise, and how to protect yourself while improving your credit.',
      category: 'repair',
      readTime: '6 min read',
      icon: <AlertTriangle size={18} className="text-credify-teal" />,
      slug: 'credit-repair-scams'
    },
    {
      id: 13,
      title: 'How Collection Accounts Affect Your Credit Score',
      excerpt: 'Everything about collections: how they impact your score, the effect of paying vs. settling, strategies for removal, and newer scoring models that treat paid collections differently.',
      category: 'basics',
      readTime: '8 min read',
      icon: <BriefcaseBusiness size={18} className="text-credify-teal" />,
      slug: 'collections-impact-credit'
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'How to Deal with Debt Collectors: Expert Strategies',
      description: 'Learn effective strategies for handling debt collectors, understanding your rights, and negotiating settlements that work in your favor while protecting your financial future.',
      duration: '15:35',
      thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      slug: 'deal-with-debt-collectors',
      videoId: 'WiIe2FzRsFc'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredVideos = videos.filter(video => 
    searchQuery === '' || 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-credify-navy dark:text-white mb-4">Credit Education Center</h1>
            <p className="text-lg text-credify-navy-light dark:text-white/70 max-w-3xl">
              Expand your knowledge with our comprehensive library of credit education resources, from beginner basics to advanced dispute strategies.
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto mb-12">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white dark:bg-credify-navy/40 border border-gray-200 dark:border-gray-700/50 text-credify-navy dark:text-white rounded-xl focus:ring-credify-teal focus:border-credify-teal block w-full pl-12 p-4 shadow-sm"
              placeholder="Search for articles, videos, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-credify-navy dark:text-white mb-6">Featured Resources</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <div 
                  key={article.id} 
                  className="relative group rounded-xl overflow-hidden shadow-md h-64 card-hover"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10"></div>
                  
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                    <div className="flex items-center gap-1.5 text-white text-xs font-medium mb-2">
                      <Tag size={14} />
                      <span className="capitalize">{article.category}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {article.title}
                    </h3>
                    
                    <div className="flex items-center text-white/80 text-xs mb-4">
                      <Clock size={14} className="mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                    
                    <Link 
                      to={`/education/articles/${article.slug}`}
                      className="inline-flex items-center text-credify-teal bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Read Article
                      <ArrowUpRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-16">
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-credify-teal text-white'
                      : 'bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/education/articles/${article.slug}`}
                  className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 hover:shadow-md transition-all card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-credify-teal/10">
                      {article.icon}
                    </div>
                    <div className="flex items-center text-xs text-credify-navy-light dark:text-white/70">
                      <Clock size={14} className="mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-credify-navy dark:text-white mb-3">
                    {article.title}
                  </h3>
                  
                  <p className="text-credify-navy-light dark:text-white/70 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 capitalize">
                      {article.category}
                    </div>
                    
                    <div className="text-credify-teal font-medium text-sm flex items-center">
                      Read More
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="text-credify-navy-light dark:text-white/50" size={24} />
                </div>
                <h3 className="text-lg font-medium text-credify-navy dark:text-white mb-2">No articles found</h3>
                <p className="text-credify-navy-light dark:text-white/70 mb-6">
                  We couldn't find any articles matching your search. Please try different keywords or categories.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="bg-credify-teal hover:bg-credify-teal-dark text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  View All Articles
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-credify-navy dark:text-white">Video Tutorials</h2>
              <Link 
                to="/education/videos" 
                className="text-credify-teal hover:text-credify-teal-dark dark:hover:text-credify-teal-light font-medium transition-colors"
              >
                View All Videos
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 overflow-hidden hover:shadow-md transition-all card-hover"
                >
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-credify-teal flex items-center justify-center">
                        <Play className="text-white ml-1" size={24} />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-credify-navy dark:text-white mb-2">
                      {video.title}
                    </h3>
                    <p className="text-credify-navy-light dark:text-white/70 text-sm line-clamp-2">
                      {video.description}
                    </p>
                    <Link 
                      to={`/education/videos/${video.slug}`}
                      className="inline-flex items-center text-credify-teal mt-3 text-sm font-medium"
                    >
                      Watch Video
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-credify-navy text-white rounded-xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                  <Award size={16} className="mr-2" />
                  <span className="text-sm font-medium">Exclusive Guide</span>
                </div>
                
                <h2 className="text-3xl font-bold mb-4">
                  The Complete FCRA Playbook
                </h2>
                
                <p className="text-white/80 mb-6">
                  Master the Fair Credit Reporting Act with our comprehensive guide. Learn how to leverage federal law to effectively dispute errors, protect your rights, and improve your credit score.
                </p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-credify-teal flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-white/90">
                      Section-by-section breakdown of the FCRA
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-credify-teal flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-white/90">
                      Sample dispute letters for every situation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-credify-teal flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-white/90">
                      Legal timelines and deadlines for bureaus and creditors
                    </span>
                  </li>
                </ul>
                
                <Link 
                  to="/education/fcra-guide"
                  className="inline-flex items-center bg-credify-teal hover:bg-credify-teal-light transition-colors text-white font-medium px-6 py-3 rounded-lg"
                >
                  Download Free Guide
                  <ArrowUpRight size={18} className="ml-2" />
                </Link>
              </div>
              
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="FCRA Guide" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-credify-navy/20"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Education;
