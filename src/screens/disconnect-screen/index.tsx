import * as React from 'react';
import {
    View,
    BackHandler,
    Image
} from 'react-native';
import {
    Text,
    Button,
    ActivityIndicator
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';
import {useLocale} from '../../locales';
import {
    useUpdateConfig,
    generateStopAPBody,
} from '../../utils/device-api';
import {useStyles} from './styles';
import {
    DISCONNECT_SCREEN,
    RootStakParams
} from '../constants';
import {
    CTI_PREFIX,
    disconnectFromWifi,
    getSSID
} from '../../utils/wifi';
import Theme from '../../theme';

const DiscconectedImg = require('../../images/dlg.png');

export const closeDeviceConnection = async (request: () => void) => {
    const ssid = await getSSID();
    request();
};

type Props = StackScreenProps<RootStakParams, typeof DISCONNECT_SCREEN>;
const DisconnectScreen: React.FC<Props> = ({navigation}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const [disconnecting, setDisconnecting] = React.useState(true);
    const {request, state} = useUpdateConfig();
    React.useEffect(() => {
        getSSID().then(
            (ssid) => {
                //console.log('SSID was found', ssid);
                //console.log('Close connection in 2 seconds');
                setTimeout(() => setDisconnecting(false), 3000);
                request(generateStopAPBody());
                setTimeout(
                    () => {
                        // if (!!ssid && ssid.startsWith(CTI_PREFIX)) {
                        //     disconnectFromWifi(ssid);
                        //     //console.log('WiFi disconected', ssid);
                        // }
                        disconnectFromWifi(ssid);
                        //console.log('WiFi disconected', ssid);
                    }, 3000
                );
            },
            () => {
                //console.log('Close connection in 2 seconds NO SSID');
                setTimeout(() => setDisconnecting(false), 3000);
            }
        )
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
            navigation.popToTop();
            return false;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            }, [])
    );

    if (disconnecting) {
        return (
            <View
                style={styles.container}>
                <View style={styles.loadingBody}>
                    <ActivityIndicator
                        color={Theme.colors.ctiGreen}
                        size={120}/>
                    <Text style={styles.loadingText}>{t('screens.disconnect.message_disconnecting')}</Text>
                </View>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('screens.disconnect.message')}</Text>
            <View style={styles.body}>
                <Image source={DiscconectedImg} style={styles.dlgImage}/>
                <Text style={styles.messageText}>{t('screens.disconnect.message_disconnect')}</Text>
            </View>
            <Button
                style={styles.button}
                color={Theme.colors.ctiGreen}
                mode='contained'
                onPress={() => navigation.popToTop()}>
                {t('screens.disconnect.button_close')}
            </Button>
        </View>
    );
};

export default DisconnectScreen;