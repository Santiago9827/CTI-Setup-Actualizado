// import * as React from 'react';

// export type WifiConnection = {
//     enabled: boolean;
//     connected: boolean;
//     SSID?: string;
// };

// export type AppConfig = {
//     wifiPermissions: boolean;
//     wifiConnection: WifiConnection;
//     wifiDetected?: string;
//     lastSettingModifications: number;
// };

// const defaultConfig: AppConfig = {
//     wifiPermissions: false,
//     wifiConnection: { enabled: false, connected: false },
//     lastSettingModifications: 0,
// };

// export const ConfigContext = React.createContext<AppConfig>(defaultConfig);

// export type updateAppConfig = React.Dispatch<React.SetStateAction<AppConfig>>;
// export const UpdateConfigContext = React.createContext<updateAppConfig>(() => { });

// export const ConfigurationContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
//     const [config, setConfig] = React.useState<AppConfig>(defaultConfig);

//     return (
//         <ConfigContext.Provider value={config}>
//             <UpdateConfigContext.Provider value={setConfig}>
//                 {children}
//             </UpdateConfigContext.Provider>
//         </ConfigContext.Provider>
//     );
// };

// export const useAppConfig = () => React.useContext(ConfigContext);
// export const useUpdateAppConfig = () => React.useContext(UpdateConfigContext);

// export const useUpdateAppConfigWifi = () => {
//     const config = useAppConfig();
//     const updateConfig = useUpdateAppConfig();
//     return (wifiEnabled: boolean) => {
//         updateConfig({ ...config, wifiPermissions: wifiEnabled });
//     };
// };

// export const useUpdateAppConfigWifiConnection = () => {
//     const config = useAppConfig();
//     const updateConfig = useUpdateAppConfig();
//     return (wifiConnection: WifiConnection) => {
//         updateConfig({ ...config, wifiConnection });
//     };
// };

// export const useUpdateAppConfigWifiDetected = () => {
//     const config = useAppConfig();
//     const updateConfig = useUpdateAppConfig();
//     return (ssid: string) => {
//         updateConfig({ ...config, wifiDetected: ssid });
//     };
// };

// export const useUpdateAppConfigForceReload = () => {
//     const config = useAppConfig();
//     const updateConfig = useUpdateAppConfig();
//     return () => {
//         updateConfig({ ...config, lastSettingModifications: Date.now() });
//     };
// };

// export default ConfigurationContextProvider;


import * as React from 'react';

export type WifiConnection = {
    enabled: boolean;
    connected: boolean;
    SSID?: string;
};

export type AppConfig = {
    wifiPermissions: boolean;
    wifiConnection: WifiConnection;
    wifiDetected?: string;
    lastSettingModifications: number;
};

const defaultConfig: AppConfig = {
    wifiPermissions: false,
    wifiConnection: { enabled: false, connected: false },
    lastSettingModifications: 0,
};

export const ConfigContext = React.createContext<AppConfig>(defaultConfig);

export type updateAppConfig = React.Dispatch<React.SetStateAction<AppConfig>>;
export const UpdateConfigContext = React.createContext<updateAppConfig>(() => { });

export const ConfigurationContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [config, setConfig] = React.useState<AppConfig>(defaultConfig);

    return (
        <ConfigContext.Provider value={config}>
            <UpdateConfigContext.Provider value={setConfig}>
                {children}
            </UpdateConfigContext.Provider>
        </ConfigContext.Provider>
    );
};

export const useAppConfig = () => React.useContext(ConfigContext);
export const useUpdateAppConfig = () => React.useContext(UpdateConfigContext);

// OJO: esto actualiza permisos (no "wifiEnabled" del adaptador)
export const useUpdateAppConfigWifi = () => {
    const updateConfig = useUpdateAppConfig();
    return (wifiPermissions: boolean) => {
        updateConfig(prev => ({ ...prev, wifiPermissions }));
    };
};

export const useUpdateAppConfigWifiConnection = () => {
    const updateConfig = useUpdateAppConfig();
    return (wifiConnection: WifiConnection) => {
        updateConfig(prev => ({
            ...prev,
            wifiConnection: {
                ...prev.wifiConnection,
                ...wifiConnection, // por si actualizas parcial
            },
        }));
    };
};

export const useUpdateAppConfigWifiDetected = () => {
    const updateConfig = useUpdateAppConfig();
    return (ssid: string) => {
        updateConfig(prev => ({ ...prev, wifiDetected: ssid }));
    };
};

export const useUpdateAppConfigForceReload = () => {
    const updateConfig = useUpdateAppConfig();
    return () => {
        updateConfig(prev => ({ ...prev, lastSettingModifications: Date.now() }));
    };
};

export default ConfigurationContextProvider;
