export function DoodleBackground({ children, className }: {
  children: React.ReactNode; className?: string;
}) {
  return (
    <div
      className={`min-h-screen bg-pf-purple-50 ${className || ''}`}
      style={{
        backgroundImage: 'url(/doodles/academic-pattern.svg)',
        backgroundRepeat: 'repeat',
        backgroundSize: '320px 320px',
      }}
    >
      {children}
    </div>
  );
}
