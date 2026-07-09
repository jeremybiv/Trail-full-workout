interface Props {
  promptReady: boolean;
  isIOS: boolean;
  onInstall: () => void;
  onContinue: () => void;
  onClose: () => void;
}

export function InstallModal({ promptReady, isIOS, onInstall, onContinue, onClose }: Props) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-icon">
          <svg width="36" height="34" viewBox="0 0 48 46" fill="none">
            <path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
          </svg>
        </div>

        <h2 className="modal-title">Toujours prêt à t'entraîner</h2>
        <p className="modal-body">
          Installe l'app sur ton téléphone pour un accès en 1 tap,
          même sans connexion.{' '}
          <strong>Gratuit, sans app store.</strong>
        </p>

        {isIOS ? (
          <>
            <div className="modal-ios-steps">
              <div className="modal-ios-step">
                <span className="modal-ios-num">1</span>
                <span>
                  Appuie sur{' '}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', display: 'inline' }}>
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16 6 12 2 8 6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                  {' '}dans Safari
                </span>
              </div>
              <div className="modal-ios-step">
                <span className="modal-ios-num">2</span>
                <span>Choisis <strong>« Sur l'écran d'accueil »</strong></span>
              </div>
            </div>
            <button className="modal-btn-primary" onClick={onContinue}>
              C'est noté, commencer !
            </button>
          </>
        ) : promptReady ? (
          <>
            <button className="modal-btn-primary" onClick={onInstall}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
              Installer l'app
            </button>
            <button className="modal-btn-ghost" onClick={onContinue}>
              Commencer sans installer
            </button>
          </>
        ) : (
          /* Prompt not available yet (e.g. cooldown after reinstall) */
          <>
            <div className="modal-browser-hint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Cherche l'icône d'installation
              dans la barre d'adresse de ton navigateur
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="9 13 12 16 15 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <button className="modal-btn-primary" onClick={onContinue}>
              Commencer l'entraînement
            </button>
          </>
        )}
      </div>
    </div>
  );
}
