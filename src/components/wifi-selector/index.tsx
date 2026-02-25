import * as React from "react";
import { View, ScrollView } from "react-native";
import { Text, TextInput, IconButton } from "react-native-paper";
import { useLocale } from "../../locales";
import { useStyles } from "./styles";
import Theme from "../../theme";

export type WifiCredentials = {
  SSID: string;
  passwd: string;
};

export type WifiSelectorProps = {
  ssid: string;
  passwd: string;
  updateSSID: (ssid: string) => void;
  updatePasswd: (passwd: string) => void;
  errorSSID?: string;
  errorPasswd?: string;
};

export const WifiSelector: React.FC<WifiSelectorProps> = ({
  ssid,
  updateSSID,
  passwd,
  updatePasswd,
  errorSSID,
  errorPasswd,
}) => {
  const { t } = useLocale();
  const styles = useStyles();
  const [showPasswd, setShowPasswd] = React.useState(false);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* SSID */}
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputPassword}
            mode="outlined"
            label={t("components.wifi_selector.label_ssid")}
            placeholder={t("components.wifi_selector.hint_ssid")}
            autoCapitalize="none"
            value={ssid} // ✅ en vez de defaultValue
            onChangeText={updateSSID}
            error={!!errorSSID}
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
        </View>

        {!!errorSSID && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorMessageText}>{errorSSID}</Text>
          </View>
        )}
      </View>

      {/* PASSWORD */}
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputPassword}
            mode="outlined"
            label={t("components.wifi_selector.label_passwd")}
            placeholder={t("components.wifi_selector.hint_passwd")}
            autoCapitalize="none"
            secureTextEntry={!showPasswd}
            value={passwd} // ✅ en vez de defaultValue
            onChangeText={updatePasswd}
            error={!!errorPasswd}
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
              icon={showPasswd ? "eye" : "eye-off"}
              onPress={() => setShowPasswd((s) => !s)}
              iconColor={!!errorPasswd ? Theme.colors.error : "white"}
            />
          </View>
        </View>

        {!!errorPasswd && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorMessageText}>{errorPasswd}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default WifiSelector;