import * as React from 'react';
import WifiManager from 'react-native-wifi-reborn';
import {
    View,
    ScrollView
} from 'react-native';
import {
    Text,
    Button,
    IconButton,
    ActivityIndicator
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {
    VALIDATE_CONFIGURATION_SCREEN,
    RootStakParams
} from '../constants';
import {
    saveNewConfiguration,
    DeviceSaved,
    useUpdateConfig,
    generateStopAPBody,
    waitForPromise,
    checkInternetConnection,
    checkServerCommunication
} from '../../utils/device-api';
import {
    timeoutResolvePromise,
    disconnectFromWifi
} from '../../utils/wifi';
import {
    useAppConfig
} from '../../components/use-configuration';
import {useStyles} from './styles';
import Theme from '../../theme';

export type ConnectionStates = 'NONE'|'LOADING'|'DONE'|'FAILED'|'FAILEDNORETRY';
type ConnectionState = {
    message: string;
    state: ConnectionStates;
};
type MessageProccessProps = {
    connectionState: ConnectionState;
    retry: () => void;
};
const MessageProccess: React.FC<MessageProccessProps> = ({connectionState, retry}) => {
    const styles = useStyles();
    const {t} = useLocale();
    if (connectionState.state === 'NONE') return null;
    const iconName = connectionState.state === 'DONE' ? 'check-bold' : 'close-thick';
    const iconColor = connectionState.state === 'DONE' ? Theme.colors.ctiGreen : Theme.colors.error;

    if (connectionState.state === 'LOADING') {
        return (
            <View style={styles.message}>
                <ActivityIndicator color={Theme.colors.ctiGreen} style={styles.action} size={128}/>
                <Text style={styles.labelMessageSubtitle}>{t('screens.validate_configuration.validating')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.message}>
            <View style={styles.labelMessage}>
                <Icon style={styles.icon} name={iconName} color={iconColor} size={132}/>
                <Text style={connectionState.state.startsWith('FAILED') ? styles.labelMessageSubtitleError : styles.labelMessageSubtitle}>{connectionState.message}</Text>
            </View>
            {
                connectionState.state === 'FAILED' && (
                <Button
                    style={styles.button}
                    mode='contained'
                    color={Theme.colors.ctiGreen} disabled={connectionState.state !== 'FAILED'}
                    onPress={retry}
                    icon='reload'>
                    {t('screens.validate_configuration.retry_button')}
                </Button>
                )
            }
        </View>
    );
};

export const ResumeView: React.FC<{mac: string; passwd: string; name: string; date: number;}> = ({mac, passwd, name, date}) => {
    const styles = useStyles();
    const {t} = useLocale();
    const resumeDate = new Date(date);
    return (
        <View style={styles.resumeContainer}>
            <View style={styles.resumeItem}>
                <Text style={styles.resumeLabel}>{t('screens.validate_configuration.resume_label_name')}</Text>
                <Text style={styles.resumeValue}>{name}</Text>
            </View>
            <View style={styles.resumeItem}>
                <Text style={styles.resumeLabel}>{t('screens.validate_configuration.resume_label_mac')}</Text>
                <Text style={styles.resumeValue}>{mac}</Text>
            </View>
            <View style={styles.resumeItem}>
                <Text style={styles.resumeLabel}>{t('screens.validate_configuration.resume_label_passwd')}</Text>
                <Text style={styles.resumeValue}>{passwd}</Text>
            </View>
            <View style={styles.resumeDate}>
                <Text style={styles.resumeDateText}>{resumeDate.toLocaleDateString() + ' ' + resumeDate.toLocaleTimeString()}</Text>
            </View>
        </View>
    );
}

type Props = StackScreenProps<RootStakParams, typeof VALIDATE_CONFIGURATION_SCREEN>;
const ValidateConfigurationScreen: React.FC<Props> = ({navigation, route}) => {
    const styles = useStyles();
    const {t} = useLocale();
    const config = route.params.device;
    const configName = route.params.configName;
    const configDate = Date.now();
    const newDeviceSaved: DeviceSaved = {MAC: config.MAC_disp, password: config.contrasena_disp, date: configDate, name: configName || ''};
    const appConfig = useAppConfig();
    const {request, state} = useUpdateConfig();
    // console.log('State device', state);
    const [serverConnection, setServerConnection] = React.useState<ConnectionState>({state: 'NONE', message: ''});

    const requestServer = React.useCallback(async () => {
        try {
            const serverResponse = await checkServerCommunication(config.MAC_disp);
            // console.log('Server Response', serverResponse);
            if (serverResponse.connected) {
                const date = new Date(serverResponse.date);
                setTimeout(() => setServerConnection({state: 'DONE', message: t('screens.validate_configuration.done_server') + ' ' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}), 1000);
            }
            else {
                setTimeout(() => setServerConnection({state: 'FAILEDNORETRY', message: t('screens.validate_configuration.failed_server_tx')}), 1000);
            }
        }
        catch(error) {
            //// console.log('Server failed', error);
            setServerConnection({state: 'FAILED', message: t('screens.validate_configuration.failed_server')});
        }
    }, []);

    const checkServer = React.useCallback(async () => {
        setServerConnection({state: 'LOADING', message: t('screens.validate_configuration.validating')});
        // console.log('Start disconnecting');
        request(generateStopAPBody());
        await waitForPromise(2000);
        await saveNewConfiguration(newDeviceSaved);
        await disconnectFromWifi(appConfig.wifiConnection.SSID);
        await timeoutResolvePromise(2000);
        try {
            // console.log('Start internet Checking. First Try');
            await checkInternetConnection();
        }
        catch (firstError) {
            // console.log('Internet Error', firstError);
            try {
                // console.log('Start internet Checking. Second Try');
                await waitForPromise(5000);
                await checkInternetConnection();
            }
            catch (secondtError) {
                // console.log('Start internet Checking. Second Try FAILED', secondtError);
                setServerConnection({state: 'FAILED', message: t('screens.validate_configuration.failed_internet')});
                return;
            }
        }
        // TODO: Check device is connected to server
        await requestServer();
    }, []);

    const retryCheckServer = React.useCallback(async () => {
        setServerConnection({state: 'LOADING', message: t('screens.validate_configuration.validating')});
        try {
            // console.log('Start internet Checking. First Try');
            await checkInternetConnection();
        }
        catch (firstError) {
            // console.log('Internet Error', firstError);
            try {
                // console.log('Start internet Checking. Second Try');
                await waitForPromise(5000);
                await checkInternetConnection();
            }
            catch (secondtError) {
                // console.log('Start internet Checking. Second Try FAILED', secondtError);
                setServerConnection({state: 'FAILED', message: t('screens.validate_configuration.failed_internet')});
                return;
            }
        }
        // TODO: Check device is connected to server
        await requestServer();
    }, []);

    React.useEffect(() => {
        checkServer();
    }, []);

    // console.log('App config info', serverConnection);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.messages}>
                <ResumeView mac={config.MAC_disp} passwd={config.contrasena_disp} name={configName} date={configDate}/>
                <MessageProccess connectionState={serverConnection} retry={retryCheckServer}/>
            </ScrollView>
                <Button
                    style={styles.button}
                    mode='contained'
                    color={Theme.colors.ctiGreen}
                    disabled={serverConnection.state === 'LOADING'}
                    onPress={() => navigation.popToTop()}>
                    {t('screens.validate_configuration.close_button')}
                </Button>
        </View>
    );
};

export default ValidateConfigurationScreen;