import * as React from 'react';
import {
    View
} from 'react-native';
import {
    Text,
    Button
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import {
    SETUP_DEVICE_WIFI_SCREEN,
    VALIDATE_CONFIGURATION_SCREEN,
    DISCONNECT_SCREEN,
    RootStakParams
} from '../constants';
import WifiSelector, { WifiCredentials } from '../../components/wifi-selector';
import {useAppConfig} from '../../components/use-configuration';
import {generateWifiBody, useUpdateConfig} from '../../utils/device-api';
import {isASCII} from '../../utils/formats';
import { DeviceConfig } from 'src/utils/device-api';
import LoadingView from '../../components/loading-view';
import {ErrorView} from '../setup-device-screen';
import Theme from '../../theme';

export type SavingIndicatorProps = {
    show: boolean;
    message: string;
};
export const SavingIndicator: React.FC<SavingIndicatorProps> = ({show, message}) => {
    if (!show) return null;
    return (<LoadingView show={show} message={message}/>);
};

export type ErrorIndicatorProps = {
    show: boolean;
    message?: string;
};
export const ErrorIndicator: React.FC<ErrorIndicatorProps> = ({show, message}) => {
    if (!show || !message) return null;
    return (
        <View>
            <Text>{message}</Text>
        </View>
    );
};

const areValidSSID = (ssid: string): [boolean, string|undefined] => {
    const {t} = useLocale();
    if (!ssid) return [false, undefined];
    if (ssid.length > 16) return [false, t('screens.setup_device_wifi.invalid_ssid')];
    return [true, undefined];
};

const areValidPasswd = (passwd: string): [boolean, string|undefined] => {
    const {t} = useLocale();
    if (passwd && passwd.length < 8) return [false, undefined];
    if (passwd.length > 32) return [false, t('screens.setup_device_wifi.invalid_passwd_size')];
    if (!isASCII(passwd)) return [false, t('screens.setup_device_wifi.invalid_passwd_chars')];
    return [true, undefined];
};

const areValidCredentials = (ssid: string, passwd: string): [boolean, string|undefined] => {
    const {t} = useLocale();
    if (!ssid) return [false, undefined];
    if (ssid.length > 16) return [false, t('screens.setup_device_wifi.invalid_ssid')];
    // if (!passwd) return [true, undefined];
    if (passwd && passwd.length < 8) return [false, undefined];
    if (passwd.length > 32) return [false, t('screens.setup_device_wifi.invalid_passwd_size')];
    if (!isASCII(passwd)) return [false, t('screens.setup_device_wifi.invalid_passwd_chars')];
    return [true, undefined];
};

const isValidResponse = (ssid: string, passwd: string, device?: DeviceConfig) => {
    return !!device && device.SSID === ssid && device.contrasena_SSID === passwd;
};

const ValidateMessage: React.FC<{message?: string}> = ({message}) => {
    if (!message) return null;
    return (
        <View><Text>{message}</Text></View>
    );
};

type Props = StackScreenProps<RootStakParams, typeof SETUP_DEVICE_WIFI_SCREEN>;
const SetupDeviceWifiScreen: React.FC<Props> = ({navigation, route}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const config = useAppConfig();
    const configName = route.params.configName;
    const {request, state} = useUpdateConfig();
    //const [credentials, setCredentials] = React.useState<WifiCredentials>({SSID: (config.wifiDetected && !config.wifiDetected.startsWith('CTINET')) ? config.wifiDetected : '', passwd: ''});
    const [ssid, setSSID] = React.useState((config.wifiDetected && !config.wifiDetected.startsWith('CTINET')) ? config.wifiDetected : '');
    const [passwd, setPasswd] = React.useState('');
    const validCredentials = areValidCredentials(ssid, passwd);
    const device = state.response?.body;
    const savedOk = isValidResponse(ssid, passwd, device);
    React.useEffect(() => {
        if (savedOk && device && !state.isLoading) navigation.replace(VALIDATE_CONFIGURATION_SCREEN, {device, configName});
    }, [savedOk, device]);
//console.log('Valid credentiasl', validCredentials, ssid, passwd);

    if (state.error) {
        return (
            <ErrorView
                error={!!state.error}
                close={() => navigation.replace(DISCONNECT_SCREEN)}/>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={state.isLoading ? styles.labelDisabled : styles.label}>{t('screens.setup_device_wifi.title_new_configuration')}</Text>
            <Text style={styles.message}>{t('screens.setup_device_wifi.message_new_configuration')}</Text>
            <WifiSelector
                errorSSID={areValidSSID(ssid)[1]}
                errorPasswd={areValidPasswd(passwd)[1]}
                ssid={ssid}
                passwd={passwd}
                updateSSID={setSSID}
                updatePasswd={setPasswd}/>
            <Button
                mode='contained'
                style={styles.button}
                color={Theme.colors.ctiGreen}
                disabled={!(validCredentials[0]) || state.isLoading}
                onPress={() => request(generateWifiBody(ssid, passwd))}>
                {t('screens.setup_device_wifi.button_save_configuration')}
            </Button>
            <SavingIndicator
                show={state.isLoading}
                message={t('screens.setup_device_wifi.message_saving_wifi')}/>
        </View>
    );
};

export default SetupDeviceWifiScreen;