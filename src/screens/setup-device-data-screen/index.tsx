import * as React from 'react';
import {
    View,
    KeyboardAvoidingView,
    Image,
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import {
    Text,
    Button,
    TextInput, ActivityIndicator
} from 'react-native-paper';
import SwitchSelector from "react-native-switch-selector";
import {
    generatePINBody,
    generate4GAutoBody,
    generate4GManualBody,
    useUpdateConfig,
    useGetConfig,
    ResponseState,
    DeviceConfig
} from '../../utils/device-api';
import {
    VALIDATE_CONFIGURATION_SCREEN,
    SETUP_DEVICE_DATA_SCREEN,
    DISCONNECT_SCREEN,
    RootStakParams
} from '../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { useLocale } from '../../locales';
import { useStyles } from './styles';
import { isASCII } from '../../utils/formats';
import LoadingView from '../../components/loading-view';
import { ErrorView } from '../setup-device-screen';
import Theme from '../../theme';

const PukImg = require('../../images/puk.png');

export type SavingIndicatorProps = {
    show: boolean;
    message: string;
};
export const SavingIndicator: React.FC<SavingIndicatorProps> = ({ show, message }) => {
    if (!show) return null;
    return (<LoadingView show={show} message={message} />);
};

export type ErrorIndicatorProps = {
    show: boolean;
    message?: string;
};
export const ErrorIndicator: React.FC<ErrorIndicatorProps> = ({ show, message }) => {
    if (!show || !message) return null;
    return (
        <View>
            <Text>{message}</Text>
        </View>
    );
};

export type NoSIMViewProps = {
    device: DeviceConfig;
    updateDevice: (device: DeviceConfig) => void;
    closeConnection: () => void;
    closeScreen: () => void;
};
export const NoSIMView: React.FC<NoSIMViewProps> = ({ device, updateDevice, closeConnection, closeScreen }) => {
    const { t } = useLocale();
    const styles = useStyles();
    const { state, request } = useGetConfig();
    React.useEffect(() => {
        if (device.estado_SIM === 0 && !state.error) setTimeout(request, 2500);
    }, [device]);
    React.useEffect(() => {
        if (state.response?.body && !state.error) updateDevice(state.response.body);
    }, [state]);

    //console.log('Finding SIM', device, state);
    if (device.estado_SIM !== 0) return null;
    if (state.error) {
        return (
            <ErrorView
                error={!!state.error}
                close={closeConnection} />
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.pukContainer}>
                <Text style={styles.pukLabel}>{t('screens.setup_device_data.message_find_4g')}</Text>
                <ActivityIndicator size={120} color={Theme.colors.ctiGreen} />
                <Text style={styles.pukMessage}>{t('screens.setup_device_data.message_no_4g')}</Text>
                <Button
                    style={styles.closeButton}
                    mode='contained'
                    color={Theme.colors.ctiGreen}
                    onPress={closeScreen}>
                    {t('screens.setup_device_data.button_close')}
                </Button>
            </View>
        </View>
    );
};

export type PinBoxProps = {
    show: boolean;
    loading: boolean;
    pin: string;
    pinError?: boolean;
    setPinNumber: (pin: string) => void;
    savePin: () => void;
    tries: number;
};
export const PinBox: React.FC<PinBoxProps> = ({ show, loading, pin, setPinNumber, savePin, tries, pinError }) => {
    const { t } = useLocale();
    const styles = useStyles();
    if (!show) return null;
    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='handled'>
            <KeyboardAvoidingView style={styles.pinContainer}>
                <Text style={loading ? styles.pinLabelDisabled : styles.pinLabel}>{t('screens.setup_device_data.label_pin')}</Text>
                <TextInput
                    theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                    value={pin}
                    disabled={loading}
                    style={styles.pinInput}
                    mode='outlined'
                    label={t('screens.setup_device_data.hint_pin')}
                    placeholder={t('screens.setup_device_data.hint_pin')}
                    keyboardType='number-pad'
                    secureTextEntry={true}
                    maxLength={4}
                    onChangeText={(text) => setPinNumber(text.slice(0, 4))} />
                <Text style={tries < 2 ? styles.tryLabel1 : (tries < 3 ? styles.tryLabel2 : styles.tryLabel)}>
                    {pinError ? t('screens.setup_device_data.label_tries_pin_failed') : t('screens.setup_device_data.label_tries_pin')} {tries}
                </Text>
                <Button
                    mode='contained'
                    color={Theme.colors.ctiGreen}
                    disabled={pin.length < 4 || loading}
                    onPress={savePin}>
                    {t('screens.setup_device_data.button_pin')}
                </Button>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

export type PinViewProps = {
    device: DeviceConfig;
    updateDevice: (device: DeviceConfig) => void;
    closeConnection: () => void;
    closeScreen: () => void;
};
export const PinView: React.FC<PinViewProps> = ({ device, updateDevice, closeConnection, closeScreen }) => {
    const { t } = useLocale();
    const styles = useStyles();
    const { request, state } = useUpdateConfig();
    const newConfig = state.response?.body;
    const errorConfig = state.response?.status === 400;
    const [pinNumber, setPinNumber] = React.useState('');
    const savePin = React.useCallback(() => {
        request(generatePINBody(Number(pinNumber)));
    }, [device, pinNumber]);
    React.useEffect(() => {
        if (newConfig) {
            updateDevice(newConfig);
        }
    }, [newConfig]);
    //console.log(device, newConfig);
    if (device.estado_SIM !== 2 && device.estado_SIM !== 3) return null;
    if (device.intentos_PIN === 0 || device.estado_SIM === 3) {
        // Need PUK
        return (
            <View style={styles.container}>
                <View style={styles.pukContainer}>
                    <Text style={styles.pukLabel}>{t('screens.setup_device_data.message_puk')}</Text>
                    <Image source={PukImg} style={styles.pukImage} resizeMode='contain' />
                    <Text style={styles.pukMessage}>{t('screens.setup_device_data.message_need_puk')}</Text>
                    <Button
                        style={styles.closeButton}
                        mode='contained'
                        color={Theme.colors.ctiGreen}
                        onPress={closeScreen}>
                        {t('screens.setup_device_data.button_close')}
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <>
            <PinBox
                show={!state.error}
                loading={state.isLoading}
                pin={pinNumber}
                setPinNumber={setPinNumber}
                savePin={savePin}
                pinError={errorConfig}
                tries={device.intentos_PIN} />
            <SavingIndicator
                show={state.isLoading}
                message={t('screens.setup_device_data.message_saving_pin')} />
            <ErrorView
                error={!!state.error}
                close={closeConnection} />
        </>
    );
};

export type ConfigAPNViewProps = {
    device: DeviceConfig;
    onChange: (device: DeviceConfig) => void;
};
export const ConfigAPNView: React.FC<ConfigAPNViewProps> = ({ device, onChange }) => {
    const { t } = useLocale();
    const styles = useStyles();
    if (device.auto_man !== 1) return null;
    return (
        <>
            <KeyboardAvoidingView behavior='padding' style={styles.apnContainer}>
                <TextInput
                    theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                    style={styles.apnInput}
                    mode='outlined'
                    value={device.man_APN}
                    label={t('screens.setup_device_data.label_apn')}
                    placeholder={t('screens.setup_device_data.hint_apn')}
                    maxLength={48}
                    autoCapitalize='none'
                    error={!isASCII(device.man_APN, false)}
                    onChangeText={(text) => onChange({ ...device, man_APN: text })} />
                {!isASCII(device.man_APN, false) && <Text>{t('screens.setup_device_data.error_apn')}</Text>}
            </KeyboardAvoidingView>
            <KeyboardAvoidingView behavior='padding' style={styles.apnContainer}>
                <TextInput
                    theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                    style={styles.apnInput}
                    mode='outlined'
                    value={device.man_USER}
                    label={t('screens.setup_device_data.label_user')}
                    placeholder={t('screens.setup_device_data.hint_user')}
                    maxLength={48}
                    autoCapitalize='none'
                    error={!isASCII(device.man_USER, false)}
                    onChangeText={(text) => onChange({ ...device, man_USER: text })} />
                {!isASCII(device.man_USER, false) && <Text>{t('screens.setup_device_data.error_user')}</Text>}
            </KeyboardAvoidingView>
            <KeyboardAvoidingView behavior='padding' style={styles.apnContainer}>
                <TextInput
                    theme={{ colors: { primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen } }}
                    style={styles.apnInput}
                    mode='outlined'
                    value={device.man_CONTRASEN}
                    label={t('screens.setup_device_data.label_password')}
                    placeholder={t('screens.setup_device_data.hint_password')}
                    maxLength={48}
                    autoCapitalize='none'
                    error={!isASCII(device.man_CONTRASEN, false)}
                    onChangeText={(text) => onChange({ ...device, man_CONTRASEN: text })} />
                {!isASCII(device.man_CONTRASEN, false) && <Text>{t('screens.setup_device_data.error_password')}</Text>}
            </KeyboardAvoidingView>
        </>

    );
};

export type ConfigTypeViewProps = {
    type: number;
    onChange: (type: 0 | 1) => void;
    isLoading: boolean;
};
export const ConfigTypeView: React.FC<ConfigTypeViewProps> = ({ type, onChange, isLoading }) => {
    const { t } = useLocale();
    const styles = useStyles();
    return (
        <TouchableWithoutFeedback onPress={() => onChange(type === 0 ? 1 : 0)}>
            <View style={styles.modeContainer}>
                <SwitchSelector
                    style={styles.modeSelector}
                    initial={type}
                    value={type}
                    textColor={Theme.colors.primary} //'#7a44cf'
                    selectedColor={Theme.colors.primary}
                    buttonColor={isLoading ? Theme.colors.ctiBlueGrey : Theme.colors.ctiGreen}
                    borderColor={Theme.colors.ctiBlueGrey}
                    hasPadding
                    options={[{ label: t('screens.setup_device_data.label_data_type_auto'), value: 0 }, { label: t('screens.setup_device_data.label_data_type_man'), value: 1 }]}
                    onPress={(value) => onChange(value === 0 ? 0 : 1)} />
                <Text style={styles.modeSelectorLabel}>{t('screens.setup_device_data.message_auto_configuration')}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

export const isConfigurable = (config: DeviceConfig, isLoading = false) => {
    if (isLoading) return false;
    if (config.auto_man === 0) return true;
    if (!config.man_APN || !isASCII(config.man_APN, false)) return false;
    if (!!config.man_USER && !isASCII(config.man_USER, false)) return false;
    if (!!config.man_CONTRASEN && !isASCII(config.man_CONTRASEN, false)) return false;
    return true;
};
export const isValidResponse = (state: ResponseState, device: DeviceConfig) => {
    if (!state) return false;
    if (!state.response) return false;
    if (state.response.status !== 200) return false;
    if (state.response.body.auto_man !== device.auto_man) return false;
    if (state.response.body.auto_man === 1 && state.response.body.man_APN !== device.man_APN) return false;
    return true;
};
export type ConfigViewProps = {
    device: DeviceConfig;
    updateDevice: (device: DeviceConfig) => void;
    setNewConfig: (device: DeviceConfig | null) => void;
    closeConnection: () => void;
};
export const ConfigView: React.FC<ConfigViewProps> = ({ device, updateDevice, setNewConfig, closeConnection }) => {
    const { t } = useLocale();
    const styles = useStyles();
    const { request, state } = useUpdateConfig();
    const newConfig = state.response?.body;
    const saveConfiguration = React.useCallback(() => {
        request(device.auto_man === 0 ? generate4GAutoBody() : generate4GManualBody(device.man_APN, device.man_USER, device.man_CONTRASEN));
    }, [device]);
    React.useEffect(() => {
        if (isValidResponse(state, device) && !!newConfig && !state.isLoading && !state.error) {
            setNewConfig(newConfig);
        }
        else {
            setNewConfig(null);
        }
    }, [state]);
    if (device.estado_SIM !== 1 && device.estado_SIM !== 7 && device.estado_PIN !== 2) return null;
    if (!!state.error) {
        return (
            <ErrorView
                error={!!state.error}
                close={closeConnection} />
        );
    }
    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={state.isLoading ? styles.configLabelDisabled : styles.configLabel}>{t('screens.setup_device_data.message_new_configuration')}</Text>
                <ConfigTypeView
                    isLoading={state.isLoading}
                    type={device.auto_man}
                    onChange={(type: 0 | 1) => updateDevice({ ...device, auto_man: type })} />
                <ConfigAPNView
                    device={device}
                    onChange={(apn) => updateDevice({ ...device, ...apn })}
                />
                <Button
                    mode='contained'
                    color={Theme.colors.ctiGreen}
                    style={styles.button}
                    disabled={!isConfigurable(device, state.isLoading)}
                    onPress={saveConfiguration}>
                    {t('screens.setup_device_data.button_save_configuration')}
                </Button>
                <ErrorIndicator
                    show={!!newConfig && !isValidResponse(state, device)}
                    message={t('screens.setup_device_data.message_saving_fails')} />
            </ScrollView>
            <SavingIndicator
                show={state.isLoading}
                message={t('screens.setup_device_data.message_saving')} />
        </>
    );
};

type Props = StackScreenProps<RootStakParams, typeof SETUP_DEVICE_DATA_SCREEN>;
const SetupDeviceDataScreen: React.FC<Props> = ({ navigation, route }) => {
    const currentDeviceConfig = route.params.device;
    const configurationName = route.params.configName;
    const styles = useStyles();
    const [config, setConfig] = React.useState(currentDeviceConfig);
    const [newConfig, setNewConfig] = React.useState<DeviceConfig | null>(null);
    React.useEffect(() => {
        if (!!newConfig) navigation.replace(VALIDATE_CONFIGURATION_SCREEN, { device: newConfig, configName: configurationName });
    }, [newConfig]);
    return (
        <>
            <NoSIMView
                device={config}
                updateDevice={setConfig}
                closeScreen={() => navigation.pop()}
                closeConnection={() => navigation.replace(DISCONNECT_SCREEN)} />
            <PinView
                device={config}
                updateDevice={setConfig}
                closeScreen={() => navigation.pop()}
                closeConnection={() => navigation.replace(DISCONNECT_SCREEN)} />
            <ConfigView
                device={config}
                updateDevice={setConfig}
                setNewConfig={setNewConfig}
                closeConnection={() => navigation.replace(DISCONNECT_SCREEN)}
            />
        </>
    );
};

export default SetupDeviceDataScreen;