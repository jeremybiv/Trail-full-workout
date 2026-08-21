import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// The admin video-generator tool is personal/cost-gated and never linked
// from the app's nav — lazy-loading it keeps its bundle (and the
// @supabase/@fal-ai-adjacent client code it talks to) out of the normal
// visitor's download entirely.
const App = lazy(() => import('./App'));
const AdminVideoGenerator = lazy(() => import('./admin/AdminVideoGenerator'));

const isAdmin = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={null}>
        {isAdmin ? <AdminVideoGenerator /> : <App />}
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
);
