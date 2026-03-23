export function TypingIndicator() {
  return (
    <div className='flex items-center gap-1 px-4 py-3 bg-white border border-pf-border rounded-2xl rounded-bl-sm w-16 self-start'>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className='w-2 h-2 rounded-full bg-pf-purple-400 animate-bounce'
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
