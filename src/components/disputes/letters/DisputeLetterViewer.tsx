
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from 'lucide-react';

interface Letter {
  id: number;
  title: string;
  recipient: string;
  createdAt: string;
  status: string;
  bureaus: string[];
  content: string;
  accountName?: string;
  accountNumber?: string;
  errorType?: string;
}

interface DisputeLetterViewerProps {
  letter: Letter | null;
  isLoading: boolean;
  testMode?: boolean;
}

const DisputeLetterViewer: React.FC<DisputeLetterViewerProps> = ({
  letter,
  isLoading,
  testMode = false
}) => {
  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="w-1/2 h-6 mb-4" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-3/4 h-4 mb-6" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-5/6 h-4" />
        </CardContent>
      </Card>
    );
  }

  if (!letter) {
    return (
      <Card className="h-full shadow-sm bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center p-10 h-full text-center">
          <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Letter Selected</h3>
          <p className="text-muted-foreground max-w-md">
            Select a letter from the list on the left to view its content. You can preview, edit and download your dispute letters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm h-full">
      <CardContent className="p-0">
        <div className="bg-muted/30 border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{letter.title}</h3>
          <div className="text-sm text-muted-foreground">
            To: {letter.recipient} • Created: {letter.createdAt}
          </div>
        </div>
        <div className="p-6 overflow-auto max-h-[calc(100vh-300px)]">
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {letter.content}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisputeLetterViewer;
