import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        label: {
            fontSize: 22,
            color: theme.colors.ctiGreen,
            margin: 16
        },
        labelDisabled: {
            fontSize: 22,
            color: theme.colors.ctiBlueGrey,
            margin: 16
        },
        message: {
            margin: 16,
            padding: 4,
            color: 'white',
        },
        inputContainer: {
            marginLeft: 64,
            marginRight: 64,
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
            marginLeft: 64,
            marginRight: 64,
            marginBottom: 36,
        },
        errorMessageText: {
            color: theme.colors.error
        },
        button: {
            margin: 16,
            padding: 4
        },
        buttonText: {
            color: 'white',
            fontSize: 18
        }
    });
};

export default useStyles;