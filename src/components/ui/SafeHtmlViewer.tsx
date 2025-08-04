import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlViewerProps {
  htmlContent: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

const SafeHtmlViewer: React.FC<SafeHtmlViewerProps> = ({
  htmlContent,
  className = '',
  allowedTags = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'div', 'span', 'br', 'hr',
    'ul', 'ol', 'li',
    'strong', 'b', 'em', 'i', 'u',
    'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'blockquote', 'code', 'pre'
  ],
  allowedAttributes = ['class', 'href', 'src', 'alt', 'title', 'target']
}) => {
  // Configure DOMPurify options
  const purifyConfig = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
    FORBID_SCRIPT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    // Remove any protocol that's not http, https, or mailto
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  };

  // Sanitize the HTML content
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, purifyConfig);

  return (
    <div 
      className={`safe-html-viewer ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtmlViewer;