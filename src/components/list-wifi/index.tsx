import * as React from 'react';
import {
    View,
    FlatList,
    ListRenderItem,
    TouchableHighlight
} from 'react-native';
import {
    Portal,
    Dialog,
    Paragraph,
    Text,
    Button,
    ActivityIndicator
} from 'react-native-paper';
import {
    CTI_PREFIX,
    scanWifiList,
    WifiItem,
    calculateSignal
} from '../../utils/wifi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import Theme from '../../theme';

export type ListWifiProps = {
    show: boolean;
    onSelected: (SSID: string|null) => void;
};
export const ListWifi: React.FC<ListWifiProps> = ({show, onSelected}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const [wifis, setWifis] = React.useState<WifiItem[]>();
    const [isSearching, setSearching] = React.useState(false);
    const updateWifis = React.useCallback((wifis: WifiItem[]) => {
        setSearching(false);
        setWifis(wifis.filter(item => !item.SSID.startsWith(CTI_PREFIX)));
    }, []);
    React.useEffect(() => {
        if (show) {
            setSearching(true);
            scanWifiList(updateWifis)
        }
    }, [show]);
    const renderWifiItem: ListRenderItem<WifiItem> = React.useCallback(({item}) => {
        return (
            <TouchableHighlight
                onPress={() => onSelected(item.SSID)}
                underlayColor={Theme.colors.ctiGreen}
                style={styles.bodyListDevice}>
                    <View style={styles.bodyListDeviceRow}>
                        <Icon name={`wifi-strength-${calculateSignal(item.level)}`} size={30} color={Theme.colors.ctiGreen}/>
                        <View style={styles.bodyListDeviceItem}>
                            <Text style={styles.bodyListDeviceItemText}>{item.SSID}</Text>
                        </View>
                    </View>
            </TouchableHighlight>
        );
    }, [onSelected]);
    if (!show) return null;
    return (
        <View>
            <Portal>
                <Dialog visible={show} style={styles.container}>
                    <Dialog.Title style={styles.title}>{t('components.list_wifi.title')}</Dialog.Title>
                    <Dialog.Content style={styles.content}>
                        <Paragraph>{t('components.list_wifi.message_explain')}</Paragraph>
                        <FlatList<WifiItem>
                            data={wifis}
                            renderItem={renderWifiItem}
                            keyExtractor={(item) => item.BSSID + ''}/>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <View style={styles.loading}>{(!wifis || wifis.length < 1 || isSearching) && <ActivityIndicator color={Theme.colors.ctiGreen}/>}</View>
                        <Button onPress={() => onSelected(null)} color={Theme.colors.text} style={styles.button}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default ListWifi;