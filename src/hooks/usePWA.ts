import { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOSSafari() {
  const ua = navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios|chrome/i.test(ua);
}

function isInStandaloneMode() {
  return (
    ('standalone' in window.navigator && (window.navigator as Record<string, unknown>)['standalone'] === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

const DISMISSED_KEY = 'pwa-install-dismissed';

export function usePWA() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  // true when the native beforeinstallprompt is captured and ready to fire
  const [promptReady, setPromptReady] = useState(false);

  // true once installed this session (standalone launch or appinstalled event)
  const [standalone, setStandalone] = useState(false);

  // user permanently dismissed the banner
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem(DISMISSED_KEY));

  const ios = isIOSSafari();

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, r) {
      if (!r) return
      setInterval(() => r.update(), 60 * 60 * 1000)
    },
  });

  useEffect(() => {
    if (isInStandaloneMode()) {
      setStandalone(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setPromptReady(true);
    };
    const onInstalled = () => {
      setPromptReady(false);
      setStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Show install UI whenever the app is NOT running standalone and user hasn't dismissed
  const showInstall = !standalone && !dismissed && (ios || 'serviceWorker' in navigator);

  async function install() {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') setStandalone(true);
    deferredPrompt.current = null;
    setPromptReady(false);
  }

  function dismissInstall() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  }

  return { showInstall, promptReady, ios, install, dismissInstall, needRefresh, updateServiceWorker };
}
