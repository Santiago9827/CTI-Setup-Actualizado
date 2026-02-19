import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

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
        title: {
            margin: 24,
            padding: 6,
            fontSize: 22,
            textAlign: 'center'
        },
        body: {
            flex: 1,
            alignItems: 'center'
        },
        loadingBody: {
            marginTop: 64,
            padding: 16,
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
        buttons: {
            flexDirection: 'row',
        },
        buttonReset: {
            margin: 16,
            flex: 1
        },
        buttonCancel: {
            margin: 16,
            flex: 1,
            color: theme.colors.error
        },
        button: {
            margin: 16,
        },
        resetImage: {
            height: 200,
            width: 200
        }
    });
};

export default useStyles;