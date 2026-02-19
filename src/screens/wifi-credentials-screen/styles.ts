import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            flexGrow: 1,
            backgroundColor: theme.colors.background
        },
        body: {},
        connectBody: {
            alignItems: 'center'
        },
        connectTitle: {
            padding: 16,
            fontSize: 22,
            color: theme.colors.ctiGreen,
            textAlign: 'center',
        },
        connectingBodyTitle: {
            marginTop: 18,
            color: theme.colors.text,
            fontSize: 18
        },
        inputContainer: {
            marginLeft: 48,
            marginRight: 48,
            marginTop: 36,
            marginBottom: 6,
            flexDirection: 'row',
            alignItems: 'center'
        },
        inputPassword: {
            color: theme.colors.ctiGreen,
            flex: 1,
            fontSize: 16
        },
        errorMessage: {
            marginLeft: 48,
            marginRight: 48,
            marginBottom: 36,
        },
        errorMessageText: {
            color: theme.colors.error
        },
        button: {
            margin: 16
        },
        buttonText: {
            color: theme.colors.primary,
            fontSize: 18
        },
        buttons: {
            flexDirection: 'row',
            marginLeft: 48,
            marginRight: 48
        },
        cancelButton: {
            flex: 1,
            marginRight: 10
        },
        connectButton: {
            flex: 1,
            marginLeft: 10
        }
    });
};

export default useStyles;