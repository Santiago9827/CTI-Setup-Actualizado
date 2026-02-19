import * as React from 'react';
import {useUpdateAppConfigWifi} from '../use-configuration';

export type WifiPermissionProps = {
    setPermissionState?: (granted: boolean) => void;
    reload?: number
};
export const PermissionWifi: React.FC<WifiPermissionProps> = ({setPermissionState = () => {}}) => {
    const updateWifi = useUpdateAppConfigWifi();
    React.useEffect(() => {
        updateWifi(true);
        setPermissionState(true);
    }, []);
    return null;
};

export default PermissionWifi;