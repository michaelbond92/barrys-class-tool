import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/auth/AuthProvider'
import { initializeFirebase, isFirebaseConfigured } from './services/firebase/firebaseConfig'

// Initialize Firebase if configured
if (isFirebaseConfigured()) {
  initializeFirebase()
    .then(() => console.log('Firebase initialized'))
    .catch((err) => console.error('Firebase initialization failed:', err));
} else {
  console.warn('Firebase not configured. Set VITE_FIREBASE_* environment variables to enable cloud features.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
