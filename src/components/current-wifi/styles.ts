import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();

    return StyleSheet.create({
        container: {
            padding: 4,
            // antes: theme.colors.disabled
            backgroundColor: theme.colors.surfaceDisabled,
        },
        label: {
            // antes: theme.colors.text
            color: theme.colors.onSurface,
            textAlign: 'center',
        },
    });
};

export default useStyles;
