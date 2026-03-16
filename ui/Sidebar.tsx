import React from 'react';

interface SidebarProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
}

const Sidebar: React.FC<SidebarProps> = ({ children, position = 'left' }) => {
    const positionClass = position === 'left' ? 'left-4' : 'right-4';

    return (
        <div className={`fixed top-4 ${positionClass} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-sm max-h-[90vh] overflow-y-auto transition-colors z-50`}>
            <div className="space-y-2 [&>details:nth-child(n+4)]:ml-4 [&>details:nth-child(n+4)]:text-sm">
                {children}
            </div>
        </div>
    );
};

export default Sidebar;
