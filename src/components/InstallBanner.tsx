import { useState } from 'react';

interface Props {
  canInstall: boolean;
  isIOS: boolean;
  onInstall: () => void;
}

export function InstallBanner({ canInstall, isIOS, onInstall }: Props) {
  const [iosDismissed, setIosDismissed] = useState(false);

  if (canInstall) {
    return (
      <button className="install-btn" onClick={onInstall}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
        Ajouter à l'écran d'accueil
      </button>
    );
  }

  if (isIOS && !iosDismissed) {
    return (
      <div className="ios-install-hint">
        <span>
          Appuie sur{' '}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {' '}puis « Sur l'écran d'accueil »
        </span>
        <button className="ios-hint-close" onClick={() => setIosDismissed(true)}>✕</button>
      </div>
    );
  }

  return null;
}
