
import { supabase } from "@/integrations/supabase/client";

interface TemplateFile {
  name: string;
  type: string;
  content: string;
}

/**
 * Loads dispute letter templates from the Supabase storage bucket
 */
export async function loadDisputeLetterTemplates(): Promise<TemplateFile[]> {
  try {
    console.log("Loading dispute letter templates from storage bucket...");
    
    // Get list of files in the template folder
    const { data: files, error } = await supabase
      .storage
      .from('dispute-letter-templates')
      .list('final_package 2');
      
    if (error) {
      throw error;
    }
    
    if (!files || files.length === 0) {
      console.warn("No template files found in storage bucket");
      return [];
    }
    
    console.log(`Found ${files.length} potential template files`);
    
    // Only process text files that might be templates
    const templateFiles = files.filter(file => 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md') || 
      file.name.includes('template') ||
      file.name.includes('letter')
    );
    
    // Download the content of each template file
    const templates: TemplateFile[] = [];
    
    for (const file of templateFiles) {
      try {
        const { data, error } = await supabase
          .storage
          .from('dispute-letter-templates')
          .download(`final_package 2/${file.name}`);
          
        if (error || !data) {
          console.error(`Error downloading template ${file.name}:`, error);
          continue;
        }
        
        // Convert blob to text
        const content = await data.text();
        
        // Determine template type based on filename
        let type = 'general';
        const filename = file.name.toLowerCase();
        
        if (filename.includes('collection')) type = 'collection_account';
        else if (filename.includes('late') || filename.includes('payment')) type = 'late_payment';
        else if (filename.includes('inquiry')) type = 'inquiry';
        else if (filename.includes('charge')) type = 'charge_off';
        else if (filename.includes('personal') || filename.includes('info')) type = 'personal_information';
        else if (filename.includes('balance')) type = 'balance';
        
        templates.push({
          name: file.name,
          type,
          content
        });
        
        console.log(`Loaded template: ${file.name} (${type})`);
      } catch (err) {
        console.error(`Error processing template ${file.name}:`, err);
      }
    }
    
    // Also try to load the README file if available
    try {
      const readmeFiles = files.filter(file => 
        file.name.toLowerCase().includes('readme') || 
        file.name.toLowerCase().includes('read_me') ||
        file.name.toLowerCase().includes('instructions')
      );
      
      if (readmeFiles.length > 0) {
        const { data } = await supabase
          .storage
          .from('dispute-letter-templates')
          .download(`final_package 2/${readmeFiles[0].name}`);
          
        if (data) {
          const readmeContent = await data.text();
          console.log("README content loaded:", readmeContent.substring(0, 100) + "...");
          
          // Store the README content in session storage for reference
          try {
            sessionStorage.setItem('templateReadme', readmeContent);
          } catch (e) {
            console.error("Error storing README in session storage:", e);
          }
        }
      }
    } catch (err) {
      console.error("Error loading README file:", err);
    }
    
    return templates;
  } catch (error) {
    console.error("Error loading dispute letter templates:", error);
    return [];
  }
}

/**
 * Get the best template for a specific issue type
 */
export async function getTemplateForIssueType(issueType: string): Promise<string | null> {
  try {
    // Load all templates
    const templates = await loadDisputeLetterTemplates();
    
    if (templates.length === 0) {
      console.warn("No templates available for issue type:", issueType);
      return null;
    }
    
    // Normalize the issue type for matching
    const normalizedIssueType = issueType.toLowerCase();
    
    // Try to find an exact match first
    const exactMatch = templates.find(t => t.type.toLowerCase() === normalizedIssueType);
    
    if (exactMatch) {
      console.log(`Found exact template match for ${issueType}: ${exactMatch.name}`);
      return exactMatch.content;
    }
    
    // Try to find a partial match
    const partialMatch = templates.find(t => 
      normalizedIssueType.includes(t.type) || 
      t.type.includes(normalizedIssueType)
    );
    
    if (partialMatch) {
      console.log(`Found partial template match for ${issueType}: ${partialMatch.name}`);
      return partialMatch.content;
    }
    
    // Fall back to a general template
    const generalTemplate = templates.find(t => t.type === 'general');
    
    if (generalTemplate) {
      console.log(`Using general template for ${issueType}: ${generalTemplate.name}`);
      return generalTemplate.content;
    }
    
    // If no general template, use the first available template
    console.log(`No matching template for ${issueType}, using first available: ${templates[0].name}`);
    return templates[0].content;
    
  } catch (error) {
    console.error("Error getting template for issue type:", error);
    return null;
  }
}
