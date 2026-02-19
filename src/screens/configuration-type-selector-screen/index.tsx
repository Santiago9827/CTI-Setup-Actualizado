import * as React from 'react';
import {
    View,
    Image,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import {
    Portal,
    Dialog,
    Paragraph,
    Text,
    TextInput,
    Button
} from 'react-native-paper';
import {
    CONFIGURATION_TYPE_SELECTOR_SCREEN,
    SETUP_DEVICE_DATA_SCREEN,
    SETUP_DEVICE_WIFI_SCREEN,
    RootStakParams
} from '../constants';
import {useLocale} from '../../locales';
import Theme from '../../theme';
import { useStyles } from './styles';
import { StackScreenProps } from '@react-navigation/stack';

const DataImg = require('../../images/btn_new4g.png');
const WiFiImg = require('../../images/btn_newwifi.png');

export const ConfigurationName: React.FC<{isOpen: boolean; type: 0|1|2; selectConfig: (type: 0|1|2, name?: string|null) => void}> = ({isOpen, type, selectConfig}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const [name, setName] = React.useState('');
    return (
        <View>
            <Portal>
                <Dialog visible={isOpen} style={styles.dialog}>
                    <Dialog.Title>{t('screens.configuration_type_selector.dialog_title')}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{t('screens.configuration_type_selector.dialog_explain')}</Paragraph>
                        <View>
                        <TextInput
                            theme={{colors: {primary: Theme.colors.ctiGreen, placeholder: Theme.colors.ctiGreen}}}
                            mode='outlined'
                            label={t('screens.configuration_type_selector.input_label_name')}
                            placeholder={t('screens.configuration_type_selector.input_hint_name')}
                            autoCapitalize='none'
                            onChangeText={setName}/>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                    <Button color={Theme.colors.text} onPress={() => selectConfig(0)}>{t('screens.configuration_type_selector.button_cancel')}</Button>
                    <Button color={Theme.colors.ctiGreen} onPress={() => selectConfig(type, name)}>{t('screens.configuration_type_selector.button_ok')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

type Props = StackScreenProps<RootStakParams, typeof CONFIGURATION_TYPE_SELECTOR_SCREEN>;
export const ConfigurationTypeSelector: React.FC<Props> = ({navigation, route}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const device = route.params;
    const [showConfigurationTypeDialog, setShowConfigurationTypeDialog] = React.useState<0|1|2>(0);
    const closeDialog = (option: 0|1|2, name?: string|null) => {
        //console.log('SAving with name', name);
        if(option === 1 && !!device) navigation.replace(SETUP_DEVICE_WIFI_SCREEN, {device, configName: name || ''});
        if(option === 2 && !!device) navigation.replace(SETUP_DEVICE_DATA_SCREEN, {device, configName: name || ''});
        setShowConfigurationTypeDialog(0);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{t('screens.configuration_type_selector.message_explain')}</Text>
            <View style={styles.body}>
                <View>
                        <TouchableHighlight
                            underlayColor={Theme.colors.ctiGreen}
                            style={styles.touchableZone}
                            onPress={() => setShowConfigurationTypeDialog(1)}>
                            <Image source={WiFiImg} style={styles.imageButton}/>
                        </TouchableHighlight>
                        <TouchableHighlight
                            underlayColor={Theme.colors.ctiGreen}
                            style={styles.touchableZone}
                            onPress={() => setShowConfigurationTypeDialog(2)}>
                            <Image source={DataImg} style={styles.imageButton}/>
                        </TouchableHighlight>
                </View>
            </View>
            <ConfigurationName
                isOpen={showConfigurationTypeDialog !== 0}
                type={showConfigurationTypeDialog}
                selectConfig={closeDialog}
            />
        </ScrollView>
    );
};

export default ConfigurationTypeSelector;