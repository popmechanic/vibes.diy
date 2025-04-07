import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Segment } from '../types/chat';

interface StructuredMessageProps {
  segments: Segment[];
  isStreaming?: boolean;
  messageId?: string;
  setSelectedResponseId: (id: string) => void;
  selectedResponseId: string;
  setMobilePreviewShown: (shown: boolean) => void;
  rawText?: string; // Raw message text to be copied on shift+click
}

// Extracted CodeSegment as a separate component to avoid hooks in render functions
interface CodeSegmentProps {
  segment: Segment;
  index: number;
  codeReady: boolean;
  isSelected: boolean;
  messageId?: string;
  setSelectedResponseId: (id: string) => void;
  setMobilePreviewShown: (shown: boolean) => void;
  codeLines: number;
  rawText?: string; // Raw message text to be copied on shift+click
}

const CodeSegment = ({
  segment,
  index,
  codeReady,
  isSelected,
  messageId,
  setSelectedResponseId,
  setMobilePreviewShown,
  codeLines,
  rawText,
}: CodeSegmentProps) => {
  const content = segment.content || '';
  const codeSegmentRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(true);

  // Utility function to check if parents are scrollable
  useEffect(() => {
    if (!codeSegmentRef.current) return;

    // Check if any parent is scrollable
    let el = codeSegmentRef.current.parentElement;
    while (el) {
      const style = window.getComputedStyle(el);
      const overflow = style.getPropertyValue('overflow');
      const overflowY = style.getPropertyValue('overflow-y');

      if (
        overflow === 'auto' ||
        overflow === 'scroll' ||
        overflowY === 'auto' ||
        overflowY === 'scroll'
      ) {
        // Parent is scrollable
      }

      el = el.parentElement;
    }
  }, []);

  // Set up intersection observer to detect when element becomes sticky
  useEffect(() => {
    if (!codeSegmentRef.current) return;

    // Create a sentinel element that will be placed above the sticky element
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.position = 'absolute';
    // Position the sentinel element at an extremely far distance for testing
    sentinel.style.top = '200px';
    sentinel.style.left = '0';
    sentinel.style.zIndex = '1000'; // Ensure it's on top

    if (codeSegmentRef.current.parentElement) {
      codeSegmentRef.current.parentElement.insertBefore(sentinel, codeSegmentRef.current);
    }

    // Check if IntersectionObserver is available (for tests and older browsers)
    if (typeof IntersectionObserver === 'undefined') {
      // Simple fallback for test environment
      const handleScroll = () => {
        if (codeSegmentRef.current) {
          const rect = codeSegmentRef.current.getBoundingClientRect();
          // Extremely large threshold for dramatic testing
          setIsSticky(rect.top <= 200); // 200px threshold for testing
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
        sentinel.remove();
      };
    }

    // Create observer for the sentinel
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel is not intersecting, the element is sticky
        const isNowSticky = !entry.isIntersecting;
        setIsSticky(isNowSticky);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -200px 0px', // Extremely large margin for dramatic testing
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  // Handle click on code segments to select the response
  const handleCodeClick = () => {
    if (messageId) {
      setSelectedResponseId(messageId);
    }
    if (isSelected) {
      setMobilePreviewShown(true);
    }
  };

  return (
    <div
      ref={codeSegmentRef}
      data-code-segment={index}
      style={{
        position: 'sticky',
        top: '8px', // Adjust as needed for spacing
        zIndex: 10,
      }}
      className={`relative my-4 cursor-pointer rounded-lg border border-light-decorative-00 bg-light-background-01 p-3 transition-all duration-300 ease-in-out hover:border-accent-01-light dark:border-dark-decorative-00 dark:bg-dark-background-01 dark:hover:border-accent-01-dark ${
        isSticky ? 'sticky-active subtle-shadow' : 'subtle-shadow' // Add shadow always, enhance on sticky
      }`}
      onClick={handleCodeClick}
    >
      {/* Status Indicator Dot */}
      <div
        className={`absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border-2 ${
          !codeReady
            ? 'border-orange-400 bg-orange-200 dark:border-orange-500 dark:bg-orange-300' // Processing
            : isSelected
              ? 'border-green-500 bg-green-300 dark:border-green-400 dark:bg-green-200 animate-pulse' // Selected (pulse optional)
              : 'border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-500' // Default
        }`}
      ></div>
      {/* Header: Lines count and Copy button */}
      <div className="mb-2 flex items-center justify-between rounded px-1 py-0">
        <span className="font-mono text-xs text-light-secondary dark:text-dark-secondary">
          {`${codeLines} line${codeLines !== 1 ? 's' : ''}`}
        </span>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation(); // Prevent triggering the parent's onClick
            const textToCopy = e.shiftKey && rawText ? rawText : content;
            navigator.clipboard.writeText(textToCopy);
            // Optional: Add visual feedback on copy
          }}
          className="rounded-md bg-light-background-02 px-2 py-1 text-xs text-light-secondary transition-colors hover:bg-light-decorative-01 active:bg-pastel-pink dark:bg-dark-background-02 dark:text-dark-secondary dark:hover:bg-dark-decorative-01 dark:active:bg-accent-02-dark"
          title="Copy code (Shift+Click to copy full message)"
        >
          <code className="font-mono flex items-center">
            <span className="mr-1.5">App.jsx</span>
            <svg
              aria-hidden="true"
              height="16"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              className="inline-block"
            >
              <path
                fill="currentColor"
                d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"
              ></path>
              <path
                fill="currentColor"
                d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"
              ></path>
            </svg>
          </code>
        </button>
      </div>

      {/* Code preview - collapses when sticky */}
      <div
        className={`overflow-hidden rounded bg-light-background-00 font-mono text-xs shadow-inner transition-all duration-300 ease-in-out dark:bg-dark-background-00 ${
          isSticky
            ? 'm-0 max-h-0 min-h-0 border-0 p-0 opacity-0'
            : 'mt-2 max-h-20 p-2 border border-light-decorative-00 dark:border-dark-decorative-00' // Added border
        }`}
      >
        {content
          .split('\n')
          .slice(0, 3) // Show first 3 lines
          .map((line, i) => (
            <div key={i} className="truncate text-light-secondary dark:text-dark-secondary">
              {line || '\u00A0'} {/* Use non-breaking space for empty lines */}
            </div>
          ))}
        {content.split('\n').length > 3 && (
          <div className="text-light-secondary/70 dark:text-dark-secondary/70">...</div>
        )}
      </div>
    </div>
  );
};
          .slice(0, 3)
          .map((line, i) => (
            <div key={i} className="truncate text-gray-800 dark:text-gray-300">
              {line || ' '}
            </div>
          ))}
        {content.split('\n').length > 3 && (
          <div className="text-gray-500 dark:text-gray-400">...</div>
        )}
      </div>
    </div>
  );
};

/**
 * Component for displaying structured messages with markdown and code segments
 */
const StructuredMessage = ({
  segments,
  isStreaming,
  messageId,
  setSelectedResponseId,
  selectedResponseId,
  setMobilePreviewShown,
  rawText,
}: StructuredMessageProps) => {
  // Ensure segments is an array (defensive)
  const validSegments = Array.isArray(segments) ? segments : [];

  // Calculate local codeReady state based on segments.length > 2 or !isStreaming
  const codeReady = validSegments.length > 2 || isStreaming === false;

  // Check if this message is currently selected by direct ID comparison
  const isSelected = messageId === selectedResponseId;

  // Count number of lines in code segments
  const codeLines = validSegments
    .filter((segment) => segment.type === 'code')
    .reduce((acc, segment) => acc + (segment.content?.split('\n').length || 0), 0);

  // CRITICAL: We always want to show something if there's any content at all
  const hasContent =
    validSegments.length > 0 &&
    validSegments.some((segment) => segment?.content && segment.content.trim().length > 0);

  // Add CSS for sticky elements
  useEffect(() => {
    // Add CSS rules for sticky elements if they don't exist yet
    if (!document.getElementById('sticky-segment-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'sticky-segment-styles';
      styleEl.textContent = `
          .sticky-active {
            padding: 8px !important;
            transition: all 0.8s ease-in-out;
          }
          
          [data-code-segment] {
            transition: all 0.8s ease-in-out;
          }
          
          [data-code-segment] > div {
            transition: all 0.8s ease-in-out;
          }
        `;
      document.head.appendChild(styleEl);
    }

    return () => {
      // Clean up the style element when component unmounts
      const styleEl = document.getElementById('sticky-segment-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  return (
    <div className="structured-message text-sm" style={{ overflow: 'visible', position: 'relative' }}>
      {!hasContent && !isStreaming ? ( // Show placeholder only if not streaming and no content
        <div className="ai-markdown">
          <p className="italic text-light-secondary dark:text-dark-secondary">
            Waiting for response...
          </p>
        </div>
      ) : (
        // Map and render each segment that has content
        validSegments
          .filter((segment): segment is Segment =>
            Boolean(segment?.content && segment.content.trim().length > 0)
          )
          .map((segment, index) => {
            if (segment.type === 'markdown') {
              // Apply ai-markdown class directly for consistent styling
              return (
                <div key={`markdown-${index}`} className="ai-markdown">
                  <ReactMarkdown>{segment.content || ''}</ReactMarkdown>
                </div>
              );
            } else if (segment.type === 'code') {
              return (
                <CodeSegment
                  key={`code-${index}`}
                  segment={segment}
                  index={index}
                  codeReady={codeReady}
                  isSelected={isSelected}
                  messageId={messageId}
                  setSelectedResponseId={setSelectedResponseId}
                  setMobilePreviewShown={setMobilePreviewShown}
                  codeLines={codeLines}
                  rawText={rawText}
                />
              );
            }
            return null;
          })
      )}

      {/* Show streaming indicator only when streaming */}
      {isStreaming && (
         // Use a more subtle text-based indicator or keep the block
         <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-accent-01-light dark:bg-accent-01-dark rounded-full" />
         // Alternative: <span className="ml-1 text-xs italic text-light-secondary dark:text-dark-secondary">...</span>
      )}
    </div>
  );
};

export default StructuredMessage;