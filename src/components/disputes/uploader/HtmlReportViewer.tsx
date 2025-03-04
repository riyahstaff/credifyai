
import React, { useEffect, useState } from 'react';
import { convertReportToHtml, getReportStyles } from '@/utils/creditReport/formatters';

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
      <div 
        className="report-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
};

export default HtmlReportViewer;
