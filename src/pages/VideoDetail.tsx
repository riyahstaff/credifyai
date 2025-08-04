
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SafeHtmlViewer from '../components/ui/SafeHtmlViewer';
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
import { useToast } from "../components/ui/use-toast";

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
      videoUrl: "https://www.youtube.com/embed/UvTyIrxPplE",
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
      videoUrl: "https://www.youtube.com/embed/mS3GkcA3vSg",
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
      videoUrl: "https://www.youtube.com/embed/_TpX8YNxhJo",
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
      videoUrl: "https://www.youtube.com/embed/q4xmWN1yE1k",
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
        <p>Check your credit regularly using free services like Credit Karma, Credit Sesame, or the free annual reports from AnnualCreditReport.com. Many credit card issuers also provide free FICO scores now.</p>
        
        <h3>Common Beginner Mistakes</h3>
        <p>Avoid these common pitfalls:</p>
        <ul>
          <li>Applying for too many products at once (each application creates a hard inquiry)</li>
          <li>Maxing out your credit limit</li>
          <li>Missing payments or paying late</li>
          <li>Closing your first account once you get better offers</li>
          <li>Not checking your credit reports for errors</li>
        </ul>
        
        <h3>Timeline Expectations</h3>
        <p>Building credit takes time, so set realistic expectations:</p>
        <ul>
          <li>1-3 months: You may start to see your first account reported</li>
          <li>6 months: You'll likely have your first FICO score if you've had an active account</li>
          <li>12 months: With responsible use, you may qualify for better credit products</li>
          <li>24+ months: Your credit should be well-established if you've maintained good habits</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Building credit from scratch may seem challenging, but with the right approach, it's entirely achievable. Start small, be patient, and focus on developing good financial habits. Your future self will thank you for the lower interest rates and financial opportunities that good credit provides.</p>
        <p>If you found this video helpful, please hit the like button and subscribe for more content on building and maintaining good credit. In the comments, let me know which method you're planning to use to start your credit journey.</p>
        <p>Thanks for watching!</p>
      `
    },
    'diy-credit-repair-plan': {
      id: 5,
      title: "DIY Credit Repair: Create Your Personal Action Plan",
      description: "Step-by-step guidance for creating a customized credit repair plan, from credit report analysis to dispute prioritization, with timeline expectations and progress tracking methods.",
      duration: "28:53",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/3e5Pbsi4ZfA",
      publishDate: "March 28, 2024",
      views: "7,219",
      category: "repair",
      author: {
        name: "David Johnson",
        title: "Credit Restoration Specialist",
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
        <p>Welcome to DIY Credit Repair. I'm David Johnson, and today I'm going to walk you through creating your personalized credit repair action plan. While every credit situation is unique, the process for addressing credit issues follows a systematic approach that anyone can implement with the right guidance.</p>
        
        <h3>Why DIY Credit Repair?</h3>
        <p>Before we dive in, let's talk about why DIY credit repair can be more effective than hiring a company:</p>
        <ul>
          <li>Cost savings - professional credit repair can cost $50-100 per month for 6-12 months</li>
          <li>Knowledge acquisition - you'll learn skills to maintain good credit for life</li>
          <li>Personalized approach - you know your situation better than anyone</li>
          <li>Legal empowerment - understanding your rights under credit laws</li>
        </ul>
        <p>That said, complex situations or those involving legal issues may benefit from professional help. But for most people, DIY is not only possible but preferable.</p>
        
        <h3>Step 1: Gather Your Credit Reports</h3>
        <p>Your action plan begins with comprehensive information. Get your full credit reports from all three major bureaus: Equifax, Experian, and TransUnion. The official source is AnnualCreditReport.com, which provides free weekly reports through the end of 2024.</p>
        <p>Don't rely solely on free monitoring services like Credit Karma, as they don't show your full reports and may miss important details.</p>
        
        <h3>Step 2: Create a Credit Inventory</h3>
        <p>Now, let's organize what you're working with. Create a spreadsheet with the following information for each account on your reports:</p>
        <ul>
          <li>Creditor name</li>
          <li>Account number (last 4 digits)</li>
          <li>Account type (credit card, loan, collection, etc.)</li>
          <li>Balance</li>
          <li>Status (open/closed, current/delinquent)</li>
          <li>Payment history (note any late payments)</li>
          <li>Date opened</li>
          <li>Date of last activity</li>
          <li>Which bureaus report it (Equifax, Experian, TransUnion)</li>
          <li>Inaccuracies or issues to dispute</li>
        </ul>
        <p>This inventory becomes your master document for tracking progress.</p>
        
        <h3>Step 3: Identify and Categorize Issues</h3>
        <p>Review your inventory and categorize each issue by type and potential impact:</p>
        <p>High-impact issues:</p>
        <ul>
          <li>Accounts that aren't yours (identity theft/mixed file)</li>
          <li>Accounts showing incorrect late payments</li>
          <li>Accounts with incorrect balances or limits</li>
          <li>Collections or charge-offs that are outdated</li>
          <li>Duplicate accounts</li>
        </ul>
        <p>Medium-impact issues:</p>
        <ul>
          <li>Hard inquiries you don't recognize</li>
          <li>Name/address errors</li>
          <li>Employment inaccuracies</li>
        </ul>
        <p>Low-impact issues:</p>
        <ul>
          <li>Minor discrepancies in account opening dates</li>
          <li>Outdated personal information</li>
        </ul>
        
        <h3>Step 4: Research Statute of Limitations and Time Limits</h3>
        <p>Understanding time frames is crucial for your plan:</p>
        <ul>
          <li>Most negative items remain on your credit report for 7 years</li>
          <li>Chapter 7 bankruptcies remain for 10 years</li>
          <li>Unpaid tax liens may remain indefinitely (until paid)</li>
          <li>The statute of limitations for debt collection varies by state (typically 3-6 years)</li>
        </ul>
        <p>For each negative item, determine how much longer it will remain on your report. Sometimes waiting for items to age off is more efficient than disputing them.</p>
        
        <h3>Step 5: Prioritize Your Disputes</h3>
        <p>Not all issues should be addressed simultaneously. Prioritize in this order:</p>
        <ol>
          <li>Inaccurate personal information (name, address, SSN)</li>
          <li>Accounts that aren't yours</li>
          <li>Current accounts with incorrect status or payment history</li>
          <li>Collections and charge-offs</li>
          <li>Hard inquiries</li>
        </ol>
        <p>I recommend addressing no more than 3-5 items per bureau in each dispute round. This allows you to keep track of responses and ensures bureaus give each item proper attention.</p>
        
        <h3>Step 6: Create Your Dispute Letters</h3>
        <p>For each dispute, create a clear, concise letter that:</p>
        <ul>
          <li>Identifies you (name, address, DOB, SSN)</li>
          <li>Specifies which items you're disputing</li>
          <li>Explains precisely what is inaccurate about each item</li>
          <li>Requests the specific correction or deletion</li>
          <li>Includes supporting documentation when available</li>
        </ul>
        <p>Avoid using generic dispute letters or disputing everything as "not mine." Bureaus may flag these as frivolous. Instead, be specific about what's wrong with each item.</p>
        
        <h3>Step 7: Submit Disputes and Track Responses</h3>
        <p>You can dispute online, but I recommend sending letters via certified mail with return receipt for better documentation. In your tracking spreadsheet, note:</p>
        <ul>
          <li>Date dispute was sent</li>
          <li>Method of delivery</li>
          <li>Confirmation number</li>
          <li>Due date for response (30 days from receipt)</li>
          <li>Actual response date</li>
          <li>Outcome (deleted, updated, verified)</li>
          <li>Follow-up actions needed</li>
        </ul>
        
        <h3>Step 8: Address Current Debt and Payment Behaviors</h3>
        <p>While working on past issues, don't neglect current accounts:</p>
        <ul>
          <li>Make at least minimum payments on time for all accounts</li>
          <li>Reduce credit utilization below 30% (ideally below 10%)</li>
          <li>Consider debt consolidation for high-interest debts</li>
          <li>For collection accounts, research "pay for delete" or settlement options</li>
        </ul>
        <p>Remember that 35% of your FICO score is payment history and 30% is amounts owed, so addressing these factors creates immediate positive impact.</p>
        
        <h3>Step 9: Develop a Credit Building Strategy</h3>
        <p>Simultaneously work on building positive credit:</p>
        <ul>
          <li>If you have limited credit, consider a secured card or credit builder loan</li>
          <li>If you have established credit, focus on perfect payment history</li>
          <li>Keep old accounts open, even if unused (length of history matters)</li>
          <li>Apply for new credit sparingly and strategically</li>
          <li>Diversify your credit mix when appropriate (revolving and installment)</li>
        </ul>
        
        <h3>Step 10: Set Timeline Expectations and Milestones</h3>
        <p>Credit repair is a marathon, not a sprint. Set realistic timeframes:</p>
        <ul>
          <li>30-45 days: First round of dispute responses</li>
          <li>90 days: Noticeable improvements for simple issues</li>
          <li>6 months: Significant progress on most issues</li>
          <li>12+ months: Resolution of complex issues and score rebuilding</li>
        </ul>
        <p>Create monthly review dates to check your progress and adjust your plan.</p>
        
        <h3>Step 11: Follow Up and Escalate When Necessary</h3>
        <p>If initial disputes are unsuccessful:</p>
        <ol>
          <li>Submit a more detailed dispute with additional evidence</li>
          <li>Contact the original creditor directly (often more effective for certain issues)</li>
          <li>File complaints with the CFPB or your state attorney general</li>
          <li>Consider consulting an FCRA attorney for serious violations</li>
        </ol>
        <p>Be persistent but strategic with follow-ups. Document all communications.</p>
        
        <h3>Case Study Example</h3>
        <p>Let me share a real example from one of my clients, James (name changed). His starting situation:</p>
        <ul>
          <li>Credit score: 580</li>
          <li>Issues: 2 collection accounts, 1 account with incorrect late payments, 3 high-balance credit cards, 2 unauthorized inquiries</li>
        </ul>
        <p>His 6-month plan:</p>
        <ol>
          <li>Month 1: Disputed incorrect late payments and unauthorized inquiries</li>
          <li>Month 2: Negotiated pay-for-delete with one collection agency</li>
          <li>Month 3: Consolidated credit card debt with a personal loan</li>
          <li>Month 4: Disputed second collection (outdated information)</li>
          <li>Month 5: Followed up on unresolved disputes</li>
          <li>Month 6: Added as authorized user on family member's card</li>
        </ol>
        <p>Result after 6 months: Score improved to 680. After 12 months: 720.</p>
        
        <h3>Conclusion</h3>
        <p>Creating and following a personalized credit repair plan takes discipline and patience, but the financial benefits are substantial. A 100-point score improvement can save you thousands on mortgages, auto loans, and insurance.</p>
        <p>I've created a downloadable Credit Repair Action Plan template that accompanies this video - find the link in the description below. It includes sample dispute letters, tracking spreadsheets, and a month-by-month planner.</p>
        <p>If you found this helpful, please like and subscribe for more credit improvement strategies. Let me know in the comments what specific credit challenges you're facing.</p>
        <p>Thanks for watching, and remember: taking control of your credit is taking control of your financial future.</p>
      `
    }
  };

  // Find current video by slug
  const video = videoDatabase[slug || ''] || null;

  // If no video found, return not found message
  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Video Not Found
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              The video you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <Link to="/education" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Education Center
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Video link has been copied to clipboard.",
      duration: 3000,
    });
  };

  // Render video detail page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/education" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-primary"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Education Center
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video and details - 2/3 width on desktop */}
          <div className="lg:col-span-2">
            {/* Video embed */}
            <div className="aspect-w-16 aspect-h-9 mb-6 bg-gray-100 rounded-xl overflow-hidden">
              <iframe
                src={video.videoUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            {/* Video info */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {video.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-4">
                <div className="flex items-center">
                  <CalendarDays className="mr-1.5 h-4 w-4" />
                  {video.publishDate}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {video.duration}
                </div>
                <div className="flex items-center">
                  <PlaySquare className="mr-1.5 h-4 w-4" />
                  {video.views} views
                </div>
                <div className="flex items-center">
                  <Tag className="mr-1.5 h-4 w-4" />
                  <span className="capitalize">{video.category}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {video.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Helpful</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comment</span>
                </Button>
                
                <div className="relative ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => setShowCopiedToast(!showCopiedToast)}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                  
                  {showCopiedToast && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md p-2 z-10">
                      <div className="flex flex-col space-y-1">
                        <Button variant="ghost" size="sm" className="justify-start" onClick={handleCopyLink}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copy link</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Facebook className="mr-2 h-4 w-4" />
                          <span>Facebook</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Twitter className="mr-2 h-4 w-4" />
                          <span>Twitter</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start">
                          <Linkedin className="mr-2 h-4 w-4" />
                          <span>LinkedIn</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Author info */}
            <div className="flex items-center p-4 bg-gray-100 rounded-lg mb-8">
              <img 
                src={video.author.image} 
                alt={video.author.name} 
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{video.author.name}</h3>
                <p className="text-sm text-gray-600">{video.author.title}</p>
              </div>
            </div>
            
            {/* Transcript */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Video Transcript</h2>
              <SafeHtmlViewer 
                htmlContent={video.transcript}
                className="prose prose-sm max-w-none text-gray-600"
                allowedTags={[
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'p', 'div', 'span', 'br', 'hr',
                  'ul', 'ol', 'li',
                  'strong', 'b', 'em', 'i', 'u'
                ]}
                allowedAttributes={['class']}
              />
            </div>
          </div>
          
          {/* Sidebar - 1/3 width on desktop */}
          <div className="space-y-8">
            {/* Related videos */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Videos</h2>
              <div className="space-y-4">
                {video.relatedVideos.map((relatedVideo) => (
                  <Link 
                    key={relatedVideo.id}
                    to={`/education/videos/${relatedVideo.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="relative flex-shrink-0 w-24 h-16 rounded-md overflow-hidden">
                      <img
                        src={relatedVideo.thumbnail}
                        alt={relatedVideo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                        {relatedVideo.duration}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary line-clamp-2">
                        {relatedVideo.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Recommended resources */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Resources</h2>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary"
                >
                  <div className="mr-3 flex-shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Sample Dispute Letters</h3>
                    <p className="text-xs text-gray-600">Templates for effective dispute communications</p>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary"
                >
                  <div className="mr-3 flex-shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Credit Score Simulator</h3>
                    <p className="text-xs text-gray-600">See how different actions impact your score</p>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary"
                >
                  <div className="mr-3 flex-shrink-0">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Consumer Rights Guide</h3>
                    <p className="text-xs text-gray-600">Understanding the FCRA and your legal rights</p>
                  </div>
                </a>
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
