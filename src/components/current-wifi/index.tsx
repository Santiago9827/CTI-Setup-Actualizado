import * as React from 'react';
import {
    View,
    Text
} from 'react-native';
import {
    WifiStatus,
    getCurrentWifi,
} from '../../utils/wifi';
import useCheckWifi from '../use-checkWifi';
import {useUpdateAppConfigWifiConnection} from '../use-configuration';
import {useLocale} from '../../locales';
import {useStyles} from './styles';

export const CurrentWifi: React.FC<{}> = () => {
    const {t} = useLocale();
    const styles = useStyles();
    const [wifiStatus, setWifiStatus] = React.useState<WifiStatus|null|undefined>(null);
    const wifiConnection = useCheckWifi();
    const updateConfig = useUpdateAppConfigWifiConnection();
    React.useEffect(() => {
        updateConfig(wifiConnection);
    }, [wifiConnection.connected, wifiConnection.enabled]);
    React.useEffect(() => {
        wifiConnection.connected && getCurrentWifi(setWifiStatus);
    }, [wifiConnection.connected]);

    if (!wifiConnection.enabled) {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{t('components.current_wifi.message_wifi_disabled')}</Text>
            </View>
        );
    }
    if(!wifiConnection.connected || !wifiStatus) {
        return (
            <View style={styles.container}>
                <Text style={styles.label}>{t('components.current_wifi.message_wifi_disconnected')}</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{wifiStatus.ssid}</Text>
        </View>
    );
    return null;
};

export default CurrentWifi;