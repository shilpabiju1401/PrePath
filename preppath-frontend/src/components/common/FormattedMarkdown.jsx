import React from 'react';

/**
 * FormattedMarkdown — Formats bold text (**text**), inline code (`code`), 
 * bullet lists (- item or • item), and paragraphs into clean, beautiful React elements.
 */
export default function FormattedMarkdown({ content }) {
  if (!content) return null;

  // Split into lines
  const lines = content.split('\n');

  // Format inline markdown: bold, code, and math symbols
  const renderInline = (text) => {
    // Regex for `code` and **bold**
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-brand-700 font-semibold"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-2 my-2.5 ml-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
              <div>{renderInline(item)}</div>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Check for bullet list (-, *, •)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      currentList.push(trimmed.slice(2));
    } 
    // Check for numbered list (e.g., 1. , 2. )
    else if (/^\d+\.\s/.test(trimmed)) {
      flushList();
      const match = trimmed.match(/^\d+\.\s(.*)/);
      elements.push(
        <div key={idx} className="flex items-start gap-2.5 my-1.5 text-sm text-slate-700 leading-relaxed">
          <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-mono mt-0.5">
            {trimmed.slice(0, trimmed.indexOf('.') + 1)}
          </span>
          <div>{renderInline(match ? match[1] : trimmed)}</div>
        </div>
      );
    } 
    // Standard paragraph line
    else {
      flushList();
      elements.push(
        <p key={idx} className="text-sm text-slate-700 leading-relaxed my-2">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  flushList();

  return <div className="space-y-1">{elements}</div>;
}
