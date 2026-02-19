// import { Platform } from 'react-native';
// import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
// import AsyncStorage from '@react-native-community/async-storage';
// import { waitForPromise } from './device-api';

// export const CTI_PREFIX = 'CTINET';

// export type WifiItem = WifiEntry;
// export type WifiStatus = {
//     ssid: string;
// };
// export type WifiSelected = { SSID: string };

// export const calculateSignal = (signal: number) => {
//     if (signal >= -50) return '4';
//     if (signal >= -60) return '3';
//     if (signal >= -67) return '2';
//     if (signal >= -75) return '1';
//     return 'outline';
// }

// export const resolveCurrentWifi = async (): Promise<WifiStatus> => {
//     const wifi = await WifiManager.getCurrentWifiSSID();
//     return {
//         ssid: wifi
//     };
// }
// export const isWifiEnabled = async () => await WifiManager.isEnabled ? WifiManager.isEnabled() : Promise.resolve(true);
// export const getSSID = async () => await WifiManager.getCurrentWifiSSID();
// export type updateWifiStatus = (wifi: WifiStatus | null | undefined) => void;
// export const getCurrentWifi = async (update: updateWifiStatus) => {
//     const isWifi = await isWifiEnabled();
//     if (!isWifi) {
//         WifiManager.setEnabled(true);
//         update(undefined);
//         return;
//     }
//     const wifi = await WifiManager.getCurrentWifiSSID();
//     if (!wifi || wifi.startsWith('<unknown')) {
//         update(null);
//         return;
//     }
//     try {
//         update({
//             ssid: wifi
//         });
//     }
//     catch (errorWifi) {
//         //console.log('Error with wifi', errorWifi);
//         update(null);
//     }
// };

// export type updateWifiList = (wifis: WifiItem[]) => void;
// export const loadWifiList = async (update: updateWifiList) => {
//     const wifis = await WifiManager.loadWifiList() as unknown as string;
//     update(JSON.parse(wifis));
// };

// // export const scanWifiList = async (update: updateWifiList) => {
// //     if (Platform.OS === 'ios') return false;
// //     const wifis = await WifiManager.reScanAndLoadWifiList() as unknown as string;
// //     update(JSON.parse(wifis));
// // }

// export const scanWifiList = async (update: updateWifiList) => {
//     if (Platform.OS === "ios") return false;

//     const timeout = (ms: number) =>
//         new Promise<never>((_, reject) =>
//             setTimeout(() => reject(new Error("WIFI_SCAN_TIMEOUT")), ms)
//         );

//     let wifisStr: any;

//     try {
//         // intenta rescan, pero con timeout
//         wifisStr = await Promise.race([
//             WifiManager.reScanAndLoadWifiList() as any,
//             timeout(10000),
//         ]);
//     } catch (e) {
//         // fallback a lista cacheada
//         wifisStr = await WifiManager.loadWifiList() as any;
//     }

//     // Algunos devices devuelven string JSON
//     const parsed = typeof wifisStr === "string" ? JSON.parse(wifisStr) : wifisStr;
//     update(parsed);
// };


// export const timeoutPromise = (delay = 45000) => {
//     return new Promise((_, reject) => {
//         setTimeout(
//             () => {
//                 //console.log('REjecting Promise!!!');
//                 reject(new Error('Timeout promise fired'));
//             },
//             delay
//         );
//     });
// };

// export const timeoutResolvePromise = (delay = 45000) => {
//     return new Promise((resolve) => {
//         setTimeout(
//             () => {
//                 //console.log('Resolve Promise!!!');
//                 resolve(new Error('Timeout promise fired'));
//             },
//             delay
//         );
//     });
// };

// export const connectWithSSID = async (ssid: string, passwd: string, isWep = false): Promise<WifiStatus> => {
//     try {
//         const currentSSID = await getSSID();
//         if (currentSSID === ssid) return await resolveCurrentWifi();
//         else await disconnectFromWifi(ssid);
//     }
//     catch (error) {
//         //console.log('No CURRENT SSID', error);
//     }

//     try {
//         //console.log('Deleting prev wifi', ssid);
//         await disconnectFromWifi(ssid);
//     }
//     catch (error) {
//         //console.log('Deleting prev wifi', error);
//     }
//     await waitForPromise(1500);
//     try {
//         await Promise.race([WifiManager.connectToProtectedSSID(ssid, passwd, isWep, false), timeoutPromise()]);
//     }
//     catch (error: any) {
//         await disconnectFromWifi(ssid);
//         throw new Error(String(error?.message ?? error));
//     }

//     await WifiManager.forceWifiUsage(true);
//     return await resolveCurrentWifi();
// };

// export const connectWithPassword = async (ssidPattern: string, passwd: string, isWep = false): Promise<WifiStatus> => {
//     //console.log('Pattern to connect', ssidPattern);
//     await Promise.race([WifiManager.connectToProtectedSSIDPrefix(ssidPattern, passwd, isWep,), timeoutPromise()]);
//     return await resolveCurrentWifi();
// };

// export const connectWithWiFi = async (ssid: string, passwd: string, isWep = false) => {
//     if (Platform.OS === 'ios') {
//         return await connectWithPassword(ssid, passwd, isWep);
//     }
//     else {
//         return connectWithSSID(ssid, passwd, isWep);
//     }
// };

// export const disconnectFromWifi = async (ssid?: string) => {
//     let removed = true;
//     if (!ssid) return true;
//     try {
//         if (Platform.OS === 'ios') {
//             await WifiManager.disconnectFromSSID(ssid);
//             await waitForPromise(3000);
//         }
//         else {
//             await WifiManager.forceWifiUsage(false);
//             await WifiManager.isRemoveWifiNetwork(ssid);
//             await waitForPromise(1000);
//             // await WifiManager.isRemoveCTIWifiNetwork();
//             WifiManager.disconnect();
//             await waitForPromise(3000);
//         }
//     }
//     catch (error) {
//         //console.log('Error disconnecting...', error);
//     }
//     return removed;
// }

// export const forgetAllCTIWifis = async () => {
//     if (Platform.OS === 'ios') {
//         return false;
//     }
//     // return await WifiManager.isRemoveCTIWifiNetwork();
// }

// export const isMiUi = async () => {
//     if (Platform.OS === 'ios') {
//         return false;
//     }
//     // return await WifiManager.isMiUi();
// };

// export const openPermissions = () => {
//     if (Platform.OS === 'ios') {
//         return;
//     }
//     // return WifiManager.startInstalledAppDetailsActivity();
// };

// export const saveSuggestion = async (showAgain: '0' | '1') => {
//     await AsyncStorage.setItem('SHOW_AGAIN', showAgain);
// };
// export const getSuggestion = async () => {
//     const showAgain = await AsyncStorage.getItem('SHOW_AGAIN');
//     return showAgain === '1';
// };



///!--------Prueba wifi-----------------
import { Platform, Linking } from 'react-native';
import WifiManager, { WifiEntry } from 'react-native-wifi-reborn';
import { waitForPromise } from './device-api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CTI_PREFIX = 'CTINET';

export type WifiItem = WifiEntry;
export type WifiStatus = { ssid: string };
export type WifiSelected = { SSID: string };

// Native module (para poder hacer guards sin pelearte con TS)
const wm: any = WifiManager;

export const calculateSignal = (signal: number) => {
    if (signal >= -50) return '4';
    if (signal >= -60) return '3';
    if (signal >= -67) return '2';
    if (signal >= -75) return '1';
    return 'outline';
};

const conTimeout = async <T>(promesa: Promise<T>, ms: number, codigo = 'TIMEOUT'): Promise<T> => {
    return Promise.race([
        promesa,
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error(codigo)), ms)),
    ]) as Promise<T>;
};

const parsearListaWifi = (raw: any): WifiItem[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw as WifiItem[];

    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? (parsed as WifiItem[]) : [];
        } catch {
            return [];
        }
    }

    // Por si viene como objeto raro
    return [];
};

export const resolveCurrentWifi = async (): Promise<WifiStatus> => {
    const wifi = await wm.getCurrentWifiSSID();
    return { ssid: wifi };
};

export const isWifiEnabled = async (): Promise<boolean> => {
    try {
        if (typeof wm.isEnabled === 'function') return await wm.isEnabled();
        return true;
    } catch {
        return true;
    }
};

export const getSSID = async (): Promise<string> => {
    return wm.getCurrentWifiSSID();
};

export type updateWifiStatus = (wifi: WifiStatus | null | undefined) => void;

export const getCurrentWifi = async (update: updateWifiStatus) => {
    const wifiOn = await isWifiEnabled();
    if (!wifiOn) {
        // OJO: en Android 10+ encender WiFi por código suele estar restringido,
        // pero lo dejamos como estaba en tu lógica.
        try {
            if (typeof wm.setEnabled === 'function') wm.setEnabled(true);
        } catch { }
        update(undefined);
        return;
    }

    const wifi = await wm.getCurrentWifiSSID();
    if (!wifi || String(wifi).startsWith('<unknown')) {
        update(null);
        return;
    }

    update({ ssid: wifi });
};

export type updateWifiList = (wifis: WifiItem[]) => void;

export const loadWifiList = async (update: updateWifiList) => {
    try {
        const raw = await conTimeout(wm.loadWifiList(), 6000, 'LOAD_WIFI_TIMEOUT');
        update(parsearListaWifi(raw));
    } catch {
        update([]);
    }
};

/**
 * Escaneo robusto:
 * - Nunca se queda colgado infinito
 * - Si rescan falla/timeout -> fallback a loadWifiList
 * - Siempre llama update(...) para que tu UI salga de "Buscando..."
 */
export const scanWifiList = async (update: updateWifiList) => {
    if (Platform.OS === 'ios') {
        update([]);
        return false;
    }

    try {
        const raw = await conTimeout(wm.reScanAndLoadWifiList(), 12000, 'RESCAN_TIMEOUT');
        update(parsearListaWifi(raw));
        return true;
    } catch (e) {
        // Fallback a lista cacheada
        try {
            const raw2 = await conTimeout(wm.loadWifiList(), 6000, 'LOAD_WIFI_TIMEOUT');
            update(parsearListaWifi(raw2));
            return false;
        } catch {
            update([]); // IMPORTANTÍSIMO: libera tu UI del spinner
            return false;
        }
    }
};

export const timeoutPromise = (delay = 45000) => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout promise fired')), delay));
};

export const connectWithSSID = async (
    ssid: string,
    passwd: string,
    isWep = false
): Promise<WifiStatus> => {
    try {
        const currentSSID = await getSSID();
        if (currentSSID === ssid) return await resolveCurrentWifi();
    } catch { }

    // “limpia” antes de conectar
    try {
        await disconnectFromWifi(ssid);
    } catch { }

    await waitForPromise(1500);

    try {
        // Muchas versiones requieren el 4º parámetro isHidden (si no, crashea o falla)
        await Promise.race([
            (wm.connectToProtectedSSID as Function)(ssid, passwd, isWep, false),
            timeoutPromise(),
        ]);
    } catch (error: any) {
        await disconnectFromWifi(ssid);
        throw new Error(String(error?.message ?? error));
    }

    try {
        // a veces falla en Android nuevo; no dejes que esto te tumbe la app
        if (typeof wm.forceWifiUsage === 'function') await wm.forceWifiUsage(true);
    } catch { }

    return await resolveCurrentWifi();
};

export const connectWithPassword = async (
    ssidPattern: string,
    passwd: string,
    isWep = false
): Promise<WifiStatus> => {
    // Si tu versión también pide isHidden aquí, pásalo igual
    await Promise.race([
        (wm.connectToProtectedSSIDPrefix as Function)(ssidPattern, passwd, isWep, false),
        timeoutPromise(),
    ]);

    return await resolveCurrentWifi();
};

export const connectWithWiFi = async (ssid: string, passwd: string, isWep = false) => {
    if (Platform.OS === 'ios') return await connectWithPassword(ssid, passwd, isWep);
    return await connectWithSSID(ssid, passwd, isWep);
};

export const disconnectFromWifi = async (ssid?: string) => {
    if (!ssid) return true;

    try {
        if (Platform.OS === 'ios') {
            if (typeof wm.disconnectFromSSID === 'function') await wm.disconnectFromSSID(ssid);
            await waitForPromise(3000);
        } else {
            try {
                if (typeof wm.forceWifiUsage === 'function') await wm.forceWifiUsage(false);
            } catch { }

            if (typeof wm.isRemoveWifiNetwork === 'function') await wm.isRemoveWifiNetwork(ssid);
            await waitForPromise(1000);

            if (typeof wm.disconnect === 'function') wm.disconnect();
            await waitForPromise(1500);
        }
    } catch { }

    return true;
};

export const forgetAllCTIWifis = async () => {
    if (Platform.OS === 'ios') return false;

    // Sin isRemoveCTIWifiNetwork, fallback: borra redes CTI detectadas
    try {
        const raw = await conTimeout(wm.loadWifiList(), 6000, 'LOAD_WIFI_TIMEOUT');
        const lista = parsearListaWifi(raw);
        const ctis = lista.filter((w) => w?.SSID?.startsWith(CTI_PREFIX));
        for (const w of ctis) {
            if (w?.SSID) {
                try {
                    await wm.isRemoveWifiNetwork(w.SSID);
                } catch { }
            }
        }
        return true;
    } catch {
        return false;
    }
};

export const openPermissions = () => {
    // Alternativa universal (sin depender de métodos “custom” del módulo nativo)
    Linking.openSettings();
};

export const saveSuggestion = async (showAgain: '0' | '1') => {
    await AsyncStorage.setItem('SHOW_AGAIN', showAgain);
};

export const getSuggestion = async () => {
    const showAgain = await AsyncStorage.getItem('SHOW_AGAIN');
    return showAgain === '1';
};
