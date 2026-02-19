import * as React from 'react';
import {
    View,
    Image,
    ScrollView,
    KeyboardAvoidingView
} from 'react-native';
import {
    Text,
    TextInput,
    IconButton,
    Button
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {
    WIFI_CREDENTIALS_SCREEN,
    SETUP_DEVICE_SCREEN,
    RootStakParams
} from '../constants';
import {useLocale} from '../../locales';
import {
    CTI_PREFIX,
    connectWithWiFi,
    disconnectFromWifi
} from '../../utils/wifi';
import {
    useAppConfig,
    useUpdateAppConfigWifiDetected
} from '../../components/use-configuration';
import {useStyles} from './styles';
import LoadingView from '../../components/loading-view';
import Theme from '../../theme';

const DeviceImg = require('../../images/dlg.png');


type Props = StackScreenProps<RootStakParams, typeof WIFI_CREDENTIALS_SCREEN>;
export const WifiCredentialsScreen: React.FC<Props> = ({navigation, route}) => {
    const wifi = route.params;
    const config = useAppConfig();
    const updateWifiDetected = useUpdateAppConfigWifiDetected();
    const {t} = useLocale();
    const styles = useStyles();
    const [passwd, setPasswd] = React.useState('');
    const [showPasswd, setShowPasswd] = React.useState(false);
    const [error, setError] = React.useState('');
    const [connecting, setConnecting] = React.useState(false);

    const changePassword = React.useCallback((text) => {
        setError('');
        setPasswd(text);
    }, []);

    const connect = React.useCallback(async () => {
        setConnecting(true);
        setError('');
        //console.log('Connected to', config.wifiConnection.SSID, ' change to ', wifi.SSID);
        if (config.wifiConnection && config.wifiConnection.SSID && !config.wifiConnection.SSID.startsWith(CTI_PREFIX)) {
            updateWifiDetected(config.wifiConnection.SSID);
        }
        try {
            const connected = await connectWithWiFi(wifi.SSID, passwd);
            //console.log('Connected to', wifi, connected);
            if (connected.ssid.startsWith(CTI_PREFIX)) {
                navigation.replace(SETUP_DEVICE_SCREEN, {wifi: connected, password: passwd});
            }
            else {
                //console.log('Error connection wifi invalid ssid', connected.ssid);
                setError(t('screens.wifi_credentials.error_connecting'));
            }
        }
        catch(error) {
            //console.log('Error connection wifi', wifi.SSID, passwd, error);
            await disconnectFromWifi(wifi.SSID);
            setError(t('screens.wifi_credentials.error_connecting'));
        }
        setConnecting(false);
    }, [passwd]);

    return (
        <KeyboardAvoidingView style={styles.container}>
            <ScrollView style={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
            <View style={styles.body}>
                <View style={styles.connectBody}>
                    <Text style={styles.connectTitle}>
                        {t('screens.wifi_credentials.message') + wifi.SSID}
                    </Text>
                    <Image source={DeviceImg} height={180} width={180} style={{width: 180, height: 180}}/>
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        secureTextEntry={!showPasswd}
                        theme={{colors: {primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen}}}
                        mode='outlined'
                        label={t('screens.wifi_credentials.input_label_password')}
                        placeholder={t('screens.wifi_credentials.input_hint_password')}
                        autoCapitalize='none'
                        clearTextOnFocus={true}
                        value={passwd}
                        keyboardType='numeric'
                        maxLength={8}
                        error={!!error}
                        onChangeText={changePassword}/>
                    <View style={{marginLeft: -50, marginTop: 8}}><IconButton icon={showPasswd ? 'eye' : 'eye-off'} onPress={() => setShowPasswd(show => !show)} color={!!error ? Theme.colors.error : Theme.colors.text}/></View>
                </View>
                <View style={styles.errorMessage}>
                    <Text style={styles.errorMessageText}>{error}</Text>
                </View>
            </View>
            <View style={styles.buttons}>
                <Button
                    style={styles.cancelButton}
                    color='#E1E1E1'
                    disabled={connecting}
                    labelStyle={{color: '#707070'}}
                    mode='contained'
                    onPress={() => navigation.pop()}>
                    {t('screens.wifi_credentials.button_cancel')}
                </Button>
                <Button
                    style={styles.connectButton}
                    color={Theme.colors.ctiGreen}
                    disabled={!passwd || passwd.length < 8 || connecting}
                    labelStyle={{color: Theme.colors.primary}}
                    mode='contained'
                    onPress={connect}>
                    {t('screens.wifi_credentials.button_connect')}
                </Button>
            </View>
            <View style={{ height: 60 }} />
            </ScrollView>
            <LoadingView show={connecting} size={180}/>
        </KeyboardAvoidingView>
    );
};

export default WifiCredentialsScreen;
