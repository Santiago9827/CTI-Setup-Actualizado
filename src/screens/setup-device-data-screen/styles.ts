import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background
        },
        pukContainer: {
            margin: 16,
            padding: 24,
            backgroundColor: theme.colors.ctiBlueGrey,
            borderWidth: 1,
            borderRadius: 12,
            alignItems: 'center'
        },
        pukLabel: {
            fontSize: 20,
            color: theme.colors.ctiGreen,
            textAlign: 'center',
            margin: 16
        },
        pukImage: {
            width: 250,
            height: 180,
            margin: 20
        },
        pukMessage: {
            textAlign: 'center',
            margin: 32
        },
        closeButton: {
            width: 250
        },
        pinContainer: {
            marginTop: 30,
            padding: 64
        },
        pinLabel: {
            fontSize: 22,
            color: theme.colors.ctiGreen,
            marginBottom: 20
        },
        pinLabelDisabled: {
            fontSize: 22,
            color: theme.colors.ctiGreyDark,
            marginBottom: 20
        },
        tryLabel: {
            marginTop: 6,
            textAlign: 'center',
            fontSize: 12,
            color: theme.colors.ctiWhite,
            marginBottom: 20
        },
        tryLabel2: {
            marginTop: 6,
            textAlign: 'center',
            fontSize: 12,
            color: theme.colors.warning,
            marginBottom: 20
        },
        tryLabel1: {
            marginTop: 6,
            textAlign: 'center',
            fontSize: 12,
            color: theme.colors.error,
            marginBottom: 20
        },
        pinInput: {
            fontSize: 24,
            textAlign: 'center'
        },
        configLabel: {
            fontSize: 20,
            color: theme.colors.ctiGreen,
            margin: 16
        },
        configLabelDisabled: {
            fontSize: 20,
            color: theme.colors.ctiBlueGrey,
            margin: 16
        },
        modeContainer: {
            margin: 16
        },
        modeSelector: {
            margin: 16
        },
        modeSelectorLabel: {
            marginLeft: 16,
            marginRight: 16
        },
        apnContainer: {
            margin: 16
        },
        apnInput: {
            backgroundColor: theme.colors.ctiBlueGrey
        },
        button: {
            margin: 16
        },
        buttonText: {
            color: theme.colors.primary, // oscuro
            fontSize: 18,
        }

    });
};

export default useStyles;