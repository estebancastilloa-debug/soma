import { Capacitor } from '@capacitor/core';

let plugin = null;
async function getPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  if (plugin) return plugin;
  try {
    const mod = await import('@aparajita/capacitor-biometric-auth');
    plugin = mod.BiometricAuth;
    return plugin;
  } catch {
    return null;
  }
}

// Is fingerprint/face available and enrolled on this device?
export async function biometricAvailable() {
  const p = await getPlugin();
  if (!p) return false;
  try {
    const r = await p.checkBiometry();
    return !!(r && (r.isAvailable || r.strongBiometryIsAvailable));
  } catch {
    return false;
  }
}

// Prompt for fingerprint/face. Returns true on success.
export async function biometricAuth(reason = 'Verifica tu identidad') {
  const p = await getPlugin();
  if (!p) return false;
  try {
    await p.authenticate({
      reason,
      cancelTitle: 'Cancelar',
      allowDeviceCredential: true,
      androidTitle: 'SOMA · Zona privada',
      androidSubtitle: reason,
      iosFallbackTitle: 'Usar código',
    });
    return true;
  } catch {
    return false;
  }
}
