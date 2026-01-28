import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
    return (
        <div className={`text-[#e4e4e7] text-sm leading-relaxed ${className}`}>
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                                customStyle={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '0.5rem', fontSize: '0.85rem' }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code className={`${className} bg-[#27272a] px-1 py-0.5 rounded text-[#e4e4e7]`} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
