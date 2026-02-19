import 'react-native-gesture-handler';
import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import ConfigurationContextProvider from './components/use-configuration';
import PermissionWifi from './components/permission-wifi';
import LocaleContextProvider from './locales';
import RootContainer from './screens';
import theme from './theme';


const App: React.FC<{}> = () => {
    return (
        <>
            <PaperProvider theme={theme}>
                <ConfigurationContextProvider>
                    <LocaleContextProvider>
                        <PermissionWifi />
                        <RootContainer />
                    </LocaleContextProvider>
                </ConfigurationContextProvider>
            </PaperProvider>
        </>
    );
};

export default App;
