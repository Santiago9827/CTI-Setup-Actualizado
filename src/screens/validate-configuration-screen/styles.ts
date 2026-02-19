import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import { color } from 'react-native-reanimated';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 16
        },
        label: {
            fontSize: 22,
            color: theme.colors.ctiGreen
        },
        messages: {
            margin: 8
        },
        message: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
            padding: 6
        },
        icon: {
            margin: 4,
            padding: 6,
            backgroundColor: theme.colors.ctiBlueGrey,
            borderRadius: 70
        },
        position: {
            fontSize: 36,
            margin: 4
        },
        labelMessage: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        labelMessageTitle: {
            fontSize: 16,
            fontWeight: '700'
        },
        labelMessageSubtitle: {
            color: theme.colors.ctiGreen,
            padding: 8,
            textAlign: 'center',
            fontSize: 16
        },
        labelMessageSubtitleError: {
            color: theme.colors.error,
            padding: 8,
            textAlign: 'center',
            fontSize: 16
        },
        resumeContainer: {
            padding: 4,
            backgroundColor: theme.colors.ctiBlueGrey,
            marginLeft: 12,
            marginRight: 12,
            marginTop: 6
        },
        resumeItem: {
            margin: 2,
            flexDirection: 'row'
        },
        resumeLabel: {
        },
        resumeValue: {
            color: theme.colors.ctiGreen,
            flex: 1,
            textAlign: 'right'
        },
        resumeDate: {
            paddingTop: 6,
            borderTopColor: theme.colors.ctiGreen,
            borderTopWidth: 1
        },
        resumeDateText: {
            textAlign: 'center',
            color: theme.colors.ctiGreen
        },
        action: {},
        button: {
            margin: 16
        }
    });
};

export default useStyles;