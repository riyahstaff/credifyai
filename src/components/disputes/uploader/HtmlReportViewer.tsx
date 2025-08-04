
import React, { useEffect, useState } from 'react';
import { convertReportToHtml, getReportStyles } from '@/utils/creditReport/formatters';
import SafeHtmlViewer from '@/components/ui/SafeHtmlViewer';

interface HtmlReportViewerProps {
  reportText: string;
  className?: string;
  isPdf?: boolean;
}

const HtmlReportViewer: React.FC<HtmlReportViewerProps> = ({ 
  reportText,
  className = '',
  isPdf = false
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  
  useEffect(() => {
    if (reportText) {
      setHtmlContent(convertReportToHtml(reportText, isPdf));
    } else {
      setHtmlContent('<div class="empty-report">No report content available</div>');
    }
  }, [reportText, isPdf]);
  
  return (
    <div className={`html-report-viewer ${className}`}>
      <style>{getReportStyles()}</style>
      <SafeHtmlViewer 
        htmlContent={htmlContent}
        className="report-content"
        allowedTags={[
          'div', 'span', 'p', 'br', 'hr',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'ul', 'ol', 'li',
          'strong', 'b', 'em', 'i'
        ]}
        allowedAttributes={['class', 'style']}
      />
    </div>
  );
};

export default HtmlReportViewer;
