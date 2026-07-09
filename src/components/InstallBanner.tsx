interface Props {
  show: boolean;
  promptReady: boolean;
  isIOS: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallBanner({ show, promptReady, isIOS, onInstall, onDismiss }: Props) {
  if (!show) return null;

  return (
    <div className="install-bar">
      <div className="install-bar-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <polyline points="9 13 12 16 15 13" />
        </svg>
      </div>

      <div className="install-bar-text">
        <strong>Ajouter à l'écran d'accueil</strong>
        <span>Accès rapide, sans app store</span>
      </div>

      {promptReady ? (
        <button className="install-bar-cta" onClick={onInstall}>
          Installer
        </button>
      ) : isIOS ? (
        <button className="install-bar-cta" onClick={onInstall}>
          Comment ?
        </button>
      ) : (
        /* Prompt not yet available (e.g. after reinstall cooldown): point to browser UI */
        <button className="install-bar-cta install-bar-cta--muted" onClick={onInstall}>
          Voir
        </button>
      )}

      <button className="install-bar-close" onClick={onDismiss} title="Ne plus afficher">✕</button>
    </div>
  );
}
