import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        message: {
            padding: 16,
            fontSize: 22,
            color: theme.colors.ctiGreen
        },
        body: {
            flex: 1
        },
        bodyTitle: {
            marginTop: 18,
            padding: 8,
            color: theme.colors.text,
            fontSize: 22,
            textAlign: 'center'
        },
        langs: {
            justifyContent: 'flex-start',
            padding: 12
        },
        langRow: {
            marginTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 10,
            borderBottomColor: theme.colors.ctiGreen,
            borderBottomWidth: 1,
        },
        flagView: {
            padding: 8
        },
        langTextsBlock: {
            flex: 1,
            margin: 4
        },
        langText: {
            flex: 1,
            fontSize: 18,
            marginBottom: 2,
            paddingLeft: 18
        },
        langIdText: {
            flex: 1,
            paddingLeft: 18,
            color: theme.colors.ctiGreen,
            justifyContent: 'flex-end',
            marginBottom: -5
        },
        langFlag: {
            width: 42,
            height: 42
        },
        langSelected: {},
        button: {
            margin: 16
        }
    });
};

export default useStyles;