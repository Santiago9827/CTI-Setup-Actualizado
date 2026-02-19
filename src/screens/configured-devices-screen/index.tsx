import * as React from 'react';
import {
    View,
    ScrollView,
    Image
} from 'react-native';
import {
    Text,
    Button,
    ActivityIndicator
} from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { useLocale } from '../../locales';
import { useStyles } from './styles';
import {
    CONFIGURED_DEVICES_SCREEN,
    RootStakParams
} from '../constants';
// import { DeviceSaved } from 'src/utils/device-api';
import {
    DeviceSaved,
    getLastConfiguration
} from '../../utils/device-api';
import { ResumeView } from '../validate-configuration-screen';
import Theme from '../../theme';

const DiscconectedImg = require('../../images/dlg.png');

type LoadingAction = { type: 'loading'; };
type LoadedAction = { type: 'loaded'; devices: DeviceSaved[] };
type Actions = LoadedAction | LoadingAction;
type State = {
    isLoading: boolean;
    devices: DeviceSaved[];
};
const reducerDevices = (state: State, action: Actions): State => {
    if (action.type === 'loading') return { isLoading: true, devices: [] };
    if (action.type === 'loaded') return { isLoading: false, devices: action.devices };
    return state;
};
const initialState: State = { isLoading: true, devices: [] };

export const DeviceListContainer: React.FC<State> = ({ isLoading, devices }) => {
    const Styles = useStyles();
    if (devices.length === 0 || isLoading) return null;
    return (
        <ScrollView style={Styles.deviceList}>
            {devices.map(device => <ResumeView mac={device.MAC} passwd={device.password} name={device.name} date={device.date} key={device.MAC} />)}
        </ScrollView>
    )
};
export const DeviceListLoading: React.FC<State> = ({ isLoading, devices }) => {
    const Styles = useStyles();
    const { t } = useLocale();

    if (isLoading) return (
        <View
            style={Styles.container}>
            <View style={Styles.loadingBody}>
                <ActivityIndicator
                    size={120} color={Theme.colors.ctiGreen} />
                <Text style={Styles.bodyTitle}>{t('screens.configured_devices.loading')}</Text>
            </View>
        </View>
    );
    if (devices.length === 0) return (
        <View style={Styles.container}>
            <View style={Styles.loadingBody}>
                <Image source={DiscconectedImg} />
                <Text style={Styles.bodyTitle}>{t('screens.configured_devices.no_devices')}</Text>
            </View>
        </View>
    );
    return null;
};

type Props = StackScreenProps<RootStakParams, typeof CONFIGURED_DEVICES_SCREEN>;
const ConfiguredDevicesScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useLocale();
    const Styles = useStyles();
    const [{ isLoading, devices }, dispatch] = React.useReducer(reducerDevices, initialState);
    React.useEffect(() => {
        getLastConfiguration().then((devices) => dispatch({ type: 'loaded', devices }));
    }, []);
    //console.log('Devices', devices, isLoading);
    return (
        <View style={Styles.container}>
            <Text
                style={Styles.message}>
                {t('screens.configured_devices.message')}
            </Text>
            <View
                style={Styles.deviceList}>
                <DeviceListLoading isLoading={isLoading} devices={devices} />
                <DeviceListContainer isLoading={isLoading} devices={devices} />
            </View>
            <Button
                style={Styles.button}
                mode='contained'
                color={Theme.colors.ctiGreen}
                onPress={() => navigation.pop()}>
                {t('screens.configured_devices.button_cancel')}
            </Button>
        </View>
    );
};

export default ConfiguredDevicesScreen;