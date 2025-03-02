
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { 
  ChevronLeft, 
  Clock, 
  Tag, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  ArrowUpRight, 
  CalendarDays 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  // In a real app, you would fetch this data from an API
  // This is just a sample article with detailed content
  const article = {
    title: "Understanding Your FICO Score: The 5 Key Factors",
    category: "scores",
    publishDate: "May 15, 2023",
    updateDate: "April 2, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    author: {
      name: "Rebecca Thompson",
      title: "Credit Specialist",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
    },
    content: `
      <h2>What Makes Up Your FICO Credit Score?</h2>
      <p>Your FICO score is calculated using five main factors, each weighted differently depending on their importance in predicting credit risk. Understanding these factors can help you make informed decisions about your credit behavior and improve your score over time.</p>
      
      <h3>1. Payment History (35%)</h3>
      <p>Your payment history is the most significant factor affecting your credit score, accounting for 35% of the total. This makes sense because lenders are primarily concerned with whether you'll repay what you borrow on time.</p>
      <p>Payment history includes:</p>
      <ul>
        <li>Payment records on credit cards, retail accounts, installment loans, finance company accounts, and mortgage loans</li>
        <li>Public records and collections (bankruptcies, foreclosures, suits, wage attachments, liens, and judgments)</li>
        <li>The severity of delinquency (how late payments were)</li>
        <li>The amount past due on delinquent accounts or collections</li>
        <li>The time since delinquency, derogatory records, or collection items</li>
        <li>The number of past due items on your file</li>
        <li>The number of accounts paid as agreed</li>
      </ul>
      <p><strong>How to improve:</strong> Always pay your bills on time. If you've missed payments, get current and stay current. The longer you pay your bills on time, the better your score will be. Setting up automatic payments or payment reminders can help ensure you never miss a due date.</p>
      
      <h3>2. Credit Utilization (30%)</h3>
      <p>Credit utilization refers to the ratio of your current credit card balances to their credit limits. This factor makes up 30% of your FICO score. A high utilization ratio indicates that you're using a lot of your available credit, which lenders may interpret as a sign of financial distress.</p>
      <p>Credit utilization includes:</p>
      <ul>
        <li>The amount owed on all accounts</li>
        <li>The number of accounts with balances</li>
        <li>The proportion of credit lines used (proportion of balances to total credit limits on revolving accounts)</li>
        <li>The proportion of installment loan amounts still owed compared to the original loan amount</li>
      </ul>
      <p><strong>How to improve:</strong> Keep your credit card balances below 30% of your credit limits – both on individual cards and across all your cards. Lower utilization (under 10%) is even better. Pay down revolving debt rather than moving it around, and keep credit card accounts open even if you don't use them regularly to maintain a higher total available credit.</p>
      
      <h3>3. Length of Credit History (15%)</h3>
      <p>The length of your credit history accounts for 15% of your FICO score. Generally, a longer credit history will increase your score. Even if you haven't been using credit for long, you can still have a good score depending on how well you're managing your credit in other areas.</p>
      <p>This factor considers:</p>
      <ul>
        <li>How long your credit accounts have been established, including the age of your oldest account, the age of your newest account, and an average age of all your accounts</li>
        <li>How long specific credit accounts have been established</li>
        <li>How long it has been since you used certain accounts</li>
      </ul>
      <p><strong>How to improve:</strong> Keep older accounts open to maintain a longer credit history. Think twice before closing old or unused credit cards, as this could shorten your credit history and potentially lower your score. If you're new to credit, avoid opening several new accounts too rapidly.</p>
      
      <h3>4. Credit Mix (10%)</h3>
      <p>The types of credit accounts you have (your "credit mix") constitute 10% of your FICO score. Having a variety of accounts—such as credit cards, retail accounts, installment loans, and mortgage loans—can demonstrate that you can manage different types of credit responsibly.</p>
      <p><strong>How to improve:</strong> Don't open accounts solely to create a better credit mix—this won't raise your score by much and could potentially lower it by adding hard inquiries and reducing your average account age. Instead, focus on maintaining a diverse set of accounts naturally over time.</p>
      
      <h3>5. New Credit (10%)</h3>
      <p>New credit makes up the final 10% of your FICO score. Opening several credit accounts in a short period represents greater risk, especially if you don't have a long credit history.</p>
      <p>This factor includes:</p>
      <ul>
        <li>Number of recently opened accounts and proportion of accounts that are recently opened, by type of account</li>
        <li>Number of recent credit inquiries</li>
        <li>Time since recent account opening(s), by type of account</li>
        <li>Time since credit inquiry(ies)</li>
        <li>Re-establishment of positive credit history following past payment problems</li>
      </ul>
      <p><strong>How to improve:</strong> Research and rate-shop for a given loan within a focused period, such as 30 days. FICO scores distinguish between a search for a single loan and a search for many new credit lines. Only apply for new credit accounts when necessary, and space out credit applications when possible.</p>
      
      <h2>How These Factors Work Together</h2>
      <p>It's important to note that no single factor determines your credit score. Instead, FICO scores consider the mix of information in your credit report. The importance of any factor depends on the overall information in your credit report. For some people, a given factor may be more important than for someone else with a different credit history.</p>
      <p>Your score considers both positive and negative information in your credit report. Late payments will lower your score, but establishing or re-establishing a good track record of making payments on time will raise your score.</p>
      
      <h2>What Isn't in Your FICO Score</h2>
      <p>While many things go into your FICO score calculation, some personal information does not affect your score:</p>
      <ul>
        <li>Your race, color, religion, national origin, sex, or marital status</li>
        <li>Your age</li>
        <li>Your salary, occupation, employer, employment history, or location</li>
        <li>Interest rates on your credit accounts</li>
        <li>"Soft inquiries" (when you check your own credit or when a lender checks it for pre-approved offers)</li>
        <li>Credit counseling participation</li>
        <li>Information not found in your credit report</li>
      </ul>
      
      <h2>Monitoring Your Score</h2>
      <p>Regularly checking your credit score and reports is essential for maintaining good credit health. Many credit card providers offer free FICO score access, and you're entitled to free annual credit reports from each of the three major bureaus through AnnualCreditReport.com.</p>
      <p>By understanding what influences your FICO score and actively managing these factors, you can work toward improving your creditworthiness over time and unlocking better financial opportunities.</p>
    `,
    relatedArticles: [
      {
        id: 11,
        title: "How Credit Scoring Models Differ: FICO vs. VantageScore",
        excerpt: "An in-depth comparison of the two major credit scoring models, their calculation differences, which lenders use each type, and how to optimize your credit profile for both scoring systems.",
        slug: "fico-vs-vantagescore"
      },
      {
        id: 4,
        title: "Credit Utilization: Why 30% Is the Magic Number",
        excerpt: "Discover why keeping your credit utilization below 30% is crucial for your credit score, how it's calculated across individual and total accounts, and actionable strategies to lower it quickly and effectively.",
        slug: "credit-utilization-strategies"
      },
      {
        id: 7,
        title: "Rebuilding Your Credit After Bankruptcy",
        excerpt: "A roadmap for credit recovery following bankruptcy, including when to apply for new credit, which products work best for rebuilding, and how to establish positive payment history while avoiding common pitfalls.",
        slug: "rebuild-credit-after-bankruptcy"
      }
    ]
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "The article link has been copied to your clipboard.",
      duration: 3000,
    });
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-credify-navy dark:text-white mb-4">Article not found</h1>
            <p className="text-credify-navy-light dark:text-white/70 mb-6">
              Sorry, the article you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              to="/education"
              className="inline-flex items-center bg-credify-teal hover:bg-credify-teal-light transition-colors text-white font-medium px-6 py-3 rounded-lg"
            >
              Back to Education
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Link 
              to="/education" 
              className="inline-flex items-center text-credify-navy-light dark:text-white/70 hover:text-credify-teal dark:hover:text-credify-teal transition-colors text-sm"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Education
            </Link>
          </div>
          
          {/* Article Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-credify-teal/10 text-credify-teal capitalize">
                {article.category}
              </span>
              <span className="text-xs text-credify-navy-light dark:text-white/60 flex items-center">
                <Clock size={14} className="mr-1" />
                {article.readTime}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-credify-navy dark:text-white mb-4">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-700/30 pb-6">
              <div className="flex items-center gap-3">
                <img 
                  src={article.author.image} 
                  alt={article.author.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-credify-navy dark:text-white">
                    {article.author.name}
                  </h3>
                  <p className="text-sm text-credify-navy-light dark:text-white/60">
                    {article.author.title}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-credify-navy-light dark:text-white/60">
                <div className="flex items-center">
                  <CalendarDays size={14} className="mr-1" />
                  <span>Published: {article.publishDate}</span>
                </div>
                <div className="hidden md:flex items-center ml-4">
                  <CalendarDays size={14} className="mr-1" />
                  <span>Updated: {article.updateDate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="col-span-8">
              {/* Featured Image */}
              <div className="mb-8 rounded-xl overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Article Body */}
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-credify-navy dark:prose-headings:text-white prose-p:text-credify-navy-light dark:prose-p:text-white/80 prose-strong:text-credify-navy dark:prose-strong:text-white">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700/30">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-credify-navy-light dark:text-white/70 mr-2">
                    <Tag size={16} className="inline mr-1" />
                    Topics:
                  </span>
                  <Link
                    to={`/education?category=scores`}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Credit Scores
                  </Link>
                  <Link
                    to={`/education?category=basics`}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Credit Basics
                  </Link>
                  <Link
                    to={`/education?category=repair`}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Credit Repair
                  </Link>
                </div>
              </div>
              
              {/* Share */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700/30">
                <h3 className="font-medium text-credify-navy dark:text-white mb-4">Share this article</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Facebook size={16} />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Twitter size={16} />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Linkedin size={16} />
                    LinkedIn
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={copyLinkToClipboard}>
                    <Copy size={16} />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="col-span-4">
              <div className="sticky top-24">
                {/* Related Articles */}
                <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 mb-6">
                  <h3 className="font-semibold text-lg text-credify-navy dark:text-white mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {article.relatedArticles.map((relatedArticle) => (
                      <Link 
                        key={relatedArticle.id}
                        to={`/education/articles/${relatedArticle.slug}`}
                        className="block group"
                      >
                        <h4 className="font-medium text-credify-navy dark:text-white group-hover:text-credify-teal transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-credify-navy-light dark:text-white/60 line-clamp-2 mt-1">
                          {relatedArticle.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* CTA */}
                <div className="bg-credify-navy text-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-3">Ready to improve your credit?</h3>
                    <p className="text-white/80 mb-4">
                      Upload your credit report and let our AI-powered tools help you identify issues and generate dispute letters.
                    </p>
                    <Link 
                      to="/upload-report"
                      className="inline-flex items-center bg-credify-teal hover:bg-credify-teal-light transition-colors text-white font-medium px-4 py-2 rounded-lg w-full justify-center"
                    >
                      Upload Your Report
                      <ArrowUpRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
