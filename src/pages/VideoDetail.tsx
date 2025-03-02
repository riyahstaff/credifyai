
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
  CalendarDays, 
  ThumbsUp, 
  MessageSquare,
  Bookmark,
  PlaySquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const VideoDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  // In a real app, you would fetch this data from an API
  // This is just a sample video with detailed content
  const video = {
    id: 2,
    title: "The 5 Most Effective Dispute Techniques That Actually Work",
    description: "Learn proven dispute strategies that go beyond the basics, including procedural requests, method of verification demands, and escalation tactics when bureaus are unresponsive.",
    duration: "22:15",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder - in a real app, use actual video embed
    publishDate: "March 10, 2024",
    views: "12,843",
    category: "disputes",
    author: {
      name: "Michael Roberts",
      title: "Credit Repair Specialist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
    },
    transcript: `
      <h3>Introduction</h3>
      <p>Hello and welcome to another credit repair masterclass. I'm Michael Roberts, and today we're diving deep into five advanced dispute techniques that actually work in today's credit reporting environment.</p>
      <p>If you've tried disputing before with little success, or if you want to make sure your first disputes are as effective as possible, this video is for you. We're going beyond the basics and looking at strategies that address both the legal and procedural aspects of the dispute process.</p>
      
      <h3>Why Basic Disputes Often Fail</h3>
      <p>Before we get into the techniques, let's understand why basic disputes often fail. Credit bureaus process millions of disputes, and many are handled by automated systems. A simple statement like "This account isn't mine" without supporting details or specific challenges often results in a quick verification with no real investigation.</p>
      <p>The bureaus are required by law to conduct a reasonable investigation, but what constitutes "reasonable" is the key. Our techniques are designed to demand more thorough investigations and put pressure points on the system's weaknesses.</p>
      
      <h3>Technique #1: Procedural Violation Disputes</h3>
      <p>The first technique focuses on procedural violations by the credit bureaus or furnishers (the companies reporting information about you).</p>
      <p>The FCRA outlines specific procedures that must be followed when information is reported or when disputes are processed. When these procedures aren't followed, you have grounds for a dispute based not on the accuracy of the information, but on the procedural violation itself.</p>
      <p>Examples include:</p>
      <ul>
        <li>Information reported without proper notice to the consumer</li>
        <li>Reinsertion of previously deleted information without proper notification</li>
        <li>Failure to provide required disclosures</li>
        <li>Failure to forward all relevant information to the furnisher</li>
      </ul>
      <p>When using this technique, cite the specific section of the FCRA that has been violated, explain the violation clearly, and request removal on these grounds.</p>
      
      <h3>Technique #2: Method of Verification Demands</h3>
      <p>The second technique involves demanding details about how your dispute was verified.</p>
      <p>When a bureau responds that an item has been "verified," they rarely explain how it was verified. Under the FCRA, you have the right to know the method of verification used.</p>
      <p>Send a follow-up letter demanding:</p>
      <ul>
        <li>The name of the person who verified the information</li>
        <li>Their position and qualifications</li>
        <li>The specific documents they reviewed</li>
        <li>The date and time the verification occurred</li>
        <li>Whether they relied solely on computerized matching</li>
      </ul>
      <p>Often, bureaus won't be able or willing to provide this information, which strengthens your position for a follow-up dispute or even legal action if necessary.</p>
      
      <h3>Technique #3: Debt Validation Leverage</h3>
      <p>The third technique leverages the debt validation process under the Fair Debt Collection Practices Act (FDCPA).</p>
      <p>If a collection account appears on your report, you can send a debt validation letter to the collector within 30 days of their first contact. If they can't validate the debt, they legally can't continue collection activities or report the debt.</p>
      <p>Even outside the 30-day window, requesting validation can be effective. If they fail to provide proper validation but continue reporting, you now have a solid basis for a FCRA dispute with the bureaus, citing the collector's failure to validate.</p>
      <p>In your dispute, include copies of your validation request and the inadequate response (or note the lack of response).</p>
      
      <h3>Technique #4: Disputing with Original Creditors</h3>
      <p>The fourth technique involves going directly to the source: the original creditor.</p>
      <p>Many consumers focus solely on the credit bureaus, but original creditors have their own dispute processes and are directly responsible for the accuracy of what they report.</p>
      <p>Contact the creditor's customer service department and ask for their credit reporting dispute address (it's often different from their regular correspondence address).</p>
      <p>When disputing with the original creditor:</p>
      <ul>
        <li>Be specific about what information is incorrect</li>
        <li>Provide any supporting documentation</li>
        <li>Request that they update all three major bureaus with the correction</li>
        <li>Follow up with the bureaus after the creditor responds to ensure the information was updated</li>
      </ul>
      <p>This technique is particularly effective for issues like incorrect late payment reporting or account status errors.</p>
      
      <h3>Technique #5: Escalation to Executive Offices</h3>
      <p>The fifth and final technique is escalation to executive offices when standard channels fail.</p>
      <p>If you've gone through the normal dispute process without success, it's time to escalate. Both creditors and credit bureaus have executive customer service departments that can override standard procedures.</p>
      <p>Find the name and address of a high-level executive (usually available through LinkedIn or the company website) and write a professionally-toned letter explaining:</p>
      <ul>
        <li>Your previous attempts to resolve the issue</li>
        <li>Why the standard process failed you</li>
        <li>The impact this is having on your financial life</li>
        <li>Your desired resolution</li>
      </ul>
      <p>Executive offices often have more authority to resolve issues, especially when you present yourself as a reasonable consumer who has been wronged by their systems.</p>
      
      <h3>Putting It All Together</h3>
      <p>The most effective approach often combines multiple techniques, starting with the less aggressive options and escalating as needed.</p>
      <p>Document everything throughout the process. Keep copies of all letters sent and received, notes from phone calls, and any other relevant information. This documentation is crucial if you need to take legal action later.</p>
      <p>Remember, credit repair is often a marathon, not a sprint. Persistence and proper technique are key to success.</p>
      
      <h3>Case Study Example</h3>
      <p>Let me share a real-world example of how these techniques worked for one of my clients. Sarah had a collection account for a medical bill she had already paid to the original provider. The collection agency wouldn't remove it, and initial disputes with the bureaus were unsuccessful.</p>
      <p>We implemented Technique #3 first, sending a debt validation letter that the collector couldn't adequately respond to. We then filed a dispute with the bureaus using Technique #1, citing procedural violations in reporting an invalid debt. When that didn't work, we escalated to the bureau's executive office using Technique #5.</p>
      <p>Within two weeks of the executive office contact, the item was removed from all three reports.</p>
      
      <h3>Conclusion</h3>
      <p>That wraps up our five advanced dispute techniques. Remember, the key is to be specific, persistent, and knowledgeable about your rights under the law.</p>
      <p>In the description below, I've included links to template letters for each technique we discussed today. If you found this helpful, please give the video a thumbs up and subscribe for more credit repair strategies.</p>
      <p>Thanks for watching, and I'll see you in the next video where we'll cover how to rebuild your credit after successful disputes.</p>
    `,
    relatedVideos: [
      {
        id: 1,
        title: "Credit Report Walkthrough: How to Read & Understand Your Report",
        duration: "18:24",
        thumbnail: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        slug: "credit-report-walkthrough"
      },
      {
        id: 3,
        title: "How to Negotiate with Debt Collectors (Live Example)",
        duration: "31:07",
        thumbnail: "https://images.unsplash.com/photo-1573164574472-797cdf4a583a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        slug: "debt-collector-negotiation"
      },
      {
        id: 5,
        title: "DIY Credit Repair: Create Your Personal Action Plan",
        duration: "28:53",
        thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        slug: "diy-credit-repair-plan"
      }
    ]
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "The video link has been copied to your clipboard.",
      duration: 3000,
    });
  };

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-credify-navy dark:text-white mb-4">Video not found</h1>
            <p className="text-credify-navy-light dark:text-white/70 mb-6">
              Sorry, the video you're looking for doesn't exist or has been moved.
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
          
          {/* Video Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="col-span-8">
              {/* Video Player */}
              <div className="aspect-video w-full bg-gray-900 rounded-xl overflow-hidden mb-6">
                <iframe 
                  src={video.videoUrl} 
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Video Info */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-credify-teal/10 text-credify-teal capitalize">
                    {video.category}
                  </span>
                  <span className="text-xs text-credify-navy-light dark:text-white/60 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {video.duration}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-credify-navy dark:text-white mb-4">
                  {video.title}
                </h1>
                
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={video.author.image} 
                      alt={video.author.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-credify-navy dark:text-white">
                        {video.author.name}
                      </h3>
                      <p className="text-sm text-credify-navy-light dark:text-white/60">
                        {video.author.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-credify-navy-light dark:text-white/60">
                    <div className="flex items-center">
                      <CalendarDays size={14} className="mr-1" />
                      <span>{video.publishDate}</span>
                    </div>
                    <div className="flex items-center">
                      <PlaySquare size={14} className="mr-1" />
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-credify-navy-light dark:text-white/80 mb-6">
                  {video.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ThumbsUp size={16} />
                    Like
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Bookmark size={16} />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={copyLinkToClipboard}>
                    <Share2 size={16} />
                    Share
                  </Button>
                </div>
              </div>
              
              {/* Transcript */}
              <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 mb-8">
                <h2 className="text-xl font-semibold text-credify-navy dark:text-white mb-4">
                  Video Transcript
                </h2>
                <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-credify-navy dark:prose-headings:text-white prose-p:text-credify-navy-light dark:prose-p:text-white/80 prose-strong:text-credify-navy dark:prose-strong:text-white overflow-y-auto max-h-[600px] pr-4">
                  <div dangerouslySetInnerHTML={{ __html: video.transcript }} />
                </div>
              </div>
              
              {/* Tags */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700/30">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-credify-navy-light dark:text-white/70 mr-2">
                    <Tag size={16} className="inline mr-1" />
                    Topics:
                  </span>
                  <Link
                    to={`/education?category=disputes`}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Dispute Strategies
                  </Link>
                  <Link
                    to={`/education?category=laws`}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800/50 text-credify-navy-light dark:text-white/70 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    Legal Rights
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
                <h3 className="font-medium text-credify-navy dark:text-white mb-4">Share this video</h3>
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
                {/* Related Videos */}
                <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700/30 p-6 mb-6">
                  <h3 className="font-semibold text-lg text-credify-navy dark:text-white mb-4">Related Videos</h3>
                  <div className="space-y-4">
                    {video.relatedVideos.map((relatedVideo) => (
                      <Link 
                        key={relatedVideo.id}
                        to={`/education/videos/${relatedVideo.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                          <img 
                            src={relatedVideo.thumbnail} 
                            alt={relatedVideo.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                            {relatedVideo.duration}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-credify-navy dark:text-white group-hover:text-credify-teal transition-colors line-clamp-2">
                            {relatedVideo.title}
                          </h4>
                        </div>
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

export default VideoDetail;
