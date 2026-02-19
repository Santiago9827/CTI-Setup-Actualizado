import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingBottom: 10
        },
        nowifiTitle: {
            padding: 16,
            textAlign: 'center',
            fontSize: 20
        },
        nowifiBody: {
            flex: 1,
            margin: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        loadingBody: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        nowifiBodyTitle: {
            padding: 16,
            fontSize: 22,
            textAlign: 'center',
        },
        connectingBodyTitle: {
            marginTop: 18,
            color: theme.colors.text,
            fontSize: 18
        },
        setupContainer: {
            flex: 1,
            margin: 16,
            alignItems: 'center'
        },
        setupDevice: {
            padding: 12,
            fontSize: 24,
            color: theme.colors.ctiGreen,
            textAlign: 'center',
        },
        setupDeviceSubtext: {
            fontSize: 16,
            color: theme.colors.text,
            textAlign: 'center',
        },
        setupDeviceInfo: {
            padding: 12,
            fontSize: 18,
            margin: 12,
            color: theme.colors.text,
            textAlign: 'center',
            backgroundColor: theme.colors.ctiBlueGrey
        },
        connectCard: {
            margin: 16
        },
        connectTitle: {
            color: theme.colors.primary
        },
        inputPassword: {
            backgroundColor: 'white',
            color: 'black',
            fontSize: 22
        },
        errorMessage: {
            marginStart: 24,
            marginEnd: 24,
            padding: 6,
            backgroundColor: theme.colors.error
        },
        errorMessageText: {},
        buttonText: {
            color: theme.colors.primary,
            fontSize: 18
        },
        bodyListDevice: {
        },
        bodyListDeviceRow: {
            flex: 1,
            marginLeft: 12,
            flexDirection: 'row',
            alignItems: 'center'
        },
        bodyListDeviceItem: {
            flex: 1,
            marginLeft: 32,
            marginTop: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.ctiGreen,
        },
        bodyListDeviceItemText: {
            fontSize: 20,
            fontWeight: '700',
            marginBottom: 16,
        },
        searchButton: {
            width: 200,
            height: 200
        },
        buttonSearch: {
            margin: 32,
            width: 200,
            height: 200
        },
        button: {
            margin: 16
        },
        buttonLabel: {
            marginTop: 8,
            fontSize: 16,
            color: theme.colors.text,
            textAlign: 'center',
        }

    });
};

export default useStyles;