import * as React from 'react';
import {
    View,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import {
    Text,
    TextInput,
    IconButton,
    Button
} from 'react-native-paper';
import ListWifi from '../list-wifi';
import { useLocale } from '../../locales';
import Theme from '../../theme';
import { useStyles } from './styles';

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
    const [showWifis, setShowWifis] = React.useState(false);
    const [showPasswd, setShowPasswd] = React.useState(false);
    const onSelected = React.useCallback((SSID: string | null | undefined) => {
        if (SSID) updateSSID(SSID);
        setShowWifis(false);
    }, [updateSSID]);

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
            <ListWifi
                show={showWifis}
                onSelected={onSelected} />
            <View>
                {/* <Button
                    style={styles.buttonMoreWifis}
                    labelStyle={styles.buttonMoreWifisText}
                    mode='contained'
                    color={Theme.colors.ctiGreen}
                    onPress={() => setShowWifis(true)}
                    icon='wifi-star'>
                    {t('components.wifi_selector.button_show_wifis')}
                </Button> */}
                <Button
                    style={styles.buttonMoreWifis}
                    contentStyle={{ height: 56 }}     // opcional, para centrar bien
                    labelStyle={styles.buttonMoreWifisText}
                    mode="contained"
                    buttonColor={Theme.colors.ctiGreen}
                    textColor={Theme.colors.primary}
                    onPress={() => setShowWifis(true)}
                    icon="wifi-star"
                >
                    {t('components.wifi_selector.button_show_wifis')}
                </Button>

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
                        value={ssid}
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
                    <View style={{ marginLeft: -50, marginTop: 8 }}>
                        <IconButton icon={showPasswd ? 'eye' : 'eye-off'} onPress={() =>
                            setShowPasswd(show => !show)} iconColor={!!errorPasswd ? Theme.colors.error : Theme.colors.text} />
                    </View>
                </View>
                <View style={styles.errorMessage}><Text style={styles.errorMessageText}>{errorPasswd}</Text></View>
            </View>
        </ScrollView>
    );
};

export default WifiSelector;