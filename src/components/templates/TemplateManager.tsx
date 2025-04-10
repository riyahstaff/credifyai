
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, PlusCircle, Save, Check, Trash2, FileText } from 'lucide-react';

// Define template type
interface Template {
  id: string;
  name: string;
  issue_type: string;
  content: string;
  created_at?: string;
}

// Define the form schema for validation
const templateSchema = z.object({
  name: z.string().min(3, { message: "Template name must be at least 3 characters" }),
  issue_type: z.string().min(2, { message: "Issue type is required" }),
  content: z.string().min(50, { message: "Template content must be at least 50 characters" }),
});

const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      issue_type: '',
      content: '',
    },
  });
  
  // Load templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);
  
  // Fetch templates from Supabase
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dispute_letters')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      // Map the dispute_letters data to match our Template interface
      const mappedTemplates: Template[] = (data || []).map(item => ({
        id: item.id,
        name: item.title,
        issue_type: item.errorType,
        content: item.letterContent,
        created_at: item.createdAt
      }));
      
      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error fetching templates",
        description: "There was a problem retrieving your templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Save a new template
  const onSubmit = async (values: z.infer<typeof templateSchema>) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('dispute_letters')
        .insert({
          title: values.name,
          errorType: values.issue_type,
          letterContent: values.content,
          content: values.content, // duplicating content to match the dispute_letters schema
          bureau: 'template', // default value since this is required in dispute_letters
          status: 'draft'
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Template saved",
        description: "Your letter template has been saved successfully.",
      });
      
      // Reset form
      form.reset();
      
      // Refresh templates list
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error saving template",
        description: "There was a problem saving your template.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Delete a template
  const deleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    
    try {
      const { error } = await supabase
        .from('dispute_letters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Template deleted",
        description: "The letter template has been removed.",
      });
      
      // Refresh templates list
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error deleting template",
        description: "There was a problem deleting the template.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-6">
        <h2 className="text-2xl font-bold text-credify-navy dark:text-white mb-6">
          Create New Template
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., Collection Account Dispute" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issue_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E.g., collection_account" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">
                      Common types: collection_account, late_payment, inquiry, personal_information, etc.
                    </p>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Paste your letter template here..." 
                      className="min-h-[300px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use placeholders like {"{CONSUMER_FULL_NAME}"}, {"{CURRENT_DATE}"}, etc. for dynamic content.
                  </p>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={saving}
              className="bg-credify-teal hover:bg-credify-teal-dark"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Template...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
      
      <div className="bg-white dark:bg-credify-navy/20 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/30 p-6">
        <h2 className="text-2xl font-bold text-credify-navy dark:text-white mb-6">
          Existing Templates
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-credify-teal animate-spin" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No templates found.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Create your first template above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="border border-gray-200 dark:border-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-credify-navy dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Type: <span className="font-medium">{template.issue_type}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {template.created_at ? new Date(template.created_at).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTemplate(template.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-3">
                  <Label className="text-xs">Content Preview:</Label>
                  <div className="mt-1 bg-gray-50 dark:bg-credify-navy/40 rounded p-2 text-xs font-mono max-h-32 overflow-y-auto">
                    {template.content.slice(0, 200)}...
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
