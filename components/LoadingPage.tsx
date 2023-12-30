export default function LoadingPage({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 mx-auto flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-foreground dark:bg-background">
      <div className="mb-4 h-12 w-12 animate-spin">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0070F3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" x2="12" y1="2" y2="6" />
          <line x1="12" x2="12" y1="18" y2="22" />
          <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
          <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
          <line x1="2" x2="6" y1="12" y2="12" />
          <line x1="18" x2="22" y1="12" y2="12" />
          <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
          <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
        </svg>
      </div>
      <p className="text-lg font-medium text-foreground">Loading {text}</p>
    </div>
  );
}
