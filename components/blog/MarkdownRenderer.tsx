"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Safe, component-based markdown rendering (no dangerouslySetInnerHTML).
// Custom element renderers keep typography consistent with the rest of the
// site without depending on the @tailwindcss/typography plugin.
const components: Components = {
  h1: ({ children }) => <h1 className="font-display text-3xl font-bold text-[#3a2e4d] mt-8 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="font-display text-2xl font-bold text-[#3a2e4d] mt-8 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="font-heading text-xl font-bold text-[#3a2e4d] mt-6 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-[#5b4b6b] leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1 text-[#5b4b6b]">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-[#5b4b6b]">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-[#3a2e4d]">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} className="text-candy underline hover:text-candy/80" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-candy/40 pl-4 italic text-[#5b4b6b]/90 my-4">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-lavender/30 bg-lavender/10 px-3 py-2 text-left">{children}</th>,
  td: ({ children }) => <td className="border border-lavender/30 px-3 py-2">{children}</td>,
  code: ({ children }) => <code className="rounded bg-lavender/10 px-1.5 py-0.5 text-sm">{children}</code>,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
