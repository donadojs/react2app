interface PreviousPageLayerProps {
  pageCache: string | null;
}

export function PreviousPageLayer({ pageCache }: PreviousPageLayerProps) {
  return (
    <div
      className="absolute top-0 left-0 right-0 min-h-screen z-10"
      dangerouslySetInnerHTML={{ __html: pageCache || "" }}
    />
  );
}
