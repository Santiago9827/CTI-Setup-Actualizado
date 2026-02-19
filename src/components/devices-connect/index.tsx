import * as React from 'react';
import {
    View,
    Text
} from 'react-native';
import { WifiSelected } from '../../utils/wifi';
// import { WifiSelected } from 'src/utils/wifi';

export type DevicesConnectProps = {
    onConnection: (device: WifiSelected) => void;
};
export const DevicesConnect: React.FC<DevicesConnectProps> = ({ onConnection }) => {
    return (
        <View>
            <Text>IOS version</Text>
        </View>
    );
};

export default DevicesConnect;