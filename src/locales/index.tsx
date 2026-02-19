import * as React from 'react';
import { I18n, type TranslateOptions, type Scope } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import es from './es.json';

// ✅ En i18n-js v4 creas una instancia
const i18n = new I18n({ en, es });

// (opcional) tipo de tu función t()
export type TranslateFn = (scope: Scope, options?: TranslateOptions) => string;

export const getCurrentLanguage = () => {
    const locales = RNLocalize.getLocales();
    if (Array.isArray(locales) && locales.length > 0 && locales[0]?.languageCode) {
        return locales[0].languageCode; // "es", "en", etc.
    }
    return 'en';
};

const initLocale = () => {
    i18n.defaultLocale = 'en';
    i18n.enableFallback = true; // ✅ antes era fallbacks
    i18n.locale = getCurrentLanguage();
    return i18n.locale;
};

export type LocaleContext = {
    t: TranslateFn;
    locale: string;
    updateLocale: (locale: string) => void;
};

const initialLocale = initLocale();

const initialLocaleContext: LocaleContext = {
    t: () => '',
    locale: initialLocale,
    updateLocale: () => { },
};

export const LocalizationContext =
    React.createContext<LocaleContext>(initialLocaleContext);

export const LocaleContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const [locale, setLocale] = React.useState<string>(() => initLocale());

    const updateLocale = React.useCallback((newLocale: string) => {
        const safe = newLocale || 'en';
        i18n.locale = safe;
        setLocale(safe);
        AsyncStorage.setItem('language', safe);
    }, []);

    React.useEffect(() => {
        AsyncStorage.getItem('language').then((saved) => {
            if (saved) updateLocale(saved);
        });
    }, [updateLocale]);

    const localeValue = React.useMemo<LocaleContext>(() => {
        return {
            t: (scope: Scope, options?: TranslateOptions) =>
                i18n.t(scope, { locale, ...options }),
            locale,
            updateLocale,
        };
    }, [locale, updateLocale]);

    return <LocalizationContext.Provider {...props} value={localeValue} />;
};

export const useLocale = () => React.useContext(LocalizationContext);

export default LocaleContextProvider;
