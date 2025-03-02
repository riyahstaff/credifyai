
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
      videoUrl: "https://www.youtube.com/embed/JXRHgLin9_M",
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
      videoUrl: "https://www.youtube.com/embed/d7jFRLXbSZM",
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
      videoUrl: "https://www.youtube.com/embed/8XKBhGRYfxQ",
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
          <li>Carrying a balance to "build credit" (this doesn't help and costs you interest)</li>
          <li>Closing your first card once you get better ones (keep it open to maintain average account age)</li>
          <li>Maxing out your credit limits (high utilization hurts your score)</li>
          <li>Missing payments (payment history is the biggest factor in your score)</li>
        </ul>
        
        <h3>Timeline Expectations</h3>
        <p>Building credit takes time. Here's a general timeline:</p>
        <ul>
          <li>1-3 months: You'll start to establish a credit file</li>
          <li>6 months: You'll likely receive your first FICO score</li>
          <li>12 months: With responsible use, you may be able to qualify for better credit products</li>
          <li>24+ months: You should have a solid credit foundation if you've maintained good habits</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Remember, building credit is a marathon, not a sprint. Be patient, consistent, and disciplined with your approach. The habits you establish now will benefit you financially for decades to come.</p>
        <p>If you found this video helpful, please give it a thumbs up and subscribe for more financial education content. In the comments below, let me know which credit-building method you're planning to try first.</p>
        <p>Thanks for watching, and here's to your financial success!</p>
      `
    },
    'diy-credit-repair-plan': {
      id: 5,
      title: "DIY Credit Repair: Create Your Personal Action Plan",
      description: "Learn how to create a personalized credit repair strategy with specific action items based on your unique credit situation, timelines, and tracking systems.",
      duration: "28:53",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/5YFdXxK0eAE",
      publishDate: "March 28, 2024",
      views: "10,572",
      category: "advanced",
      author: {
        name: "David Rodriguez",
        title: "Financial Coach",
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
        <p>Hello everyone, I'm David Rodriguez, and today we're going to create a personalized DIY credit repair plan. This isn't about quick fixes or cookie-cutter approaches - it's about developing a strategic action plan tailored to your specific credit situation.</p>
        
        <h3>Why a Personalized Plan Matters</h3>
        <p>Credit repair isn't one-size-fits-all. Someone dealing with identity theft needs a different approach than someone with legitimate late payments. A recent college graduate with thin credit needs different strategies than someone recovering from bankruptcy.</p>
        <p>A personalized plan helps you:</p>
        <ul>
          <li>Focus on the highest-impact actions first</li>
          <li>Set realistic timeframes and expectations</li>
          <li>Track your progress effectively</li>
          <li>Stay motivated through a potentially lengthy process</li>
        </ul>
        
        <h3>Step 1: Comprehensive Credit Assessment</h3>
        <p>Before creating your plan, you need a clear picture of your current situation. This means getting and reviewing all three of your credit reports (Experian, Equifax, and TransUnion).</p>
        <p>Go to AnnualCreditReport.com for your free reports, then categorize everything you find into these buckets:</p>
        <ol>
          <li>Potential errors or inaccuracies</li>
          <li>Negative but accurate items</li>
          <li>Positive items</li>
          <li>Missing positive information</li>
        </ol>
        <p>For each negative item, note:</p>
        <ul>
          <li>What type of account it is</li>
          <li>When it first appeared</li>
          <li>When it's scheduled to fall off your report</li>
          <li>Which credit bureaus show it</li>
          <li>The reported balance and status</li>
        </ul>
        <p>This inventory becomes the foundation of your action plan.</p>
        
        <h3>Step 2: Prioritize Your Issues</h3>
        <p>Not all credit issues have the same impact or the same solution path. Here's how to prioritize:</p>
        
        <h4>Highest Priority:</h4>
        <ul>
          <li>Inaccurate personal information</li>
          <li>Accounts you don't recognize (potential identity theft)</li>
          <li>Incorrect account statuses or balances</li>
          <li>Duplicate accounts</li>
          <li>Outdated negative information that should have aged off</li>
        </ul>
        
        <h4>Medium Priority:</h4>
        <ul>
          <li>Recent late payments</li>
          <li>High credit utilization</li>
          <li>Collections or charge-offs that are valid but potentially negotiable</li>
          <li>Excessive recent inquiries</li>
        </ul>
        
        <h4>Lower Priority (but still important):</h4>
        <ul>
          <li>Older negative items that will fall off soon</li>
          <li>Building positive credit history</li>
          <li>Credit mix improvement</li>
        </ul>
        
        <h3>Step 3: Set Realistic Timeframes</h3>
        <p>Credit repair takes time. Let's break down some typical timeframes:</p>
        
        <h4>1-3 Months:</h4>
        <ul>
          <li>Disputing obvious errors</li>
          <li>Reducing credit utilization</li>
          <li>Adding as authorized user to established accounts</li>
          <li>Setting up payment reminders/automation</li>
        </ul>
        
        <h4>3-6 Months:</h4>
        <ul>
          <li>Following up on disputes</li>
          <li>Negotiating pay-for-delete with collection agencies</li>
          <li>Beginning to establish new positive credit</li>
          <li>Starting to see score improvements from utilization changes</li>
        </ul>
        
        <h4>6-12 Months:</h4>
        <ul>
          <li>Advanced dispute techniques for stubborn items</li>
          <li>Continued positive payment history building</li>
          <li>Debt paydown progress</li>
          <li>Potential eligibility for better credit products</li>
        </ul>
        
        <h4>1-7 Years:</h4>
        <ul>
          <li>Waiting for negative items to age off naturally</li>
          <li>Rebuilding after major negative events</li>
          <li>Establishing long-term positive history</li>
        </ul>
        
        <h3>Step 4: Create Your Action Items</h3>
        <p>Now, it's time to create specific action items based on your priorities. Let's look at some examples:</p>
        
        <h4>For Errors and Inaccuracies:</h4>
        <ol>
          <li>Draft dispute letters for each credit bureau (separate letters for each item)</li>
          <li>Include supporting documentation</li>
          <li>Send via certified mail with return receipt</li>
          <li>Calendar 30-day follow-up date</li>
          <li>Prepare for second round disputes if needed</li>
        </ol>
        
        <h4>For High Credit Utilization:</h4>
        <ol>
          <li>Calculate current utilization percentage overall and per card</li>
          <li>Create debt paydown strategy (snowball or avalanche method)</li>
          <li>Request credit limit increases on existing accounts</li>
          <li>Adjust payment timing to before statement closing dates</li>
        </ol>
        
        <h4>For Collections:</h4>
        <ol>
          <li>Validate all collection debts</li>
          <li>Research age and statute of limitations</li>
          <li>Prioritize by impact and negotiability</li>
          <li>Prepare settlement offers with pay-for-delete requests</li>
          <li>Script phone negotiations</li>
          <li>Set aside settlement funds</li>
        </ol>
        
        <h4>For Building Positive History:</h4>
        <ol>
          <li>Research secured card options</li>
          <li>Set up automated payments for all accounts</li>
          <li>Create a system for keeping utilization low</li>
          <li>Identify potential authorized user opportunities</li>
          <li>Diversify credit types when appropriate</li>
        </ol>
        
        <h3>Step 5: Create a Tracking System</h3>
        <p>Tracking your progress is essential for staying motivated and adjusting your plan as needed. Your tracking system should include:</p>
        
        <h4>Dispute Tracker:</h4>
        <ul>
          <li>Item disputed</li>
          <li>Date sent</li>
          <li>Method (mail, online, phone)</li>
          <li>Bureau(s)</li>
          <li>Response due date</li>
          <li>Result</li>
          <li>Follow-up actions</li>
        </ul>
        
        <h4>Credit Score Tracker:</h4>
        <ul>
          <li>Monthly score readings from all three bureaus</li>
          <li>Score factors affecting your rating</li>
          <li>Changes from previous month</li>
        </ul>
        
        <h4>Debt Paydown Tracker:</h4>
        <ul>
          <li>Starting balances</li>
          <li>Current balances</li>
          <li>Monthly payment amounts</li>
          <li>Interest saved</li>
          <li>Projected payoff dates</li>
        </ul>
        
        <h4>Action Item Calendar:</h4>
        <ul>
          <li>Upcoming deadlines</li>
          <li>Follow-up dates</li>
          <li>Regular review appointments with yourself</li>
        </ul>
        
        <h3>Step 6: Implementing Your Plan</h3>
        <p>Now comes the most important part - implementation. Here are some tips for success:</p>
        
        <h4>Set Aside Dedicated Time:</h4>
        <p>Block your calendar for credit repair activities. Even 30 minutes twice a week can lead to significant progress.</p>
        
        <h4>Batch Similar Activities:</h4>
        <p>Handle all dispute letters in one session, make all collection calls another day, etc.</p>
        
        <h4>Document Everything:</h4>
        <p>Keep copies of all correspondence, notes from phone calls, and receipts for payments.</p>
        
        <h4>Adjust as You Go:</h4>
        <p>Credit repair is not linear. Be prepared to adapt your plan based on results and changing circumstances.</p>
        
        <h4>Celebrate Small Wins:</h4>
        <p>Each deleted negative item, score increase, or debt paid off is a victory worth acknowledging.</p>
        
        <h3>Step 7: Maintaining Your Improved Credit</h3>
        <p>As your credit improves, shift your focus to maintenance and continued growth:</p>
        <ul>
          <li>Set up payment automation for all accounts</li>
          <li>Create calendar reminders to check your credit reports quarterly</li>
          <li>Develop a sustainable approach to credit utilization</li>
          <li>Consider tools that monitor your credit for suspicious activity</li>
          <li>Reassess your credit goals annually</li>
        </ul>
        
        <h3>Real-Life Example Plan</h3>
        <p>Let me walk you through a sample plan for "James," who has:</p>
        <ul>
          <li>Two inaccurate late payments</li>
          <li>One collection account for $450</li>
          <li>Three maxed-out credit cards</li>
          <li>Two recent credit inquiries</li>
          <li>A credit score of 580</li>
        </ul>
        
        <p>James's 90-day plan includes:</p>
        <ol>
          <li>Disputing the late payments with both the credit bureaus and original creditors</li>
          <li>Validating the collection debt and preparing a settlement offer</li>
          <li>Creating a debt snowball plan for the credit cards</li>
          <li>Setting up bi-weekly payments to reduce utilization faster</li>
          <li>Applying for a secured card with a different mix (e.g., Discover if his others are Visa/MC)</li>
          <li>Tracking his score weekly and disputes daily</li>
        </ol>
        
        <p>His 6-month goals include:</p>
        <ul>
          <li>Score above 640</li>
          <li>All cards below 50% utilization</li>
          <li>Collection either removed or settled with deletion</li>
          <li>Automatic payments established for all accounts</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Creating your personal credit repair plan takes effort, but it's the most effective way to improve your credit for the long term. Remember that this is a marathon, not a sprint. Stay consistent, follow your plan, and adjust as needed.</p>
        <p>In the description below, I've included a link to download my free credit repair planning worksheets that will help you implement everything we've discussed today.</p>
        <p>If you found this helpful, please give this video a thumbs up and subscribe for more practical financial guidance. Drop any questions in the comments below, and I'll do my best to answer them.</p>
        <p>Thank you for watching, and here's to your financial success!</p>
      `
    }
  };

  // Find the video data based on the slug from URL
  const videoData = videoDatabase[slug ?? ''] || null;

  // If no video is found, show a message
  if (!videoData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Video not found</h1>
          <p className="mb-6">The video you are looking for does not exist or has been removed.</p>
          <Link to="/education">
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Education
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle share functionality
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The video link has been copied to your clipboard.",
      duration: 3000,
    });
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(videoData.title);
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/education" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Education
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{videoData.title}</h1>
            
            <div className="flex items-center mb-4 text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-4">{videoData.duration}</span>
              <CalendarDays className="h-4 w-4 mr-1" />
              <span className="mr-4">{videoData.publishDate}</span>
              <PlaySquare className="h-4 w-4 mr-1" />
              <span>{videoData.views} views</span>
            </div>
            
            <div className="mb-6 flex items-center">
              <Tag className="h-4 w-4 mr-1 text-blue-600" />
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {videoData.category.charAt(0).toUpperCase() + videoData.category.slice(1)}
              </span>
            </div>
            
            <div className="mb-6">
              <div className="relative pt-[56.25%] bg-gray-200 rounded-lg overflow-hidden">
                <iframe 
                  className="absolute inset-0 w-full h-full" 
                  src={videoData.videoUrl}
                  title={videoData.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img 
                    src={videoData.author.image} 
                    alt={videoData.author.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{videoData.author.name}</h3>
                    <p className="text-sm text-gray-600">{videoData.author.title}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-2">About this video</h2>
                <p className="text-gray-700">{videoData.description}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Transcript</h2>
                {videoData.transcript && (
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: videoData.transcript }}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Share This Video</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  onClick={() => handleSocialShare('facebook')}
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button 
                  onClick={() => handleSocialShare('twitter')}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button 
                  onClick={() => handleSocialShare('linkedin')}
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
              <div className="flex items-center">
                <Button 
                  onClick={handleCopyLink}
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
              <div className="space-y-4">
                {videoData.relatedVideos.map(video => (
                  <Link 
                    key={video.id} 
                    to={`/education/videos/${video.slug}`}
                    className="flex group items-start"
                  >
                    <div className="relative flex-shrink-0 w-20 h-16 bg-gray-200 rounded overflow-hidden mr-3">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-75 text-white text-xs px-1">
                        {video.duration}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium group-hover:text-blue-600 line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6">
                <Link to="/education" className="inline-flex items-center text-blue-600 text-sm font-medium">
                  View All Videos
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VideoDetail;
