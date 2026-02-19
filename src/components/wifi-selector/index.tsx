import * as React from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import {
    Text,
    TextInput,
    IconButton
} from 'react-native-paper';
import { useLocale } from '../../locales';
import { useStyles } from './styles';
import Theme from '../../theme';

export type WifiCredentials = {
    SSID: string;
    passwd: string;
};
export type WifiSelectorProps = {
    ssid: string;
    passwd: string;
    updateSSID: (ssid: string) => void;
    updatePasswd: (passwd: string) => void;
    errorSSID: string | undefined;
    errorPasswd: string | undefined;
};
export const WifiSelector: React.FC<WifiSelectorProps> = ({ ssid, updateSSID, passwd, updatePasswd, errorSSID, errorPasswd }) => {
    const { t } = useLocale();
    const styles = useStyles();
    const [showPasswd, setShowPasswd] = React.useState(false);
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
            <View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                        mode='outlined'
                        label={t('components.wifi_selector.label_ssid')}
                        placeholder={t('components.wifi_selector.hint_ssid')}
                        autoCapitalize='none'
                        clearTextOnFocus={true}
                        error={!!errorSSID}
                        defaultValue={ssid}
                        onChangeText={updateSSID} />
                </View>
                <View style={styles.errorMessage}><Text style={styles.errorMessageText}>{errorSSID}</Text></View>
            </View>
            <View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputPassword}
                        secureTextEntry={!showPasswd}
                        theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                        mode='outlined'
                        label={t('components.wifi_selector.label_passwd')}
                        placeholder={t('components.wifi_selector.hint_passwd')}
                        autoCapitalize='none'
                        clearTextOnFocus={true}
                        error={!!errorPasswd}
                        defaultValue={passwd}
                        onChangeText={updatePasswd} />
                    <View style={{ marginLeft: -50, marginTop: 8 }}><IconButton icon={showPasswd ? 'eye' : 'eye-off'} onPress={() => setShowPasswd(show => !show)} iconColor={!!errorPasswd ? Theme.colors.error : Theme.colors.text} /></View>
                </View>
                <View style={styles.errorMessage}><Text style={styles.errorMessageText}>{errorSSID}</Text></View>
            </View>
        </ScrollView>
    );
};

export default WifiSelector;