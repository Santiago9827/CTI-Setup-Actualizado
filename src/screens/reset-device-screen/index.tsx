import * as React from 'react';
import {
    View,
    Image
} from 'react-native';
import {
    Text,
    Button,
    ActivityIndicator
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import {
    RESET_DEVICE_SCREEN,
    DISCONNECT_SCREEN,
    RootStakParams
} from '../constants';
import {
    generateResetBody,
    useUpdateConfig
} from '../../utils/device-api';
import LoadingView from '../../components/loading-view';
import {ErrorView} from '../setup-device-screen';
import Theme from '../../theme';

const ResetImg = require('../../images/dlg.png');

export type ResetViewProps = {
    show: boolean;
    backAction: () => void;
    resetAction: () => void;
};
export const ResetView: React.FC<ResetViewProps> = ({show, backAction, resetAction}) => {
    const styles = useStyles();
    const {t} = useLocale();
    if (!show) return null;
    return (
        <>
        <View style={styles.body}>
            <Text style={styles.messageText}>{t('screens.reset_device.reset')}</Text>
            <Image source={ResetImg} style={styles.resetImage}/>
        </View>
        <View style={styles.buttons}>
            <Button
                style={styles.buttonReset}
                color={Theme.colors.ctiGrey}
                mode='contained'
                onPress={backAction}>
                {t('screens.reset_device.button_cancel')}
            </Button>
            <Button
                style={styles.buttonReset}
                color={Theme.colors.error}
                mode='contained'
                onPress={resetAction}>
                {t('screens.reset_device.button_reset')}
            </Button>
        </View>
        </>
    );
};

// export const LoadingView: React.FC<{show: boolean}> = ({show}) => {
//     const styles = useStyles();
//     const {t} = useLocale();
//     if (!show) return null;
//     return (
//         <View style={styles.body}>
//             <ActivityIndicator/>
//             <Text>{t('screens.reset_device.reseting')}</Text>
//         </View>
//     );
// };

export type SavedViewProps = {
    show: boolean;
    closeAction: () => void;
};
export const SavedView: React.FC<SavedViewProps> = ({show, closeAction}) => {
    const styles = useStyles();
    const {t} = useLocale();
    if (!show) return null;
    return (
        <>
            <View style={styles.body}>
                <Text style={styles.messageText}>{t('screens.reset_device.reset_ok')}</Text>
            </View>
            <Button
                style={styles.button}
                mode='contained'
                color={Theme.colors.ctiGreen}
                onPress={closeAction}>
                {t('screens.reset_device.button_finish')}
            </Button>
        </>
    );
};

type Props = StackScreenProps<RootStakParams, typeof RESET_DEVICE_SCREEN>;
const ResetDeviceScreen: React.FC<Props> = ({navigation}) => {
    const styles = useStyles();
    const {t} = useLocale();
    const {request, state} = useUpdateConfig();
    React.useEffect(() => {
        if (!!state.response || !!state.error) {
            setTimeout(() => {
                navigation.replace(DISCONNECT_SCREEN);
            }, 1500)
        }
    }, [state]);

    // if (state.response || state.error) {
    //     return null;
    // }
    return (
        <View style={styles.container}>
            {
                !state.isLoading && (
                    <Text style={styles.label}>{t('screens.reset_device.label')}</Text>
                )
            }
            <ResetView
                show={!state.isLoading && !state.response && !state.error}
                backAction={() => navigation.pop()}
                resetAction={() => request(generateResetBody())}/>
            <LoadingView show={state.isLoading} message={t('screens.reset_device.reseting')}/>
            <SavedView
                show={!!state.response || !!state.error}
                closeAction={() => navigation.replace(DISCONNECT_SCREEN)}/>
        </View>
    );
};

export default ResetDeviceScreen;