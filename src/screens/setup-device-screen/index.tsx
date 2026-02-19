import * as React from 'react';
import {
    BackHandler,
    View,
    ScrollView,
    Image
} from 'react-native';
import {
    Text,
    Button,
    Appbar,
    Menu
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import {StackHeaderProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import {
    SETUP_DEVICE_SCREEN,
    RESET_DEVICE_SCREEN,
    CHANGE_DEVICE_PASSWORD_SCREEN,
    DISCONNECT_SCREEN,
    CONFIGURATION_TYPE_SELECTOR_SCREEN,
    LANGUAGES_SCREEN,
    RootStakParams,
} from '../constants';
import {DeviceConfig, ERROR_GET_CONFIG_TIMEOUT, useGetConfig, waitForPromise} from '../../utils/device-api';
import CloseConnection from '../../components/close-connection';
import LoadingView from '../../components/loading-view';
import Theme from '../../theme';
import {
    CTI_PREFIX,
    connectWithWiFi,
    disconnectFromWifi
} from '../../utils/wifi';

const ErrorImg = require('../../images/errordino.png');

export const ErrorView: React.FC<{error?: boolean; close: () => void;}> = ({error, close}) => {
    const styles = useStyles();
    const {t} = useLocale();
    if (!error) return null;
    return (
        <View
            style={styles.container}>
            <View style={styles.errorBody}>
                <Text style={styles.errorBodyTitle}>{t('screens.setup_device.error_communication')}</Text>
                <Image source={ErrorImg} style={{width: 200, height: 200}} resizeMode='contain'/>
                <Button
                    style={styles.buttonClose}
                    color={Theme.colors.ctiGreen}
                    mode='contained'
                    onPress={close}>
                    {t('screens.setup_device.button_close')}
                </Button>
            </View>
        </View>
    );
};

const DeviceView: React.FC<{device?: DeviceConfig}> = ({device}) => {
    const {t} = useLocale();
    const styles = useStyles();
    if (!device) return null;
    return (
        <View style={styles.block}>
            <Text style={styles.title}>{t('screens.setup_device.description')}</Text>
            <View style={styles.separator}><Text style={styles.separatorLabel}>{t('screens.setup_device.block_device')}</Text></View>
            <Text style={styles.label}>{t('screens.setup_device.label_mac')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.MAC_disp}</Text></View>
            <Text style={styles.label}>{t('screens.setup_device.label_password_server')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.contrasena_disp}</Text></View>
            <Text style={styles.label}>{t('screens.setup_device.label_password_device')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.contrasena_acceso}</Text></View>
        </View>
    );
};

export const getConnectionType = (cnx: number) => {
    if (cnx === 0) return 'screens.setup_device.label_no_configuration';
    if (cnx === 1) return 'screens.setup_device.label_wifi';
    if (cnx === 2) return 'screens.setup_device.label_data';
    return 'screens.setup_device.label_unknown';
};
const ConnectionModeView: React.FC<{device?: DeviceConfig}> = ({device}) => {
    const {t} = useLocale();
    const styles = useStyles();
    if (!device) return null;
    return (
        <View style={styles.block}>
            <View style={styles.separator}><Text style={styles.separatorLabel}>{t('screens.setup_device.block_connection')}</Text></View>
            <Text style={styles.label}>{t('screens.setup_device.label_connection')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{t(getConnectionType(device.tipo_conexion))}</Text></View>
        </View>
    );
};
const WifiConnectionView: React.FC<{device?: DeviceConfig}> = ({device}) => {
    const {t} = useLocale();
    const styles = useStyles();
    if (!device || device.tipo_conexion !== 1) return null;
    return (
        <View style={styles.block}>
            <Text style={styles.label}>{t('screens.setup_device.label_wifi_ssid')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.SSID}</Text></View>
        </View>
    );
};
const ManualDataConnectionView: React.FC<{device?: DeviceConfig}> = ({device}) => {
    const {t} = useLocale();
    const styles = useStyles();
    if (!device || device.tipo_conexion !== 2 || device.auto_man != 1) return null;
    return (
        <>
            <Text style={styles.label}>{t('screens.setup_device.label_data_apn')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.man_APN}</Text></View>
            <Text style={styles.label}>{t('screens.setup_device.label_data_user')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.man_USER}</Text></View>
            <Text style={styles.label}>{t('screens.setup_device.label_data_passwd')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.man_CONTRASEN}</Text></View>
        </>
    );
};
const DataConnectionView: React.FC<{device?: DeviceConfig}> = ({device}) => {
    const {t} = useLocale();
    const styles = useStyles();
    if (!device || device.tipo_conexion !== 2) return null;
    return (
        <View style={styles.block}>
            <Text style={styles.label}>{t('screens.setup_device.label_data_type')}</Text>
            <View style={styles.info}><Text style={styles.labelInfo}>{device.auto_man === 0 ? t('screens.setup_device.label_data_type_auto') : t('screens.setup_device.label_data_type_man')}</Text></View>
            <ManualDataConnectionView device={device}/>
        </View>
    );
};

export const setupHeader = (disconnect: () => void): React.FC<StackHeaderProps>  => {
    return ({scene, navigation}) => {
        const title = scene.descriptor.options.title || 'CTI Setup';
        const {t} = useLocale();
        const [isMenuOpen, setMenuOpen] = React.useState(false);

        return (
            <Appbar.Header>
                <Appbar.Content
                    title={title}/>
                <Menu
                    onDismiss={() => setMenuOpen(false)}
                    visible={isMenuOpen}
                    anchor={
                        <Appbar.Action
                            icon='dots-vertical'
                            color='white'
                            onPress={() => setMenuOpen(true)}/>
                    }>
                    <Menu.Item
                        title={<Text style={{color: '#152A88'}}>{t('screens.find_devices.button_to_change_language')}</Text>}
                        onPress={() => {
                            navigation.navigate(LANGUAGES_SCREEN);
                            setMenuOpen(false);
                        }}/>
                    <Menu.Item
                        title={<Text style={{color: '#152A88'}}>{t('screens.setup_device.button_change_password')}</Text>}
                        onPress={() => {
                            navigation.navigate(CHANGE_DEVICE_PASSWORD_SCREEN);
                            setMenuOpen(false);
                        }}/>
                    <Menu.Item
                        title={<Text style={{color: '#152A88'}}>{t('screens.setup_device.button_reset_configuration')}</Text>}
                        onPress={() => {
                            navigation.navigate(RESET_DEVICE_SCREEN);
                            setMenuOpen(false);
                        }}/>
                    <Menu.Item
                        title={<Text style={{color: '#152A88'}}>{t('screens.setup_device.button_disconnect')}</Text>}
                        onPress={() => {
                            disconnect();
                            setMenuOpen(false);
                        }}/>
                </Menu>
            </Appbar.Header>
        );
    };
};
type Props = StackScreenProps<RootStakParams, typeof SETUP_DEVICE_SCREEN>;
const SetupDeviceScreen: React.FC<Props> = ({navigation, route}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const {state, request} = useGetConfig();
    const device = state.response?.body;
    const deviceWifi = route.params.wifi;
    const deviceWifiPassword = route.params.password;
    const [reconnecting, setReconnecting] = React.useState<{connecting: boolean; try: number}>({connecting: false, try: 0});

    const [showDisconnectDialog, setShowDisconnectDialog] = React.useState(false);
    const disconnectDialog = (option: 0|1) => {
        if(option === 1) navigation.replace(DISCONNECT_SCREEN);
        setShowDisconnectDialog(false);
    };
    React.useLayoutEffect(() => {
        navigation.setOptions({header: setupHeader(() => setShowDisconnectDialog(true))});
    }, []);
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.replace(DISCONNECT_SCREEN)
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    const showErrorView = !!state.error && !state.isLoading && !reconnecting.connecting && reconnecting.try !== 1;
    const showLoading = (state.isLoading && !state.response && !state.error) || reconnecting.connecting;
    // Reload each time
    useFocusEffect(React.useCallback(() => {
        request();
        // const intervalId = setInterval(() => {
        //     request();
        // }, 5000);

        // return () => clearInterval(intervalId);
    }, []));
    const reconnect = React.useCallback(async (ssid: string, passwd: string) => {
        // console.log('Try to RE-reconnect to Wifi', ssid, deviceWifiPassword);
        try {
            await disconnectFromWifi(ssid);
            const connected = await connectWithWiFi(ssid, passwd);
            // console.log('RE-Connected to', ssid, connected);
            if (connected.ssid.startsWith(CTI_PREFIX)) {
                // console.log('Reconnecting OK', connected);
                await waitForPromise(3000);
                // console.log('Reconnecting Request 2', connected);
                request();
            }
            else {
                console.log('Error RE-connection wifi invalid ssid', connected.ssid);
            }
        }
        catch(error) {
            console.log('Error RE-Cocnnection wifi', ssid, passwd, error);
        }
        setTimeout(() => setReconnecting(connecting => ({connecting: false, try: connecting.try})), 2000);
    }, []);
    React.useLayoutEffect(() => {
        if (state.error === ERROR_GET_CONFIG_TIMEOUT && reconnecting.try < 2) {
            setReconnecting(connecting => ({connecting: true, try: connecting.try + 1}));
            reconnect(deviceWifi.ssid, deviceWifiPassword);
        }
    }, [state.error]);
    console.log('State', state, reconnecting, showLoading, showErrorView);
    return (
        <View style={styles.container}>
            <ScrollView
                style={{flex: 1}}>
                {/*<Text>{JSON.stringify(state)} - {JSON.stringify(reconnecting)}</Text>*/}
                <ErrorView
                    error={showErrorView}
                    close={() => navigation.replace(DISCONNECT_SCREEN)}/>
                <DeviceView device={device}/>
                <ConnectionModeView device={device}/>
                <WifiConnectionView device={device}/>
                <DataConnectionView device={device}/>
                <CloseConnection
                    isOpen={showDisconnectDialog}
                    closeDialog={disconnectDialog}/>
            </ScrollView>
            <View>
                <Button
                    disabled={!!state.error || (state.isLoading && !state.response)}
                    style={styles.button}
                    color={Theme.colors.ctiGreen}
                    mode='contained'
                    onPress={() => device && navigation.navigate(CONFIGURATION_TYPE_SELECTOR_SCREEN, device)}>
                    {t('screens.setup_device.button_new_configuration')}
                </Button>
            </View>
            <LoadingView show={showLoading} size={180} message={t('screens.setup_device.message_getting_configuration') + deviceWifi.ssid}/>
        </View>
    );
};

export default SetupDeviceScreen;