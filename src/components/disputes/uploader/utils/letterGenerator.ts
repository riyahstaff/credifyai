
// In letterGenerator.ts, update line 57 to correctly call determineBureau with a string
// This is specifically fixing the TypeScript error

// Original code:
// const bureau = determineBureau(issue);

// Fixed code:
const bureauSource = issue.account?.bureau || 
  (issue.account?.accountName || '') || 
  issue.title || 
  'Experian';
  
const bureau = determineBureau(bureauSource);
