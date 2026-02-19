import * as React from 'react';
import {
    View,
    Image,
    ScrollView,
} from 'react-native';
import {
    Text,
    IconButton,
    Button
} from 'react-native-paper';
import { useLocale } from '../../locales';
import {
    CTI_PREFIX,
    WifiItem,
    WifiSelected
} from '../../utils/wifi';
import {
    useAppConfig,
    useUpdateAppConfigWifiDetected
} from '../use-configuration';
import { useStyles } from './styles';

const NoWifiImage = require('../../images/nowifi.png');
const SearchButton = require('../../images/btn_search.png');

export type WiFiCredentials = WifiItem & { password: string; };
export type DeviceListProps = {
    devices: WifiItem[] | undefined;
    searching: boolean;
    selectOne(device: WiFiCredentials): void;
};

export type DevicesConnectProps = {
    onConnection: (device: WifiSelected) => void;
};
export const DevicesConnect: React.FC<DevicesConnectProps> = ({ onConnection }) => {
    const styles = useStyles();
    const { t } = useLocale();
    const config = useAppConfig();
    const updateWifiDetected = useUpdateAppConfigWifiDetected();

    const runToConnect = React.useCallback(() => {
        if (config.wifiConnection && config.wifiConnection.SSID && !config.wifiConnection.SSID.startsWith(CTI_PREFIX)) {
            updateWifiDetected(config.wifiConnection.SSID);
        }
        onConnection({ SSID: CTI_PREFIX });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.setupContainer}>
                <Text style={styles.setupDevice}>{t('screens.find_devices.message')}</Text>
                <Text style={styles.setupDeviceSubtext}>{t('screens.find_devices.message_subtext')}</Text>

                <Button
                    style={styles.buttonSearch}
                    mode="contained"
                    onPress={runToConnect}
                    icon={() => <Image source={SearchButton} style={styles.searchButton} />}
                >
                    {t('components.devices_connect.button_search')}
                </Button>
            </View>
            <Text style={styles.setupDeviceInfo}>{t('components.devices_connect.message_setup_device')}</Text>
        </View>
    );
};

export default DevicesConnect;