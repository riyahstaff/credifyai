
import React, { useEffect, useState } from 'react';
import { convertReportToHtml, getReportStyles } from '@/utils/creditReport/formatters/htmlFormatter';

interface HtmlReportViewerProps {
  reportText: string;
  className?: string;
}

const HtmlReportViewer: React.FC<HtmlReportViewerProps> = ({ 
  reportText,
  className = ''
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  
  useEffect(() => {
    if (reportText) {
      setHtmlContent(convertReportToHtml(reportText));
    } else {
      setHtmlContent('<div class="empty-report">No report content available</div>');
    }
  }, [reportText]);
  
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
