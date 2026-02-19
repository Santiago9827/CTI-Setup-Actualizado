import * as React from 'react';
import {
    View,
    Image
} from 'react-native';
import {
    Text,
    Button,
    RadioButton
} from 'react-native-paper';
import {StackScreenProps} from '@react-navigation/stack';
import {useLocale} from '../../locales';
import {useStyles} from './styles';
import {
    LANGUAGES_SCREEN,
    RootStakParams
} from '../constants';
import Theme from '../../theme';
import { TouchableHighlight } from 'react-native-gesture-handler';

const ESImg = require('../../images/es.png');
const UKImg = require('../../images/uk.png');

type Props = StackScreenProps<RootStakParams, typeof LANGUAGES_SCREEN>;
const LanguagesScreen: React.FC<Props> = ({navigation}) => {
    const {t, locale, updateLocale} = useLocale();
    const styles = useStyles();
    //console.log('Current locale', locale);
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{t('screens.languages.message_select')}</Text>
            <View style={styles.body}>
                <View style={styles.langs}>
                    <TouchableHighlight underlayColor={Theme.colors.ctiGreen} onPress={() => updateLocale('en')}>
                    <View style={styles.langRow}>
                        <View style={styles.flagView}><Image source={UKImg} height={42} width={42} style={styles.langFlag}/></View>
                        <View style={styles.langTextsBlock}>
                            <Text style={styles.langText}>{t('screens.languages.label_en')}</Text>
                            <Text style={styles.langIdText}>EN</Text>
                        </View>
                        <RadioButton status={locale === 'en' ? 'checked' : 'unchecked'} color={Theme.colors.ctiGreen}  value='en' onPress={() => updateLocale('en')}/>
                    </View>
                    </TouchableHighlight>
                    <TouchableHighlight underlayColor={Theme.colors.ctiGreen} onPress={() => updateLocale('es')}>
                    <View style={styles.langRow}>
                        <View style={styles.flagView}><Image source={ESImg} height={36} width={36} style={styles.langFlag}/></View>
                        <View style={styles.langTextsBlock}>
                            <Text style={styles.langText}>{t('screens.languages.label_es')}</Text>
                            <Text style={styles.langIdText}>ES</Text>
                        </View>
                        <RadioButton status={locale === 'es' ? 'checked' : 'unchecked'} color={Theme.colors.ctiGreen} value='es' onPress={() => updateLocale('es')}/>
                    </View>
                    </TouchableHighlight>
                </View>
            </View>
            <Button
                style={styles.button}
                color={Theme.colors.ctiGreen}
                mode='contained'
                onPress={() => navigation.pop()}>
                {t('screens.languages.button_cancel')}
            </Button>
        </View>
    );
};

export default LanguagesScreen;