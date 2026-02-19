import * as React from 'react';
import {
    Appbar,
    Menu,
    Text
} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, StackHeaderProps} from '@react-navigation/stack';
import {useLocale} from '../locales';

// Screens
import {
    FIND_DEVICES_SCREEN,
    SETUP_DEVICE_SCREEN,
    SETUP_DEVICE_WIFI_SCREEN,
    SETUP_DEVICE_DATA_SCREEN,
    VALIDATE_CONFIGURATION_SCREEN,
    CONFIGURED_DEVICES_SCREEN,
    LANGUAGES_SCREEN,
    CHANGE_DEVICE_PASSWORD_SCREEN,
    RESET_DEVICE_SCREEN,
    DISCONNECT_SCREEN,
    WIFI_CREDENTIALS_SCREEN,
    XIAOMI_PERMISSIONS_SCREEN,
    RootStakParams, CONFIGURATION_TYPE_SELECTOR_SCREEN
} from './constants';

import FindDevicesScreen from './find-devices-screen';
import SetupDeviceScreen from './setup-device-screen';
import SetupDeviceWifiScreen from './setup-device-wifi-screen';
import SetupDeviceDataScreen from './setup-device-data-screen';
import ValidateConfigurationScreen from './validate-configuration-screen';
import ConfiguredDevicesScreen from './configured-devices-screen';
import LanguagesScreen from './languages-screen';
import ChangeDevicePasswordScreen from './change-device-password-screen';
import ResetDeviceScreen from './reset-device-screen';
import DisconnectScreen from './disconnect-screen';
import WifiCredentialsScreen from './wifi-credentials-screen';
import ConfigurationTypeSelectorScreen from './configuration-type-selector-screen';
import XiaomiPermissionsScreen from './xiaomi-permissions-screen';


// Navigation flow
const RootStack = createStackNavigator<RootStakParams>();

const BackButton: React.FC<{show: boolean; action: () => void}> = ({show, action}) => {
    if (!show) return null;
    return (
        <Appbar.BackAction
          onPress={action}
          color='white'/>
    );
};
const MainHeader: React.FC<StackHeaderProps> = ({scene, previous, navigation}) => {
    const title = scene.descriptor.options.title || 'CTI Setup';
    return (
        <Appbar.Header>
            <BackButton show={!!previous} action={() => navigation.pop()}/>
            <Appbar.Content
                title={title}/>
        </Appbar.Header>
    );
};

const FindHeader: React.FC<StackHeaderProps> = ({scene, navigation}) => {
    const title = scene.descriptor.options.title || 'CTI Setup';
    const {t} = useLocale();
    const [isMenuOpen, setMenuOpen] = React.useState(false);
    return (
        <Appbar.Header>
            <Appbar.Content
                title={title}/>
            <Menu
                onDismiss={() => setMenuOpen(false)}
                visible={isMenuOpen}
                anchor={
                    <Appbar.Action
                        icon='dots-vertical'
                        color='white'
                        onPress={() => setMenuOpen(true)}/>
                }>
                <Menu.Item
                    title={<Text style={{color: '#152A88'}}>{t('screens.find_devices.button_to_configured_devices')}</Text>}
                    onPress={() => {
                        navigation.navigate(CONFIGURED_DEVICES_SCREEN);
                        setMenuOpen(false);
                    }}/>
                <Menu.Item
                    title={<Text style={{color: '#152A88'}}>{t('screens.find_devices.button_to_change_language')}</Text>}
                    onPress={() => {
                        navigation.navigate(LANGUAGES_SCREEN);
                        setMenuOpen(false);
                    }}/>
            </Menu>
        </Appbar.Header>
    );
};

const NoReturnHeader: React.FC<StackHeaderProps> = ({scene, previous, navigation}) => {
    const title = scene.descriptor.options.title || 'CTI Setup';
    return (
        <Appbar.Header>
            <Appbar.Content
                title={title}/>
        </Appbar.Header>
    );
};

const RootContainer: React.FC<{}> = () => {
    const {t} = useLocale();
    return (
        <NavigationContainer>
            <RootStack.Navigator
                headerMode='screen'
                screenOptions={{
                    header: MainHeader
                }}
                initialRouteName={FIND_DEVICES_SCREEN}>
                <RootStack.Screen name={FIND_DEVICES_SCREEN} component={FindDevicesScreen} options={{title: t('screens.find_devices.title'), header: FindHeader}}/>
                <RootStack.Screen name={SETUP_DEVICE_SCREEN} component={SetupDeviceScreen} options={{title: t('screens.setup_device.title')}}/>
                <RootStack.Screen name={SETUP_DEVICE_WIFI_SCREEN} component={SetupDeviceWifiScreen} options={{title: t('screens.setup_device_wifi.title')}}/>
                <RootStack.Screen name={SETUP_DEVICE_DATA_SCREEN} component={SetupDeviceDataScreen} options={{title: t('screens.setup_device_data.title')}}/>
                <RootStack.Screen name={VALIDATE_CONFIGURATION_SCREEN} component={ValidateConfigurationScreen} options={{title: t('screens.validate_configuration.title'), header: NoReturnHeader}}/>
                <RootStack.Screen name={CONFIGURED_DEVICES_SCREEN} component={ConfiguredDevicesScreen} options={{title: t('screens.configured_devices.title')}}/>
                <RootStack.Screen name={LANGUAGES_SCREEN} component={LanguagesScreen} options={{title: t('screens.languages.title')}}/>
                <RootStack.Screen name={CHANGE_DEVICE_PASSWORD_SCREEN} component={ChangeDevicePasswordScreen} options={{title: t('screens.change_device_password.title')}}/>
                <RootStack.Screen name={RESET_DEVICE_SCREEN} component={ResetDeviceScreen} options={{title: t('screens.reset_device.title')}}/>
                <RootStack.Screen name={DISCONNECT_SCREEN} component={DisconnectScreen} options={{title: t('screens.disconnect.title'), header: NoReturnHeader}}/>
                <RootStack.Screen name={WIFI_CREDENTIALS_SCREEN} component={WifiCredentialsScreen} options={{title: t('screens.wifi_credentials.title')}}/>
                <RootStack.Screen name={CONFIGURATION_TYPE_SELECTOR_SCREEN} component={ConfigurationTypeSelectorScreen} options={{title: t('screens.configuration_type_selector.title')}}/>
                <RootStack.Screen name={XIAOMI_PERMISSIONS_SCREEN} component={XiaomiPermissionsScreen} options={{title: t('screens.xiaomi_perm.title')}}/>
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default RootContainer;
