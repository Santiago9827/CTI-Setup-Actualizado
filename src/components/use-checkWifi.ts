import * as React from 'react';
import {
    isWifiEnabled,
    getSSID
} from '../utils/wifi';
import { WifiConnection } from './use-configuration';


export const checkWifi = async (update: (wifiConnection: WifiConnection) => void) => {
    const isEnabled = await isWifiEnabled();
    if (isEnabled) {
        const ssid = await getSSID();
        const connected = !!ssid && !ssid.startsWith('<unk');
        update({
            enabled: isEnabled,
            connected,
            SSID: connected ? ssid : undefined
        });
    }
    else {
        update({enabled: false, connected: false});
    }
};

export const useCheckWifi = () => {
    const [wifiConnection, setWifiConnection] = React.useState<WifiConnection>({enabled: false, connected: false});
    React.useEffect(() => {
        checkWifi(setWifiConnection);
        const intervalId = setInterval(() => {
            checkWifi(setWifiConnection);
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);
    //console.log('Is Wifi enabled', wifiConnection);
    return wifiConnection;
}

export default useCheckWifi;