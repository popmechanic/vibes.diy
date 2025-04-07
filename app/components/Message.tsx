import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import StructuredMessage from './StructuredMessage';
import type { ChatMessageDocument, AiChatMessageDocument } from '../types/chat';
import { parseContent } from '~/utils/segmentParser';

interface MessageProps {
  message: ChatMessageDocument;
  isStreaming: boolean;
  setSelectedResponseId: (id: string) => void;
  selectedResponseId: string;
  setMobilePreviewShown: (shown: boolean) => void;
}

// AI Message component (simplified without animation handling)
const AIMessage = memo(
  ({
    message,
    isStreaming,
    setSelectedResponseId,
    selectedResponseId,
    setMobilePreviewShown,
  }: {
    message: AiChatMessageDocument;
    isStreaming: boolean;
    setSelectedResponseId: (id: string) => void;
    selectedResponseId: string;
    setMobilePreviewShown: (shown: boolean) => void;
  }) => {
    const { segments } = parseContent(message.text);
    return (
      <div className="mb-4 flex flex-row justify-start px-4">
        <div className="mr-3 flex-shrink-0">
          {/* AI Icon container with subtle gradient */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-02-light to-pastel-lavender dark:from-accent-02-dark dark:to-purple-700 subtle-shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white dark:text-dark-primary/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {/* Simplified icon or keep existing */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17.25c0 2.625 2.625 2.625 5.25 0m-5.25-10.5c0 2.625 2.625 2.625 5.25 0m-5.25 5.25h5.25" // Abstract lines
              />
            </svg>
          </div>
        </div>
        {/* Message bubble */}
        <div className="max-w-[85%] rounded-lg rounded-tl-none bg-light-background-01 px-4 py-3 text-light-primary subtle-shadow dark:bg-dark-background-01 dark:text-dark-primary">
          <StructuredMessage
            segments={segments || []}
            isStreaming={isStreaming}
            messageId={message._id}
            setSelectedResponseId={setSelectedResponseId}
            selectedResponseId={selectedResponseId}
            setMobilePreviewShown={setMobilePreviewShown}
            rawText={message.text}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // If either the message text or streaming state changed, we need to re-render
    // Return false to signal React to re-render the component
    if (
      prevProps.message.text !== nextProps.message.text ||
      prevProps.isStreaming !== nextProps.isStreaming ||
      prevProps.setSelectedResponseId !== nextProps.setSelectedResponseId ||
      prevProps.selectedResponseId !== nextProps.selectedResponseId ||
      prevProps.setMobilePreviewShown !== nextProps.setMobilePreviewShown
    ) {
      return false;
    }
    // Otherwise, skip re-render
    return true;
  }
);

// User Message component (simplified without animation handling)
const UserMessage = memo(({ message }: { message: ChatMessageDocument }) => {
  return (
    <div className="mb-4 flex flex-row justify-end px-4">
      {/* User message bubble */}
      <div className="max-w-[85%] rounded-lg rounded-br-none bg-accent-02-light px-4 py-3 text-white subtle-shadow dark:bg-accent-02-dark dark:text-dark-primary">
        {/* Use ai-markdown for consistency, though prose might be fine */}
        <div className="ai-markdown prose-sm dark:prose-invert max-w-none text-white dark:text-dark-primary">
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
});

// Main Message component that handles animation and decides which subcomponent to render
const Message = memo(
  ({
    message,
    isStreaming,
    setSelectedResponseId,
    selectedResponseId,
    setMobilePreviewShown,
  }: MessageProps) => {
    return (
      <div className="transition-all duration-150 ease-in hover:opacity-95">
            setMobilePreviewShown,
          }: MessageProps) => {
            // Removed hover effect from wrapper, apply to individual bubbles if needed
            return (
              <div className="transition-opacity duration-150 ease-in">
                {message.type === 'ai' ? (
                  <AIMessage
                    message={message as AiChatMessageDocument}
          <AIMessage
            message={message as AiChatMessageDocument}
            isStreaming={isStreaming}
            setSelectedResponseId={setSelectedResponseId}
            selectedResponseId={selectedResponseId}
            setMobilePreviewShown={setMobilePreviewShown}
          />
        ) : (
          <UserMessage message={message} />
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Check for message content changes
    if (prevProps.message.text !== nextProps.message.text) {
      return false; // Text changed, need to re-render
    }

    // Check for streaming state changes
    if (prevProps.isStreaming !== nextProps.isStreaming) {
      return false; // State changed, need to re-render
    }

    // Check if the setSelectedResponseId function reference changed
    if (prevProps.setSelectedResponseId !== nextProps.setSelectedResponseId) {
      return false; // Function reference changed, need to re-render
    }

    // Check if selectedResponseId changed
    if (prevProps.selectedResponseId !== nextProps.selectedResponseId) {
      return false; // Selection changed, need to re-render
    }

    // Check if setMobilePreviewShown changed
    if (prevProps.setMobilePreviewShown !== nextProps.setMobilePreviewShown) {
      return false; // Mobile preview function changed, need to re-render
    }

    // If we get here, props are equal enough to skip re-render
    return true;
  }
);

export default Message;