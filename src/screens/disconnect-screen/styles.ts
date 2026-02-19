import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        title: {
            margin: 24,
            padding: 6,
            fontSize: 22,
            textAlign: 'center',
            color: theme.colors.primary
        },
        body: {
            flex: 1,
            alignItems: 'center'
        },
        loadingBody: {
            flex: 1,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center'
        },
        loadingText: {
            padding: 16,
            fontSize: 22,
            textAlign: 'center'
        },
        messageText: {
            margin: 24,
            padding: 6,
            fontSize: 18,
            textAlign: 'center'
        },
        button: {
            margin: 16
        },
        dlgImage: {
            height: 200,
            width: 200
        }
    });
};

export default useStyles;