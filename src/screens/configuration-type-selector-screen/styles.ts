import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            paddingTop: 16,
            paddingLeft: 10,
            paddingRight: 10
        },
        title: {
            fontSize: 20,
            color: theme.colors.ctiGreen
        },
        body: {
            flex: 1,
            padding: 4
        },
        touchableZone: {
            margin: 16,
            padding: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 18,
            borderColor: theme.colors.ctiBlueGrey,
            backgroundColor: theme.colors.ctiBlueGrey
        },
        imageButton: {
            width: 200,
            height: 200,
        },
        dialog: {
            backgroundColor: theme.colors.ctiBlueGrey
        }
    });
};

export default useStyles;