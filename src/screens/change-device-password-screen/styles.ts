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
            color: theme.colors.primary,
            padding: 16
        },
        inputsContainer: {
            flex: 1
        },
        message: {
            padding: 16,
            textAlign: 'center'
        },
        inputContainer: {
            marginTop: 16,
            marginLeft: 64,
            marginRight: 64,
            flexDirection: 'row',
            alignItems: 'center'
        },
        inputPassword: {
            color: theme.colors.primary,
            flex: 1,
            fontSize: 16
        },
        errorView: {
            marginLeft: 64,
            marginRight: 64
        },
        errorText: {
            color: theme.colors.error
        },
        buttons: {
            flexDirection: 'row'
        },
        button: {
            flex: 1,
            margin: 16
        },
        containerSaved: {
            flex: 1,
            margin: 16
        },
        containerSavedMessage: {
            flex: 1
        },
        savedLabel: {
            fontSize: 22,
            color: theme.colors.primary
        },
        savedMessage: {
            margin: 16
        },
        savedButton: {
            margin: 16
        }
    });
};

export default useStyles;