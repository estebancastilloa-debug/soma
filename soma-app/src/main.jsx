import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './theme.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Native status bar setup (Android/iOS only). Theme-aware from the saved mode.
if (Capacitor.isNativePlatform()) {
  const savedMode = (() => { try { return localStorage.getItem('soma_theme_mode'); } catch { return null; } })();
  const isDark = savedMode === 'dark'; // default is light
  import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light }).catch(() => {});
    StatusBar.setBackgroundColor({ color: isDark ? '#0A0908' : '#F5F6F8' }).catch(() => {});
  }).catch(() => {});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
