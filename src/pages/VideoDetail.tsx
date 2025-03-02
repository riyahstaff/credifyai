
import React, { useState } from 'react';
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
import { useToast } from "../hooks/use-toast";

const VideoDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  
  // Video database with educational credit repair content
  const videoDatabase = {
    'credit-report-walkthrough': {
      id: 1,
      title: "Credit Report Walkthrough: How to Read & Understand Your Report",
      description: "A complete breakdown of each section of your credit report, what the codes and statuses mean, and how to identify potential errors or discrepancies.",
      duration: "18:24",
      thumbnail: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/Y_EHY25Q-Rg", // Credit report analysis video
      publishDate: "February 15, 2024",
      views: "15,628",
      category: "basics",
      author: {
        name: "Jennifer Parker",
        title: "Consumer Credit Analyst",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      relatedVideos: [
        {
          id: 2,
          title: "The 5 Most Effective Dispute Techniques That Actually Work",
          slug: "effective-dispute-techniques",
          thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "22:15"
        },
        {
          id: 4,
          title: "Building Credit from Scratch: A Beginner's Guide",
          slug: "build-credit-beginners",
          thumbnail: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "15:42"
        },
        {
          id: 5,
          title: "DIY Credit Repair: Create Your Personal Action Plan",
          slug: "diy-credit-repair-plan",
          thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "28:53"
        }
      ],
      transcript: `
        <h3>Introduction</h3>
        <p>Welcome to our Credit Report Walkthrough. Today, we're going to break down each section of your credit report and help you understand what all those codes and numbers actually mean.</p>
        
        <h3>Personal Information Section</h3>
        <p>The first section of your credit report contains your personal information. This includes your name, current and previous addresses, Social Security number, date of birth, and employment information. Always check this section carefully for inaccuracies, as errors here could indicate mixed files or even identity theft.</p>
        
        <h3>Account Information Section</h3>
        <p>Next is the account information section, often the largest part of your report. Here you'll find details about your credit accounts, including credit cards, loans, mortgages, and other debts. Each account lists the creditor name, account number (usually partially masked), opening date, credit limit or loan amount, payment history, and current status.</p>
        
        <h3>Understanding Account Status Codes</h3>
        <p>Account status codes can be confusing. "Current" means the account is paid as agreed. "30, 60, 90" indicates days late. "Charge-off" means the creditor has written off the debt as a loss. "Closed" means the account is no longer active, which can be either positive or negative depending on who closed it and why.</p>
        
        <h3>Public Records Section</h3>
        <p>The public records section contains financially-related legal matters like bankruptcies. Since 2018, civil judgments and tax liens no longer appear on credit reports, so this section should only show bankruptcies if you've had one.</p>
        
        <h3>Credit Inquiries Section</h3>
        <p>The inquiries section shows who has accessed your credit report. Hard inquiries occur when you apply for credit and can affect your score. Soft inquiries happen when you check your own credit or when companies check it for promotional purposes, and these don't impact your score.</p>
        
        <h3>Identifying Potential Errors</h3>
        <p>Now let's look at how to identify errors. Look for accounts you don't recognize, incorrect payment statuses, duplicate accounts, or outdated information that should have aged off your report. Negative information generally stays on your report for seven years, while bankruptcies can remain for up to ten years.</p>
        
        <h3>Analyzing the Impact on Your Credit Score</h3>
        <p>Understanding how each element affects your score is crucial. Payment history has the biggest impact at 35% of your FICO score. Credit utilization accounts for 30%. Length of credit history influences 15%, while new credit and credit mix each affect 10% of your score.</p>
        
        <h3>Conclusion</h3>
        <p>I hope this walkthrough helps you better understand your credit report. In our next video, we'll cover how to dispute errors you might find during your review. If you found this helpful, please give it a thumbs up and subscribe for more credit education.</p>
      `
    },
    'effective-dispute-techniques': {
      id: 2,
      title: "The 5 Most Effective Dispute Techniques That Actually Work",
      description: "Learn proven dispute strategies that go beyond the basics, including procedural requests, method of verification demands, and escalation tactics when bureaus are unresponsive.",
      duration: "22:15",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/TJBgQvjWoSo", // Credit dispute techniques video
      publishDate: "March 10, 2024",
      views: "12,843",
      category: "disputes",
      author: {
        name: "Michael Roberts",
        title: "Credit Repair Specialist",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      relatedVideos: [
        {
          id: 1,
          title: "Credit Report Walkthrough: How to Read & Understand Your Report",
          slug: "credit-report-walkthrough",
          thumbnail: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "18:24"
        },
        {
          id: 3,
          title: "How to Negotiate with Debt Collectors (Live Example)",
          slug: "debt-collector-negotiation",
          thumbnail: "https://images.unsplash.com/photo-1573164574472-797cdf4a583a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "31:07"
        },
        {
          id: 5,
          title: "DIY Credit Repair: Create Your Personal Action Plan",
          slug: "diy-credit-repair-plan",
          thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "28:53"
        }
      ],
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
      `
    },
    'debt-collector-negotiation': {
      id: 3,
      title: "How to Negotiate with Debt Collectors (Live Example)",
      description: "Watch a real debt settlement negotiation call, with analysis of effective tactics, settlement offer frameworks, and how to get agreements in writing before making payments.",
      duration: "31:07",
      thumbnail: "https://images.unsplash.com/photo-1573164574472-797cdf4a583a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/L4N1q4RNi9I", // Debt negotiation video
      publishDate: "January 22, 2024",
      views: "9,754",
      category: "debt",
      author: {
        name: "Alex Wilson",
        title: "Debt Settlement Expert",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      relatedVideos: [
        {
          id: 2,
          title: "The 5 Most Effective Dispute Techniques That Actually Work",
          slug: "effective-dispute-techniques",
          thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "22:15"
        },
        {
          id: 4,
          title: "Building Credit from Scratch: A Beginner's Guide",
          slug: "build-credit-beginners",
          thumbnail: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "15:42"
        },
        {
          id: 5,
          title: "DIY Credit Repair: Create Your Personal Action Plan",
          slug: "diy-credit-repair-plan",
          thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "28:53"
        }
      ],
      transcript: `
        <h3>Introduction</h3>
        <p>Hello everyone, I'm Alex Wilson, and today I'm going to walk you through a real debt settlement negotiation call. What you're about to hear is a recording of an actual negotiation with a debt collector, with permission from my client and with identifying details changed to protect privacy.</p>
        
        <h3>Before the Call: Preparation</h3>
        <p>Before we listen to the call, let's talk about preparation. My client owed approximately $8,200 on a charged-off credit card debt. The account was about 2 years old and had been sold to a third-party collection agency. We had verified the debt was legitimate, checked the statute of limitations (which was still active), and determined that my client could afford to pay about $3,000 as a lump sum settlement.</p>
        
        <h3>Key Negotiation Points</h3>
        <p>As you listen, pay attention to these key negotiation points:</p>
        <ol>
          <li>Starting with a lower offer than what you're willing to pay</li>
          <li>Maintaining a polite but firm tone throughout</li>
          <li>Using silence as a negotiation tactic</li>
          <li>Emphasizing financial hardship</li>
          <li>Getting all details in writing before making payment</li>
        </ol>
        
        <h3>The Negotiation Call (Audio Recording Plays)</h3>
        <p>Collector: "Hello, this is Jason with ABC Collections. How can I help you today?"</p>
        <p>Client: "Hi Jason, I'm calling about account number 12345. I received your letter about my outstanding balance of $8,200."</p>
        <p>Collector: "Yes, I see that account here. We've been trying to reach you. The full balance of $8,226.47 is due. How would you like to make your payment today?"</p>
        <p>Client: "Actually, I'm calling because I want to resolve this debt, but I'm not in a position to pay the full amount. I've been going through some financial difficulties, and I was hoping we could work out a settlement."</p>
        <p>Collector: "I understand. We may be able to offer you a payment plan..."</p>
        <p>Client: "I appreciate that, but I'd prefer to settle the account with a one-time payment. Based on my current situation, I could pay $2,000 to resolve the account completely."</p>
        <p>Collector: "That's only about 24% of the balance. The best we can do is 80%, which would be $6,581."</p>
        <p>Client: "I understand you need to recover as much as possible, but $6,581 is still well beyond what I can afford. My financial situation is quite difficult right now. Would you consider $2,500?"</p>
        <p>Collector: "Let me see what I can do... The lowest I'm authorized to go is 60%, which would be $4,935."</p>
        <p>Client: "I appreciate you working with me, but even at that amount, I would need to borrow money I don't have. The most I could possibly do is $3,000, and that would be a significant stretch for me."</p>
        <p>Collector: "Let me speak with my supervisor and see if there's anything else we can do."</p>
        <p>(2-minute hold)</p>
        <p>Collector: "Thank you for your patience. My supervisor has approved a settlement of $3,700, which is 45% of the balance. That's the absolute lowest we can go."</p>
        <p>Client: "I really want to resolve this, but $3,700 is still more than I have available. $3,000 truly is the maximum I can pay. Would you rather collect $3,000 now or potentially nothing if I have to file for bankruptcy?"</p>
        <p>(Silence for a few seconds)</p>
        <p>Collector: "Alright, I think we can make $3,000 work as a final settlement. But it would need to be paid within 7 days."</p>
        <p>Client: "I can do that. But before I make the payment, I'll need the agreement in writing stating that the $3,000 payment will satisfy the debt in full and that you'll report the account as 'settled in full' to all credit bureaus."</p>
        <p>Collector: "We can email that to you today."</p>
        <p>Client: "Perfect. Once I receive and review the agreement, I'll make the payment within the 7-day timeframe."</p>
        
        <h3>Analysis of the Negotiation</h3>
        <p>Now let's break down what happened in that call:</p>
        <ol>
          <li>Starting low: We began at $2,000 (about 25% of the debt), knowing we could go up to $3,000.</li>
          <li>Emphasizing hardship: Throughout the call, my client stressed their difficult financial situation.</li>
          <li>Strategic silence: After mentioning bankruptcy, we let silence do some of the work.</li>
          <li>Incremental concessions: We moved from $2,000 to $2,500 to $3,000, showing we were at our limit.</li>
          <li>Documentation: We insisted on written confirmation before making any payment.</li>
        </ol>
        
        <h3>The Written Agreement</h3>
        <p>Here's what to look for in the written settlement agreement:</p>
        <ul>
          <li>The correct account number and creditor name</li>
          <li>The settlement amount and that it satisfies the debt "in full"</li>
          <li>How the account will be reported to credit bureaus</li>
          <li>A statement that the collector will not pursue the remaining balance</li>
          <li>Payment instructions and deadline</li>
        </ul>
        <p>Always review this document carefully and keep a copy indefinitely.</p>
        
        <h3>Making the Payment</h3>
        <p>When making the payment:</p>
        <ul>
          <li>Never give direct access to your bank account</li>
          <li>Use a cashier's check, money order, or bank wire</li>
          <li>If you must use a personal check, understand it gives them your account information</li>
          <li>Get a receipt confirming the payment was received</li>
        </ul>
        
        <h3>After the Settlement</h3>
        <p>After settling:</p>
        <ul>
          <li>Monitor your credit reports to ensure the account is reported as agreed</li>
          <li>Keep your settlement documentation forever (seriously, forever)</li>
          <li>Be aware of potential tax implications - forgiven debt over $600 may be reported as income</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>As you heard, with proper preparation and negotiation techniques, it's often possible to settle debts for significantly less than the full amount. The key is to be informed, remain calm, document everything, and know your financial limits before you begin.</p>
        <p>In the description below, I've included a link to a sample settlement letter template you can use as a reference. If you found this video helpful, please like and subscribe for more practical debt management strategies.</p>
        <p>Thanks for watching, and good luck with your own negotiations!</p>
      `
    },
    'build-credit-beginners': {
      id: 4,
      title: "Building Credit from Scratch: A Beginner's Guide",
      description: "The complete roadmap for establishing credit for the first time, including secured cards, credit builder loans, becoming an authorized user, and avoiding common beginner mistakes.",
      duration: "15:42",
      thumbnail: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/K6N6ZnSfcOc", // Credit building video
      publishDate: "April 5, 2024",
      views: "18,349",
      category: "basics",
      author: {
        name: "Emma Chen",
        title: "Financial Educator",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      relatedVideos: [
        {
          id: 1,
          title: "Credit Report Walkthrough: How to Read & Understand Your Report",
          slug: "credit-report-walkthrough",
          thumbnail: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "18:24"
        },
        {
          id: 2,
          title: "The 5 Most Effective Dispute Techniques That Actually Work",
          slug: "effective-dispute-techniques",
          thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "22:15"
        },
        {
          id: 5,
          title: "DIY Credit Repair: Create Your Personal Action Plan",
          slug: "diy-credit-repair-plan",
          thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "28:53"
        }
      ],
      transcript: `
        <h3>Introduction</h3>
        <p>Hello everyone! I'm Emma Chen, and today we're talking about how to build credit from scratch. Whether you're a young adult just starting out, new to the country, or simply never established credit before, this video will give you a clear roadmap to building a solid credit foundation.</p>
        
        <h3>Why Credit Matters</h3>
        <p>Before we dive in, let's talk briefly about why credit matters. A good credit score can save you thousands of dollars through lower interest rates on loans and mortgages. It can help you get approved for apartments, avoid security deposits on utilities, and even affect your insurance rates. In some cases, employers even check credit as part of their hiring process.</p>
        
        <h3>Understanding the Credit Catch-22</h3>
        <p>The frustrating reality for many beginners is what I call the credit catch-22: you need credit to build credit. Lenders want to see a history of responsible borrowing before they'll lend to you, but how do you build that history if no one will give you your first chance? Today, I'll show you several ways to break this cycle.</p>
        
        <h3>Option 1: Secured Credit Cards</h3>
        <p>The most common starting point is a secured credit card. With these cards, you provide a security deposit that typically becomes your credit limit. For example, a $500 deposit gives you a $500 credit line.</p>
        <p>The best secured cards have:</p>
        <ul>
          <li>No annual fee or a very low fee</li>
          <li>Reports to all three major credit bureaus</li>
          <li>A path to graduate to an unsecured card</li>
          <li>Interest earned on your deposit (though this is rare)</li>
        </ul>
        <p>Some top options include the Discover it Secured, Capital One Platinum Secured, and Citi Secured Mastercard. Always do your research to find which is available to you and fits your needs.</p>
        
        <h3>Option 2: Credit Builder Loans</h3>
        <p>Credit builder loans are specifically designed to help people establish credit. Unlike traditional loans, you don't receive the money upfront. Instead, the "loan" amount is held in a bank account while you make payments. When you complete all payments, you receive the money plus any interest it earned (minus fees).</p>
        <p>Look for credit builder loans with:</p>
        <ul>
          <li>Low fees</li>
          <li>Reporting to all three bureaus</li>
          <li>Affordable monthly payments</li>
          <li>Terms between 6-24 months</li>
        </ul>
        <p>Self (formerly Self Lender) and many credit unions offer these programs.</p>
        
        <h3>Option 3: Become an Authorized User</h3>
        <p>If you have a family member or very close friend with good credit, ask if they would add you as an authorized user on their credit card. This means their account history can appear on your credit report, potentially giving you an instant credit history.</p>
        <p>Important considerations:</p>
        <ul>
          <li>Make sure the card reports authorized users to the credit bureaus (not all do)</li>
          <li>The primary cardholder's behavior will affect your credit</li>
          <li>You don't necessarily need physical access to the card</li>
          <li>This works best with longstanding accounts with perfect payment history and low utilization</li>
        </ul>
        <p>This approach requires trust on both sides, so have clear conversations about expectations.</p>
        
        <h3>Option 4: Student Credit Cards</h3>
        <p>If you're a student, student credit cards are designed for people with limited credit history. They often have more lenient approval requirements and sometimes offer rewards for good grades or other student-specific perks.</p>
        <p>Popular options include the Discover it Student Cash Back, Capital One SavorOne Student, and Bank of America Cash Rewards for Students.</p>
        
        <h3>Option 5: Retail Store Cards</h3>
        <p>Retail store credit cards typically have easier approval requirements than major credit cards. If you shop regularly at a particular store, their card might be a good option.</p>
        <p>Be cautious with these cards as they often have:</p>
        <ul>
          <li>High interest rates (often 25% or higher)</li>
          <li>Low credit limits</li>
          <li>Limited usefulness (store-only cards)</li>
        </ul>
        <p>If you do get a store card, treat it like a regular credit card - make small purchases and pay on time and in full.</p>
        
        <h3>Using Your New Credit Responsibly</h3>
        <p>Once you've obtained your first credit product, here's how to build positive history:</p>
        <ol>
          <li>Make small purchases that you can afford to pay off immediately</li>
          <li>Pay your balance in full each month to avoid interest</li>
          <li>Never miss a payment - set up automatic minimum payments as a safety net</li>
          <li>Keep your credit utilization below 30% (ideally below 10%)</li>
          <li>Don't apply for multiple new credit products in a short period</li>
        </ol>
        
        <h3>Monitoring Your Progress</h3>
        <p>Check your credit regularly using free services like Credit Karma, Credit Sesame, or the free reports from AnnualCreditReport.com. Many banks and credit cards also offer free FICO score access.</p>
        <p>Look for:</p>
        <ul>
          <li>Your accounts reporting correctly</li>
          <li>Your payment history showing as positive</li>
          <li>Any errors that need to be disputed</li>
          <li>Gradual improvements in your score</li>
        </ul>
        
        <h3>Common Beginner Mistakes to Avoid</h3>
        <p>Finally, let's talk about some common mistakes to avoid:</p>
        <ul>
          <li>Applying for too many products at once (this creates multiple hard inquiries)</li>
          <li>Closing your first card once you get better options (keep it open to maintain length of history)</li>
          <li>Failing to make payments on time, even if it's just the minimum</li>
          <li>Maxing out your credit limits</li>
          <li>Expecting overnight results (building credit takes time and patience)</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Building credit from scratch takes time, but with the right approach, you can establish a solid foundation in as little as 6 months. Remember that consistency is key - making on-time payments month after month will gradually build your creditworthiness.</p>
        <p>In the description below, I've linked to specific recommendations for secured cards and credit builder loans. If you found this video helpful, please hit the like button and subscribe for more financial education content.</p>
        <p>Thanks for watching, and good luck on your credit-building journey!</p>
      `
    },
    'diy-credit-repair-plan': {
      id: 5,
      title: "DIY Credit Repair: Create Your Personal Action Plan",
      description: "Step-by-step guide to creating your own credit repair action plan, from obtaining and analyzing your reports to prioritizing negative items and tracking your progress.",
      duration: "28:53",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/QH7G_BJ-JUM", // DIY credit repair video
      publishDate: "May 12, 2024",
      views: "7,623",
      category: "repair",
      author: {
        name: "David Johnson",
        title: "Financial Recovery Coach",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      relatedVideos: [
        {
          id: 1,
          title: "Credit Report Walkthrough: How to Read & Understand Your Report",
          slug: "credit-report-walkthrough",
          thumbnail: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "18:24"
        },
        {
          id: 2,
          title: "The 5 Most Effective Dispute Techniques That Actually Work",
          slug: "effective-dispute-techniques",
          thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "22:15"
        },
        {
          id: 4,
          title: "Building Credit from Scratch: A Beginner's Guide",
          slug: "build-credit-beginners",
          thumbnail: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          duration: "15:42"
        }
      ],
      transcript: `
        <h3>Introduction</h3>
        <p>Welcome to DIY Credit Repair. I'm David Johnson, and today we're going to create a comprehensive, step-by-step credit repair action plan that you can implement yourself without paying hundreds or thousands to a credit repair company.</p>
        <p>As a financial recovery coach, I've helped hundreds of clients improve their credit scores by an average of 80-100 points within 6-8 months using these exact strategies. The key is having a systematic approach rather than random dispute letters or quick fixes.</p>
        
        <h3>Step 1: Gather Your Credit Reports</h3>
        <p>The first step is to obtain your credit reports from all three major bureaus: Equifax, Experian, and TransUnion. You can get these for free once per year at AnnualCreditReport.com, the only government-authorized site for free reports.</p>
        <p>In addition, I recommend signing up for a free credit monitoring service like Credit Karma or Credit Sesame to track your progress throughout this journey.</p>
        <p>Remember that your credit reports and credit scores are two different things. The reports contain the information that determines your scores, so we'll focus on improving the report content first, and the scores will follow.</p>
        
        <h3>Step 2: Create a Credit Inventory</h3>
        <p>Next, create what I call a "credit inventory" - a comprehensive list of everything in your reports. I've provided a template in the description below that you can download.</p>
        <p>For each credit report, list:</p>
        <ul>
          <li>All open and closed accounts</li>
          <li>Payment history for each account</li>
          <li>Collection accounts</li>
          <li>Public records (bankruptcies)</li>
          <li>Inquiries</li>
        </ul>
        <p>Note any discrepancies between the three reports. It's common for information to appear on one report but not the others.</p>
        
        <h3>Step 3: Identify Negative Items</h3>
        <p>Now highlight all negative items in your inventory. These include:</p>
        <ul>
          <li>Late payments</li>
          <li>Collections</li>
          <li>Charge-offs</li>
          <li>Repossessions</li>
          <li>Foreclosures</li>
          <li>Bankruptcies</li>
          <li>Tax liens</li>
          <li>Judgments</li>
          <li>Excessive inquiries</li>
        </ul>
        <p>For each negative item, note:</p>
        <ul>
          <li>The date of first delinquency</li>
          <li>When it should fall off your report (typically 7 years, except for bankruptcies which can be 10 years)</li>
          <li>Whether you believe it to be accurate or inaccurate</li>
        </ul>
        
        <h3>Step 4: Check for Errors and Inaccuracies</h3>
        <p>Review your reports carefully for errors. Common errors include:</p>
        <ul>
          <li>Accounts that aren't yours (mixed files)</li>
          <li>Incorrect payment status</li>
          <li>Duplicate accounts</li>
          <li>Incorrect personal information</li>
          <li>Outdated negative information that should have aged off</li>
          <li>Incorrect balance or credit limit information</li>
        </ul>
        <p>Mark these for immediate dispute, as they're the easiest to get removed.</p>
        
        <h3>Step 5: Prioritize Your Disputes</h3>
        <p>Not all negative items have equal impact on your score. Prioritize your disputes in this order:</p>
        <ol>
          <li>Obvious errors and accounts that aren't yours</li>
          <li>Recent negative items (these impact your score more than older ones)</li>
          <li>High-balance collection accounts</li>
          <li>Duplicate accounts</li>
          <li>Recent inquiries</li>
          <li>Older negative items</li>
        </ol>
        <p>This prioritization ensures you're tackling the items that will give you the biggest score improvement first.</p>
        
        <h3>Step 6: Create a Dispute Calendar</h3>
        <p>Now, create a 6-month calendar for your disputes. I recommend disputing no more than 2-3 items per bureau in each round, spacing rounds 30-45 days apart. This targeted approach is more effective than disputing everything at once.</p>
        <p>For example:</p>
        <ul>
          <li>Month 1: Dispute obvious errors with all three bureaus</li>
          <li>Month 2: Dispute highest-impact recent negative items</li>
          <li>Month 3: Dispute next set of priority items, follow up on any unsuccessful disputes from Month 1</li>
          <li>And so on...</li>
        </ul>
        
        <h3>Step 7: Draft Effective Dispute Letters</h3>
        <p>When drafting dispute letters, be specific about what you're disputing and why. Avoid using template letters that credit bureaus can easily identify as mass disputes.</p>
        <p>For each dispute:</p>
        <ul>
          <li>Include your complete identification information</li>
          <li>Clearly identify the item you're disputing</li>
          <li>Explain exactly what is incorrect about the item</li>
          <li>Request that it be removed or corrected</li>
          <li>Include supporting documentation when possible</li>
        </ul>
        <p>Send all disputes via certified mail with return receipt requested so you have proof of delivery.</p>
        
        <h3>Step 8: Contact Creditors Directly</h3>
        <p>In addition to disputing with the bureaus, contact original creditors directly for potentially faster results. This is especially effective for:</p>
        <ul>
          <li>Late payments with creditors you still have good relationships with</li>
          <li>Recently paid collections where you can request goodwill deletions</li>
          <li>Accounts with legitimate errors</li>
        </ul>
        <p>Always get agreements in writing before making payments to settle collections.</p>
        
        <h3>Step 9: Build Positive Credit Simultaneously</h3>
        <p>While disputing negative items, actively build positive credit history:</p>
        <ul>
          <li>Ensure all current accounts have perfect payment history going forward</li>
          <li>Keep credit card balances below 30% of their limits (ideally below 10%)</li>
          <li>If you have limited positive credit, consider adding a secured card or becoming an authorized user on someone else's well-established account</li>
          <li>Don't close old accounts, even after paying them off</li>
        </ul>
        
        <h3>Step 10: Track and Document Everything</h3>
        <p>Maintain detailed records of:</p>
        <ul>
          <li>Copies of all dispute letters sent</li>
          <li>Return receipts and any responses</li>
          <li>Dates of all communications</li>
          <li>Names of representatives you speak with</li>
          <li>Credit score changes over time</li>
        </ul>
        <p>This documentation is crucial if you need to escalate disputes or prove your efforts later.</p>
        
        <h3>Case Study: Maria's DIY Credit Repair</h3>
        <p>Let me share a quick case study of my client Maria, who followed this exact plan. Maria started with a credit score of 580 and had:</p>
        <ul>
          <li>2 collection accounts</li>
          <li>1 charge-off</li>
          <li>4 late payments across 2 accounts</li>
          <li>High credit card utilization</li>
        </ul>
        <p>After implementing our DIY plan:</p>
        <ul>
          <li>She successfully disputed one collection that couldn't be validated</li>
          <li>Negotiated a pay-for-delete on the second collection</li>
          <li>Received a goodwill adjustment removing two late payments</li>
          <li>The charge-off remained but she paid it to zero balance</li>
          <li>She decreased her utilization to under 20%</li>
        </ul>
        <p>Within 8 months, her score improved to 687, allowing her to qualify for a mortgage at a much better interest rate than she would have received initially.</p>
        
        <h3>Conclusion</h3>
        <p>Credit repair is not an overnight process, but with this systematic approach, you can see significant improvements within 6-12 months. The key is consistency, documentation, and patience.</p>
        <p>In the description below, I've included links to all the resources mentioned in this video, including my credit inventory template, sample dispute letters, and a dispute tracking spreadsheet.</p>
        <p>If you found this helpful, please give the video a thumbs up and subscribe for more financial recovery content. In my next video, we'll dive deeper into goodwill letters and other advanced credit repair strategies.</p>
        <p>Thank you for watching, and remember: you have the power to take control of your credit and financial future!</p>
      `
    }
  };

  // Find current video based on slug
  const currentVideo = videoDatabase[slug || ''] || null;
  
  if (!currentVideo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
        <Link to="/education" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Education
        </Link>
      </div>
    );
  }

  // Function to copy the current page URL to clipboard
  const copyToClipboard = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "The video link has been copied to your clipboard.",
        duration: 3000,
      });
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 3000);
    });
  };

  // Function to handle share to social media
  const shareToSocial = (platform) => {
    const currentUrl = window.location.href;
    const title = currentVideo.title;
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Back to education button */}
        <Link to="/education" className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Education
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video player and details */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden bg-gray-100 mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  className="w-full h-full"
                  src={currentVideo.videoUrl}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{currentVideo.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{currentVideo.duration}</span>
              </div>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>{currentVideo.publishDate}</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                <span className="capitalize">{currentVideo.category}</span>
              </div>
              <div className="flex items-center">
                <PlaySquare className="w-4 h-4 mr-1" />
                <span>{currentVideo.views} views</span>
              </div>
            </div>
            
            <div className="mb-8 flex gap-3">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <div className="relative ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => document.getElementById('share-dropdown').classList.toggle('hidden')}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <div id="share-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                  <div className="p-2">
                    <button
                      onClick={() => shareToSocial('facebook')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-md"
                    >
                      <Facebook className="w-4 h-4 mr-2" /> Facebook
                    </button>
                    <button
                      onClick={() => shareToSocial('twitter')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-md"
                    >
                      <Twitter className="w-4 h-4 mr-2" /> Twitter
                    </button>
                    <button
                      onClick={() => shareToSocial('linkedin')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-md"
                    >
                      <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center rounded-md"
                    >
                      <Copy className="w-4 h-4 mr-2" /> Copy link
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-gray-700">{currentVideo.description}</p>
            </div>
            
            <div className="flex items-center mb-8">
              <div className="flex-shrink-0 mr-4">
                <img 
                  src={currentVideo.author.image} 
                  alt={currentVideo.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{currentVideo.author.name}</h3>
                <p className="text-sm text-gray-600">{currentVideo.author.title}</p>
              </div>
              <Button className="ml-auto">
                Follow
              </Button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Transcript</h2>
              <div 
                className="text-gray-700 space-y-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentVideo.transcript }}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold mb-4">Related Videos</h2>
              <div className="space-y-4">
                {currentVideo.relatedVideos.map((video) => (
                  <Link key={video.id} to={`/education/videos/${video.slug}`} className="block group">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 relative w-32 h-20 rounded-md overflow-hidden">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Ready to fix your credit?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Upload your credit report and get a personalized action plan to improve your score.
                </p>
                <Link to="/upload-report">
                  <Button className="w-full flex items-center justify-center">
                    Upload Your Report <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold mb-3">Have questions?</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Chat with our AI credit advisor for personalized guidance.
                </p>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    Start Chat <MessageSquare className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
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
