import { memo } from 'react';

interface ChatHeaderContentProps {
  onOpenSidebar: () => void;
  title: string;
}

function ChatHeaderContent({ onOpenSidebar, title }: ChatHeaderContentProps) {
  return (
    <div className="flex h-full w-full items-center justify-between p-2 py-4">
      <div className="flex items-center">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="text-light-secondary hover:text-light-primary dark:text-dark-secondary dark:hover:text-dark-primary mr-3 p-2" // Adjusted padding
          aria-label="Open chat history"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
      </div>
      {/* Title */}
      <div className="text-light-primary dark:text-dark-primary text-center text-sm font-medium truncate">{title}</div>
      {/* New Chat Button */}
      <div className="relative px-2">
        <button
          type="button"
          onClick={() => {
            document.location = '/';
          }}
          className="peer flex cursor-pointer items-center justify-center rounded-full bg-accent-02-light p-2 text-white transition-colors hover:bg-accent-03-light dark:bg-accent-02-dark dark:hover:bg-accent-03-dark subtle-shadow"
          aria-label="New Chat"
          title="New Chat"
        >
          <span className="sr-only">New Chat</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5" // Icon size
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <span className="pointer-events-none absolute top-full right-0 mt-1.5 rounded bg-soft-charcoal px-2 py-1 text-xs whitespace-nowrap text-off-white opacity-0 transition-opacity peer-hover:opacity-100 dark:bg-dark-surface dark:text-dark-text">
          New Chat
        </span>
      </div>
    </div>
  );
}

// Use React.memo with a custom comparison function to ensure the component only
// re-renders when its props actually change
export default memo(ChatHeaderContent, (prevProps, nextProps) => {
  // Only re-render if title or onOpenSidebar changes
  return prevProps.onOpenSidebar === nextProps.onOpenSidebar && prevProps.title === nextProps.title;
});