import React from 'react';

interface ExpanderProps {
  title: string;
  content: string;
  position: 'left' | 'right';
  monospace?: boolean;
}

const Expander: React.FC<ExpanderProps> = ({ title, content, position, monospace = false }) => {
  const positionClass = position === 'left' ? 'left-4' : 'right-4';
  const fontClass = monospace ? 'font-mono' : '';

  return (
    <details className={`fixed top-4 ${positionClass} bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-xs max-h-64 overflow-auto`}>
      <summary className="cursor-pointer font-semibold text-gray-800">{title}</summary>
      <pre className={`mt-2 text-xs text-gray-700 whitespace-pre-wrap ${fontClass}`}>{content}</pre>
    </details>
  );
};

export default Expander;