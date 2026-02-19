import * as React from 'react';
import {
    View,
    Image
} from 'react-native';
import {
    Text,
    Button
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import {
    XIAOMI_PERMISSIONS_SCREEN,
    FIND_DEVICES_SCREEN,
    WIFI_CREDENTIALS_SCREEN,
    RootStakParams
} from '../constants';
import {useAppConfig, useUpdateAppConfigForceReload} from '../../components/use-configuration';
import DevicesConnect from '../../components/devices-connect';
import CurrentWifi from '../../components/current-wifi';
import Theme from '../../theme';
import {
    isMiUi,
    forgetAllCTIWifis,
    getSuggestion
} from '../../utils/wifi';

const NoPermissionImage = require('../../images/nowifi.png');

type Props = StackScreenProps<RootStakParams, typeof FIND_DEVICES_SCREEN>;
const FindDevicesScreen: React.FC<Props> = ({navigation}) => {
    const styles = useStyles();
    const {t} = useLocale();
    const config = useAppConfig();
    const forceReload = useUpdateAppConfigForceReload();

    React.useEffect(() => {
        if (!config.wifiPermissions) return;
        isMiUi().then(isIt => {
            if (isIt) {
                getSuggestion().then(notShow => !notShow && navigation.navigate(XIAOMI_PERMISSIONS_SCREEN))
            }
        });
    }, [config.wifiPermissions]);

    React.useEffect(() => {
        forgetAllCTIWifis().catch(error => console.log('Error forget wifis', error));
    }, []);
    if (!config.wifiPermissions) {
        return (
            <View style={styles.container}>
                <Text style={styles.permTitle}>{t('screens.find_devices.premissions_needed')}</Text>
                <View  style={styles.permBody}>
                    <Image source={NoPermissionImage} width={200} height={200} style={{width: 200, height: 200}}/>
                    <Text style={styles.permBodyTitle}>{t('screens.find_devices.premissions_needed_details')}</Text>
                </View>
                <Button
                style={styles.bottom}
                    color={Theme.colors.ctiGreen}
                    mode='contained'
                    onPress={forceReload}>
                    {t('screens.find_devices.button_request_permission')}
                </Button>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.body}>
                <DevicesConnect
                    onConnection={(device) => navigation.navigate(WIFI_CREDENTIALS_SCREEN, device)}/>
                <CurrentWifi/>
            </View>
        </View>
    );
};

export default FindDevicesScreen;