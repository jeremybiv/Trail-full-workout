interface Props {
  url: string;
  autoPlay?: boolean;
  onError?: () => void;
}

export function ExerciseVideo({ url, autoPlay, onError }: Props) {
  return (
    <video
      src={url}
      className="video-player"
      controls
      loop
      playsInline
      preload="metadata"
      onError={onError}
      {...(autoPlay ? { autoPlay: true, muted: true } : {})}
    />
  );
}
