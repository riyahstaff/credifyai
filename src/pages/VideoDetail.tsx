
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
          <li>Any unexpected items that could indicate errors or fraud</li>
        </ul>
        
        <h3>Common Beginner Mistakes to Avoid</h3>
        <ul>
          <li>Applying for too many products at once (multiple hard inquiries)</li>
          <li>Missing payments, even by a day</li>
          <li>Maxing out credit cards</li>
          <li>Closing your first account once you get better offers</li>
          <li>Paying for expensive "credit repair" services</li>
        </ul>
        
        <h3>Timeline Expectations</h3>
        <p>Building credit takes time. Here's a typical timeline:</p>
        <ul>
          <li>1-6 months: Establish a credit file</li>
          <li>6 months: Become eligible for a FICO score</li>
          <li>12 months: Good payment history may qualify you for better products</li>
          <li>24 months: With perfect payment history, you may qualify for premium cards and good loan rates</li>
        </ul>
        
        <h3>Conclusion</h3>
        <p>Remember, building credit is a marathon, not a sprint. Focus on consistent responsible behavior over time. The habits you establish now will serve you for decades to come.</p>
        <p>In the description below, I've linked to detailed reviews of the credit products mentioned. If you found this helpful, please give this video a thumbs up and subscribe for more personal finance guidance.</p>
        <p>Thanks for watching, and here's to building a solid financial foundation!</p>
      `
    },
    'diy-credit-repair-plan': {
      id: 5,
      title: "DIY Credit Repair: Create Your Personal Action Plan",
      description: "A step-by-step workshop on creating a personalized credit improvement strategy, with downloadable templates and trackers for managing disputes, debt payoff, and score improvement.",
      duration: "28:53",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://www.youtube.com/embed/igPIk79WR-g", // Credit repair planning video
      publishDate: "March 27, 2024",
      views: "7,625",
      category: "repair",
      author: {
        name: "David Jackson",
        title: "Credit Repair Coach",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
      },
      transcript: `
        <h3>Introduction</h3>
        <p>Welcome to our DIY Credit Repair workshop. I'm David Jackson, and today we're going to create a comprehensive, personalized credit repair plan together. By the end of this video, you'll have a clear roadmap for improving your credit score with actionable steps tailored to your situation.</p>
        
        <h3>Why a Personalized Plan Matters</h3>
        <p>Generic credit advice is everywhere, but everyone's credit situation is unique. The strategies that work for someone with collection accounts won't necessarily help someone dealing with high utilization or identity theft. That's why we're focusing on building a personalized plan today.</p>
        
        <h3>Step 1: Assess Your Current Credit Situation</h3>
        <p>The first step is a thorough assessment of where you stand. You'll need to:</p>
        <ol>
          <li>Get copies of all three credit reports (Experian, Equifax, TransUnion)</li>
          <li>Check your FICO scores from all three bureaus</li>
          <li>Make a comprehensive list of all credit accounts and their statuses</li>
          <li>Identify all negative items on your reports</li>
        </ol>
        <p>For this step, I've created a Credit Assessment Worksheet that you can download from the link in the description. This will help you organize all your information in one place.</p>
        
        <h3>Step 2: Set Specific Credit Goals</h3>
        <p>Now that you know where you stand, decide where you want to go. Effective goals are specific and have deadlines. Examples might be:</p>
        <ul>
          <li>"Increase FICO score from 620 to 680 within 6 months"</li>
          <li>"Remove 3 collection accounts by December"</li>
          <li>"Reduce credit card utilization from 65% to under 30% by September"</li>
        </ul>
        <p>Write down 1-3 specific goals on your worksheet.</p>
        
        <h3>Step 3: Identify Your Score Factors</h3>
        <p>Next, identify which factors are most impacting your credit score. When you check your score online, you'll usually see key factors affecting it. The most common include:</p>
        <ul>
          <li>Payment history issues (late payments, collections, charge-offs)</li>
          <li>High credit utilization</li>
          <li>Limited credit history</li>
          <li>Recent hard inquiries</li>
          <li>Derogatory public records</li>
          <li>Limited credit mix</li>
        </ul>
        <p>On your worksheet, rank these factors from most to least impactful for your situation.</p>
        
        <h3>Step 4: Create Your Dispute Strategy</h3>
        <p>If you have inaccurate negative items, create a dispute strategy:</p>
        <ol>
          <li>Identify all errors (inaccurate dates, amounts, account status, etc.)</li>
          <li>Prioritize disputes (highest impact items first)</li>
          <li>Decide on dispute methods (online, mail, phone, or through original creditor)</li>
          <li>Create a dispute calendar (staggering disputes instead of sending all at once)</li>
          <li>Prepare documentation for supporting your disputes</li>
        </ol>
        <p>Your dispute strategy should include what to dispute, how, when, and what evidence you'll provide.</p>
        
        <h3>Step 5: Design Your Debt Management Plan</h3>
        <p>If you have outstanding debts, develop a debt management strategy:</p>
        <ol>
          <li>List all debts with balances, interest rates, minimum payments</li>
          <li>Decide on a payoff strategy (avalanche or snowball method)</li>
          <li>Consider settlement offers for old collections</li>
          <li>Evaluate consolidation options if appropriate</li>
          <li>Create monthly payment targets and deadlines</li>
        </ol>
        <p>My Debt Payoff Calculator spreadsheet can help you compare different repayment strategies - find it in the description.</p>
        
        <h3>Step 6: Plan Your Utilization Improvement</h3>
        <p>If high utilization is hurting your score:</p>
        <ol>
          <li>Calculate current overall and per-card utilization</li>
          <li>Set target utilization percentages (under 30%, ideally under 10%)</li>
          <li>Create a payment schedule to reach those targets</li>
          <li>Consider requesting credit limit increases (soft pulls only)</li>
          <li>Optimize statement closing dates for reporting</li>
        </ol>
        <p>The Utilization Tracker in your download package will help you monitor this.</p>
        
        <h3>Step 7: Develop Your Positive Credit Building Strategy</h3>
        <p>While removing negatives is important, adding positives is equally crucial:</p>
        <ol>
          <li>Identify gaps in your credit profile</li>
          <li>Research credit products that might help (secured cards, credit builder loans, etc.)</li>
          <li>Create a strategy for appropriate new accounts (timing, type)</li>
          <li>Set up perfect payment systems (autopay, calendar reminders)</li>
          <li>Plan strategic credit usage patterns</li>
        </ol>
        <p>Remember, new credit should be added thoughtfully and gradually.</p>
        
        <h3>Step 8: Create Your Monthly Action Calendar</h3>
        <p>Now, combine all these strategies into a month-by-month action calendar:</p>
        <ul>
          <li>Month 1 actions (initial disputes, utilization reduction targets, etc.)</li>
          <li>Month 2 actions (follow-up on disputes, payment targets)</li>
          <li>Month 3 actions (secondary disputes, credit building steps)</li>
          <li>And so on for 12 months</li>
        </ul>
        <p>The 12-month planner in your download package gives you space to map this out.</p>
        
        <h3>Step 9: Establish Your Progress Tracking System</h3>
        <p>Decide how you'll track progress:</p>
        <ul>
          <li>Monthly score checks (which source you'll use)</li>
          <li>Dispute response tracking</li>
          <li>Payment and utilization tracking</li>
          <li>Monthly calendar review and adjustment</li>
        </ul>
        <p>The Progress Tracker spreadsheet will help you monitor these metrics over time.</p>
        
        <h3>Step 10: Plan for Plateaus and Setbacks</h3>
        <p>Finally, prepare for inevitable challenges:</p>
        <ul>
          <li>Identify potential setbacks (denied disputes, unexpected expenses)</li>
          <li>Create contingency plans</li>
          <li>Set regular plan review dates (quarterly)</li>
          <li>Establish a credit maintenance plan for after reaching your goals</li>
        </ul>
        
        <h3>Example Case Study: Sarah's Plan</h3>
        <p>Let's look at how this all comes together with an example. Sarah has:</p>
        <ul>
          <li>Current FICO: 580</li>
          <li>Two collection accounts ($1,200 and $800)</li>
          <li>One credit card at 85% utilization</li>
          <li>Two hard inquiries from 6 months ago</li>
          <li>Goal: Qualify for a mortgage in 12 months (needs 640+ score)</li>
        </ul>
        <p>Sarah's plan includes:</p>
        <ol>
          <li>Disputing the smaller collection (legitimately incorrect date)</li>
          <li>Saving for a settlement offer on the larger collection</li>
          <li>Paying down her credit card to under 30% in 4 months</li>
          <li>Adding a secured card to diversify her credit</li>
          <li>Setting up automatic payments for perfect payment history</li>
        </ol>
        <p>Her monthly calendar shows exactly when each action happens, with regular score check milestones.</p>
        
        <h3>Conclusion</h3>
        <p>Your personalized credit repair plan is a living document. Review it monthly, adjust as needed, and celebrate small victories along the way. Remember that consistent, strategic action over time is the key to credit improvement.</p>
        <p>Download all the templates and trackers mentioned using the link in the description. If you found this workshop helpful, please give it a thumbs up and subscribe for more credit improvement strategies.</p>
        <p>Thanks for watching, and here's to taking control of your credit future!</p>
      `
    }
  };

  // Find the video based on the slug parameter
  const video = videoDatabase[slug as keyof typeof videoDatabase];

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
