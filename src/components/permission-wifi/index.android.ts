import * as React from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { useLocale } from '../../locales';
import {
    useUpdateAppConfigWifi,
    useAppConfig
} from '../use-configuration';
const EmptyFn = () => { };
export type WifiPermissionProps = {
    setPermissionState?: (granted: boolean) => void;
    reload?: number
};
export const PermissionWifi: React.FC<WifiPermissionProps> = ({ setPermissionState = EmptyFn, reload = 0 }) => {
    const { t } = useLocale();
    const config = useAppConfig();
    const updateWifi = useUpdateAppConfigWifi();
    // const PERM_NEARBY_WIFI = "android.permission.NEARBY_WIFI_DEVICES";

    React.useEffect(() => {
        let cancelado = false;

        const pedirPermisosWifi = async () => {
            try {
                if (Platform.OS !== "android") {
                    if (!cancelado) {
                        updateWifi(true);
                        setPermissionState(true);
                    }
                    return;
                }

                const PERM_NEARBY_WIFI = "android.permission.NEARBY_WIFI_DEVICES";

                // Pedimos ambos (aunque NEARBY solo aplica 33+)
                const res = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PERM_NEARBY_WIFI as any, // RN 0.63 no lo conoce en tipos
                ]);

                const okFine =
                    res[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
                    PermissionsAndroid.RESULTS.GRANTED;

                const okNearby =
                    Number(Platform.Version) >= 33
                        ? (res as any)[PERM_NEARBY_WIFI] === PermissionsAndroid.RESULTS.GRANTED
                        : true;

                const ok = okFine && okNearby;

                if (!cancelado) {
                    updateWifi(ok);
                    setPermissionState(ok);
                }
            } catch (e) {
                if (!cancelado) {
                    updateWifi(false);
                    setPermissionState(false);
                }
            }
        };

        pedirPermisosWifi();

        return () => {
            cancelado = true;
        };
    }, [config.lastSettingModifications, updateWifi, setPermissionState]);


    return null;
};

export default PermissionWifi;

// import * as React from "react";
// import { PermissionsAndroid, Platform } from "react-native";
// import { useLocale } from "../../locales";
// import { useUpdateAppConfigWifi, useAppConfig } from "../use-configuration";

// const PERM_NEARBY_WIFI = "android.permission.NEARBY_WIFI_DEVICES";

// export const PermissionWifi: React.FC<{
//     setPermissionState?: (granted: boolean) => void;
//     reload?: number;
// }> = ({ setPermissionState = () => { } }) => {
//     const { t } = useLocale();
//     const config = useAppConfig();
//     const updateWifi = useUpdateAppConfigWifi();

//     React.useEffect(() => {
//         const pedir = async () => {
//             try {
//                 if (Platform.OS !== "android") return;

//                 const permisos =
//                     Number(Platform.Version) >= 33
//      //                   ? [PERM_NEARBY_WIFI, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]
//                         : [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

//                 const res = await PermissionsAndroid.requestMultiple(permisos as any);

//                 const resAny = res as Record<string, string>;

//                 const ok = permisos.every(
//                     (p) => resAny[p] === PermissionsAndroid.RESULTS.GRANTED
//                 );

//                 updateWifi(ok);
//                 setPermissionState(ok);
//             } catch {
//                 updateWifi(false);
//                 setPermissionState(false);
//             }
//         };

//         pedir();
//     }, [config.lastSettingModifications]);

//     return null;
// };

// export default PermissionWifi;
