-- Enable Row Level Security on letter_templates table
ALTER TABLE public.letter_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for letter_templates - only authenticated users can read templates
CREATE POLICY "Users can view letter templates" 
ON public.letter_templates 
FOR SELECT 
TO authenticated
USING (true);

-- Only service role can insert/update/delete templates (admin functionality)
CREATE POLICY "Service role can manage letter templates" 
ON public.letter_templates 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);