import * as React from 'react';
export type WifiPermissionProps = {
    setPermissionState?: (granted: boolean) => void;
    reload?: number
};
export const PermissionWifi: React.FC<WifiPermissionProps> = () => {
    return null;
};

export default PermissionWifi;