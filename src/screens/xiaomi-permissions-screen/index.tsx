import * as React from 'react';
import {
    View,
    Image
} from 'react-native';
import {
    Text,
    Button,
    Checkbox
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import {
    XIAOMI_PERMISSIONS_SCREEN,
    RootStakParams
} from '../constants';
import {
    openPermissions,
    getSuggestion,
    saveSuggestion
} from '../../utils/wifi';

import Theme from '../../theme';
const DiscconectedImg = require('../../images/dlg.png');


type Props = StackScreenProps<RootStakParams, typeof XIAOMI_PERMISSIONS_SCREEN>;
const XiaomiPermissionsScreen: React.FC<Props> = ({navigation}) => {
    const {t} = useLocale();
    const styles = useStyles();
    const [notShowChecked, setNotShowChecked] = React.useState(false);
    const changeNotShow = React.useCallback(() => {
        saveSuggestion(notShowChecked ? '0' : '1');
        setNotShowChecked(!notShowChecked);
    }, [notShowChecked]);

    React.useEffect(() => {
        getSuggestion().then(notShow => setNotShowChecked(notShow));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('screens.xiaomi_perm.message')}</Text>
            <View style={styles.body}>
                <View style={styles.bodyGuide}>
                    <View style={styles.message}>
                        <Text style={styles.messageNumber}>1</Text>
                        <Text style={styles.messageText}>{t('screens.xiaomi_perm.message_details1')}</Text>
                    </View>
                    <View style={styles.message}>
                        <Text style={styles.messageNumber}>2</Text>
                        <Text style={styles.messageText}>{t('screens.xiaomi_perm.message_details2')}</Text>
                    </View>
                    <View style={styles.message}>
                        <Text style={styles.messageNumber}>3</Text>
                        <Text style={styles.messageText}>{t('screens.xiaomi_perm.message_details3')}</Text>
                    </View>
                    <Button
                        style={styles.button}
                        color={Theme.colors.ctiGreen}
                        mode='contained'
                        onPress={() => openPermissions()}>
                        {t('screens.xiaomi_perm.button_perms')}
                    </Button>
                    <View style={styles.messageCheck}>
                        <Checkbox color={Theme.colors.ctiGreen} status={notShowChecked ? 'checked' : 'unchecked'} onPress={changeNotShow}/>
                        <Text>{t('screens.xiaomi_perm.forget')}</Text>
                    </View>
                </View>
            </View>
            <Button
                style={styles.button}
                color={Theme.colors.ctiGreen}
                mode='contained'
                onPress={() => navigation.popToTop()}>
                {t('screens.xiaomi_perm.button_close')}
            </Button>
        </View>
    );
};

export default XiaomiPermissionsScreen;