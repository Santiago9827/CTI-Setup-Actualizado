import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        body: {
            flex: 1
        },
        permTitle: {
            padding: 16,
            textAlign: 'center',
            fontSize: 20,
            color: theme.colors.text
        },
        permBody: {
            margin: 16,
            alignItems: 'center',
            color: theme.colors.text
        },
        permBodyTitle: {
            padding: 16,
            textAlign: 'center',
            color: theme.colors.text
        },
        welcomeTitle: {
            padding: 16,
            textAlign: 'center',
            fontSize: 20,
            color: theme.colors.text
        },
        bottom: {
            margin: 16
        }
    });
};

export default useStyles;