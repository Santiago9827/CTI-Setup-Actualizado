import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        message: {
            padding: 16,
            fontSize: 22,
            color: theme.colors.primary,
        },
        deviceList: {
            flex: 1
        },
        cardDevice: {
            margin: 8
        },
        cardDeviceLabel: {
            flexDirection: 'row',
            alignItems: 'flex-end'
        },
        cardDeviceLabelText: {
            width: 100,
            textAlign: 'right',
            color: theme.colors.primary
        },
        cardDeviceValue: {
            fontSize: 20,
            fontWeight: '900',
            color: theme.colors.primary
        },
        cardDeviceDate: {
            flex: 1,
            marginTop: 8,
            textAlign: 'center',
            color: theme.colors.primary,
            marginBottom: 4
        },
        loadingBody: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        bodyTitle: {
            marginTop: 18,
            color: theme.colors.onBackground,
            fontSize: 22,
            textAlign: 'center',
            marginBottom: 16
        },
        button: {
            margin: 16
        }
    });
};

export default useStyles;