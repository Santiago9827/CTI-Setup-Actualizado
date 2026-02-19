// import { DeviceConfig } from 'src/utils/device-api';
// import { WifiSelected, WifiStatus } from 'src/utils/wifi';

import { DeviceConfig } from "../utils/device-api";
import { WifiSelected, WifiStatus } from "../utils/wifi";

export const FIND_DEVICES_SCREEN = 'FindDevicesScreen';
export const CONFIGURED_DEVICES_SCREEN = 'ConfiguredDevicesScreen';
export const SETUP_DEVICE_SCREEN = 'SetupDeviceScreen';
export const SETUP_DEVICE_WIFI_SCREEN = 'SetupDeviceWifiScreen';
export const SETUP_DEVICE_DATA_SCREEN = 'SetupDeviceDataScreen';
export const VALIDATE_CONFIGURATION_SCREEN = 'ValidateConfigurationScreen';
export const LANGUAGES_SCREEN = 'LanguagesScreen';
export const RESET_DEVICE_SCREEN = 'ResetDeviceScreen';
export const CHANGE_DEVICE_PASSWORD_SCREEN = 'ChangeDevicePasswordScreen';
export const DISCONNECT_SCREEN = 'DisconnectScreen';
export const WIFI_CREDENTIALS_SCREEN = 'WifiCredentialsScreen';
export const CONFIGURATION_TYPE_SELECTOR_SCREEN = 'ConfigurationTypeSelector';

export const XIAOMI_PERMISSIONS_SCREEN = 'XiaomiPermissions';

export type RootStakParams = {
    FindDevicesScreen: undefined;
    ConfiguredDevicesScreen: undefined;
    SetupDeviceScreen: { wifi: WifiStatus, password: string };
    SetupDeviceWifiScreen: { device: DeviceConfig, configName: string };
    SetupDeviceDataScreen: { device: DeviceConfig, configName: string };
    ValidateConfigurationScreen: { device: DeviceConfig, configName: string };
    LanguagesScreen: undefined;
    ResetDeviceScreen: undefined;
    ChangeDevicePasswordScreen: undefined;
    DisconnectScreen: undefined;
    WifiCredentialsScreen: WifiSelected;
    ConfigurationTypeSelector: DeviceConfig;
    XiaomiPermissions: undefined;
};