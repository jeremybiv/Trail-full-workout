interface Props {
  url: string;
  autoPlay?: boolean;
}

export function ExerciseVideo({ url, autoPlay }: Props) {
  return (
    <video
      src={url}
      className="video-player"
      controls
      loop
      playsInline
      preload="metadata"
      {...(autoPlay ? { autoPlay: true, muted: true } : {})}
    />
  );
}
