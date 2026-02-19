import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

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
        block: {
            margin: 6
        },
        title: {
            fontSize: 22,
            color: theme.colors.ctiGreen,
            paddingBottom: 6
        },
        errorBody: {
            padding: 16,
            margin: 16,
            alignItems: 'center',
            backgroundColor: theme.colors.ctiBlueGrey,
            borderWidth: 1,
            borderRadius: 12,
        },
        errorBodyTitle: {
            marginTop: 8,
            padding: 16,
            fontSize: 22,
            textAlign: 'center',
        },
        separator: {
            padding: 6,
            backgroundColor: theme.colors.ctiGrey,
            marginBottom: 6
        },
        separatorLabel: {
            color: theme.colors.primary,
            fontWeight: '700'
        },
        label: {
            marginTop: 6,
            marginBottom: 6
        },
        info: {
            borderBottomColor: theme.colors.ctiGreen,
            borderBottomWidth: 1
        },
        labelInfo: {
            color: theme.colors.ctiGreen,
            paddingBottom: 6
        },
        button: {
            margin: 14,
            padding: 6
        },
        buttonClose: {
            margin: 20,
            padding: 6
        }
    });
};

export default useStyles;