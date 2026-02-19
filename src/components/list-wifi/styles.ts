import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const useStyles = () => {
    const theme = useTheme();

    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.surfaceVariant, // antes ctiBlueGrey
        },
        title: {
            color: theme.colors.primary, // antes ctiGreen
        },
        content: {
            maxHeight: 300,
        },
        loading: {
            flex: 1,
            justifyContent: "center",
        },
        bodyListDevice: {},
        bodyListDeviceRow: {
            flex: 1,
            marginLeft: 12,
            flexDirection: "row",
            alignItems: "center",
        },
        bodyListDeviceItem: {
            flex: 1,
            marginLeft: 32,
            marginTop: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.primary, // antes ctiGreen
        },
        bodyListDeviceItemText: {
            fontSize: 20,
            fontWeight: "700",
            marginBottom: 16,
            color: theme.colors.onSurfaceVariant, // para que se lea bien sobre surfaceVariant
        },
        button: {
            margin: 16,
        },
    });
};

export default useStyles;
