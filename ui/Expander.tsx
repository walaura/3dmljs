import React from 'react';

interface ExpanderProps {
  title: string;
  content?: string;
  position?: 'left' | 'right';
  monospace?: boolean;
  floating?: boolean;
  children?: React.ReactNode;
  isNested?: boolean;
}

const Expander: React.FC<ExpanderProps> = ({ title, content, position = 'left', monospace = false, floating = true, children, isNested = false }) => {
  const positionClass = floating && position === 'left' ? 'left-4' : floating && position === 'right' ? 'right-4' : '';
  const floatingClass = floating ? 'fixed top-4' : '';
  const fontClass = monospace ? 'font-mono' : '';
  const nestedClass = isNested ? 'ml-2 text-sm bg-gray-50 dark:bg-gray-700' : '';

  return (
    <details className={`${floatingClass} ${positionClass} ${nestedClass} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-xs max-h-64 overflow-auto transition-colors`}>
      <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200">{title}</summary>
      {content && <pre className={`mt-2 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${fontClass}`}>{content}</pre>}
      {children && <div className="mt-3 space-y-1">{React.Children.map(children, child => React.cloneElement(child as React.ReactElement<any>, { isNested: true }))}</div>}
    </details>
  );
};

export default Expander;