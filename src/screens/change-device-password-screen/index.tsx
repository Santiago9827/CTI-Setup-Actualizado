import * as React from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import {
    Text,
    TextInput,
    Button,
    IconButton
} from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { useLocale } from '../../locales';
import { useStyles } from './styles';
import {
    DISCONNECT_SCREEN,
    CHANGE_DEVICE_PASSWORD_SCREEN,
    RootStakParams
} from '../constants';
import {
    DeviceConfigBody,
    generateChangePasswordBody,
    useUpdateConfig
} from '../../utils/device-api';
import LoadingView from '../../components/loading-view';
import { ErrorView } from '../setup-device-screen';
import Theme from '../../theme';

export const validatePassword = (passwd: string, repasswd: string) => {
    if (!passwd) return false;
    if (passwd.length < 8) return false;
    if (passwd.length > 8) return false;
    if (passwd !== repasswd) return false;
    return true;
};
export type ChangePasswodViewProps = {
    show: boolean;
    error: boolean;
    passwd: string;
    onChangePasswd: (passwd: string) => void;
    rePasswd: string;
    onChangeRepasswd: (passwd: string) => void;
};
export const ChangePasswodView: React.FC<ChangePasswodViewProps> = ({ show, error, passwd, onChangePasswd, rePasswd, onChangeRepasswd }) => {
    const styles = useStyles();
    const { t } = useLocale();
    const [showPasswd, setShowPasswd] = React.useState(false);
    const [showRePasswd, setShowRePasswd] = React.useState(false);
    if (!show) return null;
    return (
        <ScrollView style={styles.inputsContainer} keyboardShouldPersistTaps='handled'>
            <Text style={styles.message}>{t('screens.change_device_password.message')}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputPassword}
                    secureTextEntry={!showPasswd}
                    theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                    mode='outlined'
                    label={t('screens.change_device_password.label_passwd')}
                    autoCapitalize='none'
                    clearTextOnFocus={true}
                    value={passwd}
                    placeholder={t('screens.change_device_password.hint_passwd')}
                    maxLength={8}
                    keyboardType='number-pad'
                    error={passwd !== '' && passwd.length < 8}
                    onChangeText={(text) => onChangePasswd(text)} />
                <View style={{ marginLeft: -50, marginTop: 8 }}><IconButton icon={showPasswd ? 'eye' : 'eye-off'} onPress={() => setShowPasswd(show => !show)} iconColor={(passwd !== '' && rePasswd !== '' && passwd !== rePasswd) ? Theme.colors.error : Theme.colors.text} /></View>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputPassword}
                    secureTextEntry={!showRePasswd}
                    theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                    mode='outlined'
                    label={t('screens.change_device_password.label_repasswd')}
                    autoCapitalize='none'
                    clearTextOnFocus={true}
                    disabled={!passwd}
                    value={rePasswd}
                    placeholder={t('screens.change_device_password.hint_repasswd')}
                    maxLength={8}
                    keyboardType='number-pad'
                    error={passwd !== rePasswd}
                    onChangeText={(text) => onChangeRepasswd(text)} />
                <View style={{ marginLeft: -50, marginTop: 8 }}><IconButton icon={showRePasswd ? 'eye' : 'eye-off'} onPress={() => setShowRePasswd(show => !show)} iconColor={(passwd !== '' && passwd.length < 8) ? Theme.colors.error : Theme.colors.text} /></View>
            </View>
            <View style={styles.errorView}>
                {passwd !== '' && rePasswd !== '' && passwd !== rePasswd && <Text style={styles.errorText}>{t('screens.change_device_password.error_match')}</Text>}
                {passwd !== '' && passwd.length < 8 && <Text style={styles.errorText}>{t('screens.change_device_password.error_min_size')}</Text>}
                {error && <Text style={styles.errorText}>{t('screens.change_device_password.error_saving')}</Text>}
            </View>
        </ScrollView>
    );
};

// export const LoadingView: React.FC<{show: boolean}> = ({show}) => {
//     const Styles = useStyles();
//     const {t} = useLocale();
//     if (!show) return null;
//     return (
//         <View>
//             <ActivityIndicator/>
//             <Text>{t('screens.change_device_password.saving')}</Text>
//         </View>
//     );
// };

export const SavedView: React.FC<{ show: boolean; action: () => void; }> = ({ show, action }) => {
    const Styles = useStyles();
    const { t } = useLocale();
    if (!show) return null;
    return (
        <View style={Styles.containerSaved}>
            <Text style={Styles.savedLabel}>{t('screens.change_device_password.save_ok_label')}</Text>
            <View style={Styles.containerSavedMessage}>
                <Text style={Styles.savedMessage}>{t('screens.change_device_password.save_ok')}</Text>
            </View>
            <Button
                style={Styles.savedButton}
                mode='contained'
                color={Theme.colors.ctiGreen}
                onPress={action}>
                {t('screens.change_device_password.button_finish')}
            </Button>
        </View>
    );
};

type Props = StackScreenProps<RootStakParams, typeof CHANGE_DEVICE_PASSWORD_SCREEN>;
const ChangeDevicePasswordScreen: React.FC<Props> = ({ navigation }) => {
    const Styles = useStyles();
    const { t } = useLocale();
    const [passwd, setPasswd] = React.useState('');
    const [rePasswd, setRePasswd] = React.useState('');
    const { request, state } = useUpdateConfig();

    if (state.error) {
        return (
            <ErrorView
                error={!!state.error}
                close={() => navigation.replace(DISCONNECT_SCREEN)} />
        );
    }

    const savedOk = !!state.response && !state.error && state.response.status === 200;

    return (
        <View style={Styles.container}>
            {
                !savedOk && !state.isLoading && (
                    <Text style={Styles.label}>{t('screens.change_device_password.label')}</Text>
                )
            }
            <ChangePasswodView
                show={!state.isLoading && (!state.response || !!state.error || state.response.status !== 200)}
                error={!!state.error}
                passwd={passwd}
                rePasswd={rePasswd}
                onChangePasswd={setPasswd}
                onChangeRepasswd={setRePasswd} />
            <SavedView
                show={savedOk}
                action={() => navigation.pop()} />
            {
                !savedOk && !state.isLoading && (
                    <View style={Styles.buttons}>
                        <Button
                            style={Styles.button}
                            mode='contained'
                            color={Theme.colors.ctiGrey}
                            disabled={state.isLoading}
                            onPress={() => navigation.pop()}>
                            {t('screens.change_device_password.button_cancel')}
                        </Button>
                        <Button
                            style={Styles.button}
                            mode='contained'
                            color={Theme.colors.ctiGreen}
                            disabled={!validatePassword(passwd, rePasswd)}
                            onPress={() => request(generateChangePasswordBody(passwd))}>
                            {t('screens.change_device_password.button_change_password')}
                        </Button>
                    </View>
                )
            }
            <LoadingView show={state.isLoading} message={t('screens.change_device_password.saving')} />
        </View>
    );
};

export default ChangeDevicePasswordScreen;