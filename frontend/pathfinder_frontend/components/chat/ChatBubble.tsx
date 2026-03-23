interface ChatBubbleProps {
  message: string; timestamp: string;
  isSent: boolean; senderName?: string;
}

export function ChatBubble({ message, timestamp, isSent, senderName }: ChatBubbleProps) {
  return (
    <div className={`flex flex-col gap-1 max-w-xs ${isSent ? 'items-end self-end' : 'items-start self-start'}`}>
      {!isSent && senderName && (
        <span className='text-xs text-gray-400 font-dm-sans px-2'>{senderName}</span>
      )}
      <div className={`px-4 py-3 text-sm font-dm-sans leading-relaxed ${ isSent
        ? 'bg-pf-purple-500 text-white rounded-2xl rounded-br-sm'
        : 'bg-white border border-pf-border text-gray-800 rounded-2xl rounded-bl-sm'}`}>
        {message}
      </div>
      <span className='text-xs text-gray-400 px-2'>{timestamp}</span>
    </div>
  );
}
