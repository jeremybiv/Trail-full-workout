import { useState } from 'react';

interface Props {
  url: string;
  compact?: boolean;
}

export function ExerciseVideo({ url, compact }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="video-link"
      >
        ▶ Voir la vidéo de démonstration
      </a>
    );
  }

  return (
    <iframe
      src={url}
      className={`video-iframe${compact ? ' compact' : ''}`}
      sandbox="allow-scripts allow-same-origin allow-presentation"
      allowFullScreen
      loading="lazy"
      onError={() => setFailed(true)}
      title="Démonstration de l'exercice"
    />
  );
}
