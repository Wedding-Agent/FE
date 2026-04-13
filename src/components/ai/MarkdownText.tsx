'use client';

import styles from './MarkdownText.module.css';

/**
 * Lightweight markdown renderer (bold, line breaks only).
 * No external dependencies needed.
 */
interface MarkdownTextProps {
  text: string;
  streaming?: boolean;
}

export function MarkdownText({ text, streaming }: MarkdownTextProps) {
  // Split by newlines, then render each line with bold support
  const lines = text.split('\n');

  return (
    <span className={styles.wrap}>
      {lines.map((line, lineIdx) => {
        // Parse **bold** spans
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <span key={lineIdx}>
            {lineIdx > 0 && <br />}
            {parts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
              }
              return <span key={partIdx}>{part}</span>;
            })}
          </span>
        );
      })}
      {streaming && <span className={styles.cursor} aria-hidden="true" />}
    </span>
  );
}
