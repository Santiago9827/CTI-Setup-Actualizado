import * as React from 'react';
import { View } from 'react-native';
import {
    Portal,
    Dialog,
    Paragraph,
    Button
} from 'react-native-paper';
import { useLocale } from '../../locales';
import Theme from '../../theme';


export type CloseConnectionProps = {
    isOpen: boolean;
    closeDialog: (option: 0 | 1) => void;
};
export const CloseConnection: React.FC<CloseConnectionProps> = ({ isOpen, closeDialog }) => {
    const { t } = useLocale();
    return (
        <View>
            <Portal>
                <Dialog visible={isOpen} style={{ backgroundColor: Theme.colors.ctiBlueGrey }}>
                    <Dialog.Title>{t('components.close_connection.title')}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{t('components.close_connection.message_explain')}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => closeDialog(0)} color={Theme.colors.text}>{t('components.close_connection.button_cancel')}</Button>
                        <Button onPress={() => closeDialog(1)} color={Theme.colors.ctiGreen}>{t('components.close_connection.button_exit')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default CloseConnection;