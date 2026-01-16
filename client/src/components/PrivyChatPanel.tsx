import { useState } from 'react';

export function PrivyChatPanel() {
    const openPrivyChat = () => {
        window.open(
            'https://privy-chat.onrender.com/',
            'PrivyChat',
            'width=500,height=700,toolbar=no,menubar=no,location=no'
        );
    };

    return (
        <button
            onClick={openPrivyChat}
            className="privy-chat-toggle"
            title="Open Secure Chat"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease',
                zIndex: 1000,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
            }}
        >
            🔒
        </button>
    );
}
