import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        loadingBody: {
            alignItems: 'center'
        },
        loadingBodyTitle: {
            marginTop: 28,
            padding: 16,
            fontSize: 22,
            color: theme.colors.primary,
            textAlign: 'center',
        }
    });
};

export default useStyles;