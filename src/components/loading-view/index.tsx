import * as React from 'react';
import {
    View,
    Text,
    useWindowDimensions
} from 'react-native';
import {
    ActivityIndicator
} from 'react-native-paper';
import Theme from '../../theme';
import {useStyles} from './styles';

export type LoadingViewProps = {
    show: boolean;
    message?: string;
    size?: number;
};
export const LoadingView: React.FC<LoadingViewProps> = ({show, size = 180, message}) => {
    const dimens = useWindowDimensions();
    const styles = useStyles();
    if (!show) return null;
    const centerX = (dimens.width / 2) - (size/2);
    const centerY = (dimens.height / 2) - size;
    return (
        <View style={{position: 'absolute',top: 0, left: 0, width: dimens.width, height: dimens.height, zIndex: 99999999999, backgroundColor: '#000000AA'}}>
            <ActivityIndicator style={{position: 'absolute', top: centerY, left: centerX}} color={Theme.colors.ctiGreen} size={size}/>
            {message && (<Text style={styles.loadingBodyTitle}>{message}</Text>)}
        </View>
    );
};

export default LoadingView;