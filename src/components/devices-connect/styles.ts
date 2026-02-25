import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingBottom: 10,
    },

    setupContainer: {
      flex: 1,
      margin: 16,
      alignItems: 'center',
    },

    setupDevice: {
      padding: 12,
      fontSize: 24,
      color: theme.colors.ctiGreen,
      textAlign: 'center',
    },

    setupDeviceSubtext: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 18,
    },

    setupDeviceInfo: {
      padding: 12,
      fontSize: 18,
      margin: 12,
      color: theme.colors.text,
      textAlign: 'center',
      backgroundColor: theme.colors.ctiBlueGrey,
    },

    // ✅ NUEVO: envoltorio para alinear icono + texto como Android
    searchWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },

    // ✅ Esto evita que Paper recorte el icono en iOS
    searchIconBtn: {
      width: 220,
      height: 220,
      borderRadius: 110,
      overflow: 'visible',  // ✅ importante en iOS
      padding: 0,
      margin: 0,
    },

    // ✅ La imagen debe ser un poco más pequeña que el contenedor
    searchButton: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },

    buttonLabel: {
      marginTop: 14,
      fontSize: 18,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });
};

export default useStyles;