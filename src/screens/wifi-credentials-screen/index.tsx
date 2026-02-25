import * as React from 'react';
import {
  View,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Button,
} from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import {
  WIFI_CREDENTIALS_SCREEN,
  SETUP_DEVICE_SCREEN,
  RootStakParams
} from '../constants';
import { useLocale } from '../../locales';
import {
  CTI_PREFIX,
  connectWithWiFi,
  disconnectFromWifi,
  getSSID, // ✅ asegúrate de exportarlo desde utils/wifi
} from '../../utils/wifi';
import {
  useAppConfig,
  useUpdateAppConfigWifiDetected
} from '../../components/use-configuration';
import { useStyles } from './styles';
import LoadingView from '../../components/loading-view';
import Theme from '../../theme';

const DeviceImg = require('../../images/dlg.png');

type Props = StackScreenProps<RootStakParams, typeof WIFI_CREDENTIALS_SCREEN>;

export const WifiCredentialsScreen: React.FC<Props> = ({ navigation, route }) => {
  const wifi = route.params; // iOS normalmente { SSID: "CTINET" } (prefijo)
  const config = useAppConfig();
  const updateWifiDetected = useUpdateAppConfigWifiDetected();
  const { t } = useLocale();
  const styles = useStyles();

  const [passwd, setPasswd] = React.useState('');
  const [showPasswd, setShowPasswd] = React.useState(false);
  const [error, setError] = React.useState('');
  const [connecting, setConnecting] = React.useState(false);

  // ✅ iOS: SSID exacto opcional (CTINET_XXXX). Si hay 2 redes, aquí fuerzas la correcta.
  const [ssidExacto, setSsidExacto] = React.useState('');

  const changePassword = React.useCallback((text: string) => {
    setError('');
    setPasswd(text);
  }, []);

  // ✅ iOS: esperar a que el SSID se actualice (a veces tarda)
  const esperarSSID = React.useCallback(async (timeoutMs = 20000) => {
    const inicio = Date.now();
    while (Date.now() - inicio < timeoutMs) {
      try {
        const ssid = await getSSID();
        if (ssid && !String(ssid).startsWith('<unknown') && ssid.startsWith(CTI_PREFIX)) {
          return ssid;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 700));
    }
    return null;
  }, []);

  const connect = React.useCallback(async () => {
    setConnecting(true);
    setError('');

    // Guardar wifi anterior (para volver luego)
    if (config.wifiConnection?.SSID && !config.wifiConnection.SSID.startsWith(CTI_PREFIX)) {
      updateWifiDetected(config.wifiConnection.SSID);
    }

    // ✅ Objetivo:
    // - iOS: si el usuario escribe CTINET_XXXX, usar eso (mejor).
    // - si no, usar lo que venga (probablemente "CTINET" prefijo).
    const objetivo =
      Platform.OS === 'ios' && ssidExacto.trim()
        ? ssidExacto.trim()
        : wifi.SSID;

    try {
      // 1) Conectar (puede devolver SSID viejo o <unknown> aunque haya conectado)
      const connected = await connectWithWiFi(objetivo, passwd);

      // 2) Validar SSID con reintentos (iOS tarda)
      let ssidFinal: string | null = null;

      if (
        connected?.ssid &&
        connected.ssid.startsWith(CTI_PREFIX) &&
        !String(connected.ssid).startsWith('<unknown')
      ) {
        ssidFinal = connected.ssid;
      } else {
        ssidFinal = await esperarSSID(20000);
      }

      // 3) Si iOS no puede leer SSID pero el objetivo era exacto, seguimos igualmente
      const objetivoEsExacto = objetivo.startsWith(CTI_PREFIX) && objetivo !== CTI_PREFIX;

      if (!ssidFinal && Platform.OS === 'ios' && objetivoEsExacto) {
        ssidFinal = objetivo;
      }

      if (ssidFinal && ssidFinal.startsWith(CTI_PREFIX)) {
        navigation.replace(SETUP_DEVICE_SCREEN, { wifi: { ssid: ssidFinal }, password: passwd });
      } else {
        // En iOS esto suele ser permisos/lectura SSID, no contraseña
        setError(
          Platform.OS === 'ios'
            ? 'No puedo confirmar el SSID. Revisa: Access WiFi Information + Ubicación (Mientras se usa). Si hay 2 redes CTINET, escribe el SSID exacto.'
            : t('screens.wifi_credentials.error_connecting')
        );
      }
    } catch (e: any) {
      console.log('connectWithWiFi ERROR:', e?.message ?? e);
      await disconnectFromWifi(objetivo);
      setError(t('screens.wifi_credentials.error_connecting'));
    }

    setConnecting(false);
  }, [passwd, ssidExacto, wifi.SSID, config.wifiConnection?.SSID, updateWifiDetected, navigation, t, esperarSSID]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView style={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          <View style={styles.connectBody}>
            <Text style={styles.connectTitle}>
              {t('screens.wifi_credentials.message') + wifi.SSID}
            </Text>
            <Image source={DeviceImg} height={180} width={180} style={{ width: 180, height: 180 }} />
          </View>

          {/* ✅ iOS: SSID exacto (opcional pero recomendado si hay 2 CTINET) */}
         {/*  {Platform.OS === 'ios' && (
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="SSID exacto del equipo (recomendado)"
                placeholder="Ej: CTINET_ACS_261"
                value={ssidExacto}
                onChangeText={(v) => { setError(''); setSsidExacto(v); }}
                autoCapitalize="none"
                textColor="white"
                placeholderTextColor="rgba(255,255,255,0.55)"
                outlineColor="rgba(255,255,255,0.35)"
                activeOutlineColor={Theme.colors.ctiGreen}
                theme={{ colors: { onSurface: "white", onSurfaceVariant: "white" } }}
              />

              <Button
                mode="text"
                onPress={() => Linking.openSettings()}
                textColor={Theme.colors.ctiGreen}
              >
                Ver Wi-Fi en Ajustes
              </Button>

              <Text style={{ marginTop: 6, opacity: 0.8 }}>
                Si lo dejas vacío, iOS intentará conectar por prefijo "{CTI_PREFIX}" (puede fallar si hay dos redes).
              </Text>
            </View>
          )} */}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputPassword}
              mode="outlined"
              label={t('screens.wifi_credentials.input_label_password')}
              placeholder={t('screens.wifi_credentials.input_hint_password')}
              value={passwd}
              onChangeText={changePassword}
              secureTextEntry={!showPasswd}
              autoCapitalize="none"
              clearTextOnFocus
              keyboardType="numeric"
              maxLength={8}
              error={!!error}
              textColor="white"
              placeholderTextColor="rgba(255,255,255,0.55)"
              outlineColor="rgba(255,255,255,0.35)"
              activeOutlineColor={Theme.colors.ctiGreen}
              theme={{
                colors: {
                  onSurface: "white",
                  onSurfaceVariant: "white",
                },
              }}
            />

            <View style={{ marginLeft: -50, marginTop: 8 }}>
              <IconButton
                icon={showPasswd ? 'eye' : 'eye-off'}
                onPress={() => setShowPasswd(show => !show)}
                iconColor={!!error ? Theme.colors.error : Theme.colors.text}
              />
            </View>
          </View>

          <View style={styles.errorMessage}>
            <Text style={styles.errorMessageText}>{error}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Button
            mode="contained"
            style={styles.cancelButton}
            contentStyle={{ height: 48 }}
            buttonColor={Theme.colors.ctiGrey}
            textColor={Theme.colors.ctiGreyDark}
            disabled={connecting}
            onPress={() => navigation.pop()}
          >
            {t('screens.wifi_credentials.button_cancel')}
          </Button>

          <Button
            mode="contained"
            style={styles.connectButton}
            contentStyle={{ height: 48 }}
            buttonColor={Theme.colors.ctiGreen}
            textColor={Theme.colors.primary}
            disabled={!passwd || passwd.length < 8 || connecting}
            onPress={connect}
          >
            {t('screens.wifi_credentials.button_connect')}
          </Button>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      <LoadingView show={connecting} size={180} />
    </KeyboardAvoidingView>
  );
};

export default WifiCredentialsScreen;