import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

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
            color: theme.colors.ctiGreen
        },
        body: {
            flex: 1,
            alignItems: 'center'
        },
        bodyGuide: {
            alignItems: 'center',
            padding: 6,
            marginLeft: 32,
            marginRight: 32,
            backgroundColor: theme.colors.ctiBlueGrey
        },
        message: {
            flexDirection: 'row',
            padding: 4
        },
        messageNumber: {
            fontSize: 28,
            margin: 8,
            textAlign: 'center'
        },
        messageText: {
            flex: 1,
            fontSize: 16,
            textAlignVertical: 'center'
        },
        messageCheck: {
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        button: {
            margin: 16
        }
    });
};

export default useStyles;