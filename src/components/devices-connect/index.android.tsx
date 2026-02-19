import * as React from 'react';
import {
    View,
    FlatList,
    ListRenderItem,
    Alert,
    Image,
    TouchableHighlight
} from 'react-native';
import {
    Text,
    Button,
    IconButton,
    ActivityIndicator,
} from 'react-native-paper';
import { useLocale } from '../../locales';
import {
    CTI_PREFIX,
    WifiItem,
    scanWifiList,
    WifiSelected,
    disconnectFromWifi,
    calculateSignal
} from '../../utils/wifi';
import {
    AppConfig,
    useAppConfig,
    useUpdateAppConfigWifiDetected
} from '../use-configuration';
import { useStyles } from './styles';
import Theme from '../../theme';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NoWifiImage = require('../../images/nowifi.png');
const SearchButton = require('../../images/btn_search.png');

export type DeviceListProps = {
    devices: WifiItem[] | undefined;
    appConfig: AppConfig;
    scanDevices: () => void;
    searching: boolean;
    selectOne(device: WifiSelected): void;
};
export const DevicesList: React.FC<DeviceListProps> = ({ devices, searching, appConfig, selectOne, scanDevices }) => {
    const { t } = useLocale();
    const styles = useStyles();
    // const IconAny: any = MaterialCommunityIcons;

    const renderWifiItem: ListRenderItem<WifiItem> = React.useCallback(({ item }) => {
        return (
            <TouchableHighlight
                onPress={() => selectOne({ SSID: item.SSID })}
                underlayColor={Theme.colors.ctiGreen}
                style={styles.bodyListDevice}>
                <View style={styles.bodyListDeviceRow}>
                    <MaterialCommunityIcons
                        name={`wifi-strength-${calculateSignal(item.level)}`}
                        size={30}
                        color={Theme.colors.ctiGreen}
                    />
                    <View style={styles.bodyListDeviceItem}>
                        <Text style={styles.bodyListDeviceItemText}>{item.SSID}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }, []);

    React.useEffect(() => {
        //console.log('Searching', searching, devices, devices?.length);
        if (!devices || searching) return;
        if (devices.length === 0) {
            Alert.alert(
                t('components.devices_connect.message_no_devices_title'),
                t('components.devices_connect.message_no_devices'),
            );
        }
        if (devices.length === 1) {
            selectOne({ SSID: devices[0].SSID });
        }
    }, [devices, searching]);

    if (searching) {
        return (
            <View
                style={styles.container}>
                <View style={styles.loadingBody}>
                    <ActivityIndicator
                        size={120}
                        color={Theme.colors.ctiGreen} />
                    <Text style={styles.connectingBodyTitle}>{t('components.devices_connect.message_searching')}</Text>
                </View>
            </View>
        );
    }
    if (!devices || devices.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.setupContainer}>
                    <Text style={styles.setupDevice}>{t('screens.find_devices.message')}</Text>
                    <Text style={styles.setupDeviceSubtext}>{t('screens.find_devices.message_subtext')}</Text>
                    <Button
                        style={styles.buttonSearch}
                        mode="contained"
                        onPress={scanDevices}
                        disabled={searching || !appConfig.wifiConnection.enabled || !appConfig.wifiPermissions}
                        icon={() => <Image source={SearchButton} style={styles.searchButton} />}
                    >
                        {t('components.devices_connect.button_search')}
                    </Button>

                </View>
                <Text style={styles.setupDeviceInfo}>{t('components.devices_connect.message_setup_device')}</Text>
            </View>
        );
    }

    return (
        <>
            <Text style={styles.setupDevice}>{t('components.devices_connect.devices_list')}</Text>
            <FlatList<WifiItem>
                style={{ flex: 1 }}
                data={devices}
                renderItem={renderWifiItem}
                keyExtractor={(item, index) => index + ''} />
        </>
    );
};

export type DevicesConnectProps = {
    reload: number;
    onConnection: (device: WifiSelected) => void;
};
export const DevicesConnect: React.FC<DevicesConnectProps> = ({ onConnection, reload }) => {
    const { t } = useLocale();
    const styles = useStyles();
    const config = useAppConfig();
    const updateWifiDetected = useUpdateAppConfigWifiDetected();
    const [wifis, setWifis] = React.useState<WifiItem[] | undefined>();
    const [isSearching, setSearching] = React.useState(false);
    const [selected, setSelected] = React.useState<WifiSelected | null>(null);
    const updateDeviceList = React.useCallback(async (devices: WifiItem[]) => {
        for (const device of devices) {
            device.SSID.startsWith(CTI_PREFIX) && await disconnectFromWifi(device.SSID);
        }
        setWifis(devices.filter(device => device.SSID.startsWith(CTI_PREFIX)));
        setSearching(false);
    }, []);
    const scanDevicesList = React.useCallback(() => {
        setSearching(true);

        setTimeout(() => {
            scanWifiList(updateDeviceList).catch((error) => {
                Alert.alert("scanWifiList ERROR:", error);
                updateDeviceList([]); // esto llamará setSearching(false)
            });
        }, 2500);
    }, [updateDeviceList]);


    useFocusEffect(React.useCallback(() => {
        //console.log('Repaint screen');
        setWifis(undefined);
    }, []));
    React.useEffect(() => {
        //console.log('Selected', selected);
        if (!selected) return;
        if (config.wifiConnection && config.wifiConnection.SSID && !config.wifiConnection.SSID.startsWith(CTI_PREFIX)) {
            updateWifiDetected(config.wifiConnection.SSID);
        }
        onConnection(selected);
    }, [selected]);

    if (!config.wifiConnection.enabled) {
        return (
            <View style={styles.container}>
                <View style={styles.nowifiBody}>
                    <Image source={NoWifiImage} width={200} height={200} style={{ width: 200, height: 200 }} />
                    <Text style={styles.nowifiBodyTitle}>{t('components.devices_connect.message_nowifi')}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <DevicesList
                appConfig={config}
                devices={wifis}
                searching={isSearching}
                selectOne={setSelected}
                scanDevices={scanDevicesList} />
            {
                (wifis && wifis.length > 0) && !isSearching && (
                    <Button
                        style={styles.button}
                        color={Theme.colors.ctiGreen}
                        labelStyle={styles.buttonText}
                        disabled={isSearching || !config.wifiConnection.enabled || !config.wifiPermissions}
                        mode='contained'
                        onPress={() => setWifis(undefined)}>
                        {t('components.devices_connect.button_clear_search')}
                    </Button>
                )
            }
        </View>
    );
};

export default DevicesConnect;