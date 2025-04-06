
import { Issue } from '@/utils/creditReport/types';
import { supabase } from '@/lib/supabase/client';

/**
 * The letter template selector chooses the most appropriate template for a set of issues
 */
class LetterTemplateSelector {
  /**
   * Select a letter template based on issues and bureau
   * @param issues Issues to address in the letter
   * @param bureau Bureau to send the letter to
   * @returns Selected template
   */
  async selectTemplate(issues: Issue[], bureau: string): Promise<any> {
    try {
      // Count issues by type
      const issueTypeCounts: Record<string, number> = {};
      
      for (const issue of issues) {
        const type = issue.type;
        issueTypeCounts[type] = (issueTypeCounts[type] || 0) + 1;
      }
      
      // Find the most common issue type
      let mostCommonType = '';
      let highestCount = 0;
      
      for (const [type, count] of Object.entries(issueTypeCounts)) {
        if (count > highestCount) {
          highestCount = count;
          mostCommonType = type;
        }
      }
      
      // Try to fetch a template for the most common issue type
      const { data, error } = await supabase
        .from('letter_templates')
        .select('*')
        .eq('issue_type', mostCommonType)
        .single();
      
      if (error || !data) {
        // If no template found for the specific issue type, try to find a general template
        const { data: generalData, error: generalError } = await supabase
          .from('letter_templates')
          .select('*')
          .eq('issue_type', 'general')
          .single();
        
        if (generalError || !generalData) {
          // If still no template found, return a default template
          return this.getDefaultTemplate();
        }
        
        return generalData;
      }
      
      return data;
    } catch (error) {
      console.error('Error selecting letter template:', error);
      return this.getDefaultTemplate();
    }
  }
  
  /**
   * Get a default template for when no specific template can be found
   * @returns Default template
   */
  private getDefaultTemplate(): any {
    return {
      id: 'default',
      name: 'Default Dispute Template',
      content: `
I am writing to dispute the following information in my credit report. I have reviewed my credit report and found that the following item(s) are inaccurate or incomplete:

[ACCOUNT_DETAILS]

Under the Fair Credit Reporting Act (FCRA), you are required to:
1. Conduct a reasonable investigation into the information I am disputing
2. Forward all relevant information that I provide to the furnisher
3. Review and consider all relevant information
4. Provide me the results of your investigation
5. Delete the disputed information if it cannot be verified

Please investigate this matter and provide me with the results within 30 days as required by the FCRA.
      `.trim(),
      issue_type: 'general',
      version: '1.0',
      bureau: 'all',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const letterTemplateSelector = new LetterTemplateSelector();
