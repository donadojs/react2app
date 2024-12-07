interface BottomViewProps {
  pageCache: string | null;
}

export function BottomView({ pageCache }: BottomViewProps) {
  if (!pageCache) return null;
  return (
    <div
      className="absolute top-0 left-0 right-0 min-h-screen z-10 bg-blue-300"
      dangerouslySetInnerHTML={{ __html: pageCache }}
    />
  );
}
