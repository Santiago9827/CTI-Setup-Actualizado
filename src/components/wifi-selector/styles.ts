import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 24
        },
        inputContainer: {
            marginLeft: 64,
            marginRight: 64,
            flexDirection: 'row',
            alignItems: 'center'
        },
        inputPassword: {
            color: 'white',
            flex: 1,
            fontSize: 16
        },
        errorMessage: {
            marginLeft: 64,
            marginRight: 64,
            marginBottom: 16,
        },
        errorMessageText: {
            color: theme.colors.error
        },
        buttonMoreWifis: {
            marginLeft: 64,
            marginRight: 64,
            marginBottom: 16,

        },
        buttonMoreWifisText: {
            color: theme.colors.primary
        }
    });
};

export default useStyles;