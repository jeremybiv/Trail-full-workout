interface Props {
  url: string;
  compact?: boolean;
}

export function ExerciseVideo({ url, compact }: Props) {
  return (
    <video
      src={url}
      className={`video-player${compact ? ' compact' : ''}`}
      controls
      loop
      playsInline
      preload="metadata"
    />
  );
}
