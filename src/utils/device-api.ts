import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import WifiManager from 'react-native-wifi-reborn';
export const SERVER = 'http://10.10.10.1';
export const CONFIGURATION = '/config';

// GEt Config
// {
//     "MAC_disp": 14500010,
//     "contrasena_disp": 8692861,
//     "tipo_conexion": 0,
//     "SSID": "",
//     "contrasena_SSID": "",
//     "senyal": 1,
//     "auto_man": 0,
//     "man_APN": "",
//     "man_USER": "",
//     "man_CONTRASEN": "",
//     "estado_SIM": 1,
//     "estado_PIN": 0,
//     "intentos_PIN": 3,
//     "contrasena_acceso": 12345678
// }
// Post Config
// {
//     "tipo_conf ":0, //0: nada, se queda como estaba; 1: se ha configurado según “tipo_conexion”; 2: se intenta quitar PIN; 3: reset fabrica. Para “contraseña_acceso” se comprueba, ya que si es diferente, es que se ha cambiado.
//     "tipo_conexion": 0,
//     "SSID":"你好",
//     "contrasena_SSID":"",
//     "auto_man":0,
//     "man_APN":"",
//     "man_USER":"",
//     "man_CONTRASEN":"",
//     "contrasena_acceso":12345678,
//     "PIN":1234 //4 digitos
// }


export const ERROR_GET_CONFIG = 'error_get_config';
export const ERROR_GET_CONFIG_TIMEOUT = 'error_get_config_timeout';
export const ERROR_POST_CONFIG = 'error_post_config';
export const ERROR_INTERNET_CONNECTION = 'error_internet_connection';
export const ERROR_SERVER_CONNECTION = 'error_server_connection';

export type DeviceConfig = {
    MAC_disp: string;
    contrasena_disp: string;
    tipo_conexion: number;
    SSID: string;
    contrasena_SSID: string;
    senyal: number;
    auto_man: number;
    man_APN: string;
    man_USER: string;
    man_CONTRASEN: string;
    estado_SIM: number;
    estado_PIN: number;
    intentos_PIN: number;
    contrasena_acceso: string;
};
export type DeviceConfigBody = {
    tipo_conf: number;
    tipo_conexion: number;
    SSID: string;
    contrasena_SSID: string;
    auto_man: number;
    man_APN: string;
    man_USER: string;
    man_CONTRASEN: string;
    contrasena_acceso: string;
    PIN: number;
};

export type Response = {
    status: number;
    body: DeviceConfig;
};
export const getIP = async () => {
    if (WifiManager.getIP) return await WifiManager.getIP();
    return undefined;
};
export const waitForPromise = (delay = 30000) => {
    return new Promise<undefined>((resolve) => {
        setTimeout(resolve, delay);
    });
};
export const waitForReject = (delay = 30000) => {
    return new Promise<undefined>((_, reject) => {
        setTimeout(() => {
            //console.log('Timeout DElay in ', delay);
            reject(new Error('Timeout ' + delay));
        }, delay);
    });
};

export const generatePINBody = (PIN: number) => {
    return {
        tipo_conf: 2,
        PIN: PIN
    };
};
export const generatePUKBody = (PUK: number) => {
    return {
        tipo_conf: 2,
        PUK: PUK
    };
};
export const generate4GAutoBody = () => {
    return {
        tipo_conf: 1,
        tipo_conexion: 2,
        auto_man: 0
    };
};
export const generate4GManualBody = (apn = '', user = '', passwd = '') => {
    return {
        tipo_conf: 1,
        tipo_conexion: 2,
        auto_man: 1,
        man_APN: apn,
        man_USER: user,
        man_CONTRASEN: passwd
    };
};
export const generateWifiBody = (ssid: string, passwd: string) => {
    return {
        tipo_conf: 1,
        tipo_conexion: 1,
        SSID: ssid,
        contrasena_SSID: passwd
    };
};
export const generateChangePasswordBody = (passwd: string) => {
    return {
        tipo_conf: 0,
        contrasena_acceso: passwd
    };
};
export const generateResetBody = () => {
    return {
        tipo_conf: 3
    };
};
export const generateStopAPBody = () => {
    return {
        tipo_conf: 4
    };
};

export const requestConfiguration = async (): Promise<Response> => {
    const response = await fetch(
        SERVER + CONFIGURATION,
        {
            method: 'GET',
        }
    );
    const data = await response.json();
    //console.log('Response GET /config', data);
    return {
        status: response.status,
        body: data
    };
};

export const changeConfiguration = async (config: Partial<DeviceConfigBody>): Promise<Response> => {
    const body = JSON.stringify(config).replace(/^./, '{\n').replace(/.$/, '\n}').replace(/,/g, ',\n') + '\r\n';
    //console.log('Body to send', body);
    const response = await fetch(
        SERVER + CONFIGURATION,
        {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body
        }
    );
    //console.log('Response POST /config', response.status);
    const data = await response.json();
    return {
        status: response.status,
        body: data
    };
};

export type ResponseState = {
    isLoading: boolean;
    try: number;
    ip?: string;
    error?: string;
    response?: Response;
};
export type ActionInit = {
    type: 'INIT';
    try: number;
    ip?: string;
};
export type ActionSuccess = {
    type: 'SUCCESS';
    response: Response;
};
export type ActionError = {
    type: 'REJECTED';
    error: string;
};
export type Action = ActionInit | ActionSuccess | ActionError;
export const initialState: ResponseState = { isLoading: false, try: 0 };
export const requestReducer = (state: ResponseState, action: Action): ResponseState => {
    switch (action.type) {
        case 'INIT': {
            return { ...state, error: undefined, isLoading: true, try: action.try, ip: action.ip };
        }
        case 'REJECTED': {
            return { isLoading: false, error: action.error, try: state.try, ip: state.ip };
        }
        case 'SUCCESS': {
            return { isLoading: false, response: action.response, try: state.try, ip: state.ip }
        }
        default: return state;
    }
};
export const useGetConfig = () => {
    const [state, dispatch] = React.useReducer<typeof requestReducer>(requestReducer, initialState);
    const request = React.useCallback(async () => {
        try {
            dispatch({ type: 'INIT', ip: await getIP(), try: 1 });
            setTimeout(async () => {
                try {
                    const config = requestConfiguration();
                    const timeout = waitForPromise(10000);
                    const response = await Promise.race<Response | undefined>([config, timeout]);
                    // WARNING!!!!!!!!
                    // This line is for testing Huawei 7
                    //dispatch({type: 'REJECTED', error: ERROR_GET_CONFIG_TIMEOUT});
                    if (response) dispatch({ type: 'SUCCESS', response });
                    else dispatch({ type: 'REJECTED', error: ERROR_GET_CONFIG_TIMEOUT });
                }
                catch (error) {
                    console.log('Error getting config 1', error.message);
                    dispatch({ type: 'INIT', ip: await getIP(), try: 2 });
                    setTimeout(async () => {
                        try {
                            const config = await requestConfiguration();
                            dispatch({ type: 'SUCCESS', response: config });
                        }
                        catch (error) {
                            console.log('Error getting config 2', error.message);
                            dispatch({ type: 'INIT', ip: await getIP(), try: 3 });
                            setTimeout(async () => {
                                try {
                                    const config = await requestConfiguration();
                                    dispatch({ type: 'SUCCESS', response: config });
                                }
                                catch (error) {
                                    dispatch({ type: 'INIT', ip: await getIP(), try: 4 });
                                    console.log('Error getting config 3', error.message);
                                    setTimeout(async () => {
                                        try {
                                            const config = await requestConfiguration();
                                            dispatch({ type: 'SUCCESS', response: config });
                                        }
                                        catch (error) {
                                            console.log('Error getting config 4', error.message);
                                            dispatch({ type: 'REJECTED', error: ERROR_GET_CONFIG });
                                        }
                                    }, 12000);
                                }
                            }, 8000);
                        }
                    }, 3000);
                }
            }, 1000);
        }
        catch (error) {
            //console.log('Error getting config', error.message);
            dispatch({ type: 'REJECTED', error: ERROR_GET_CONFIG });
        }
    }, []);
    return { state, request };
};
export const useUpdateConfig = () => {
    const [state, dispatch] = React.useReducer<typeof requestReducer>(requestReducer, initialState);
    const request = React.useCallback(async (newConfig: Partial<DeviceConfigBody>) => {
        try {
            dispatch({ type: 'INIT', ip: await getIP(), try: 0 });
            await new Promise((resolve) => { setTimeout(resolve, 1500) });
            const config = await changeConfiguration(newConfig);
            dispatch({ type: 'SUCCESS', response: config });
        }
        catch (error) {
            //console.log('Error POST /config', error);
            dispatch({ type: 'REJECTED', error: ERROR_POST_CONFIG });
        }
    }, []);
    return { state, request };
};

export type DeviceSaved = {
    name: string;
    MAC: string;
    password: string;
    date: number;
};
export const saveNewConfiguration = async (device: DeviceSaved) => {
    const devicesStr = await AsyncStorage.getItem('DEVICES_SAVED') || '[]';
    const devices = JSON.parse(devicesStr) as DeviceSaved[];
    const devicesFiltered = devices.filter(deviceSaved => device.MAC !== deviceSaved.MAC);
    devicesFiltered.unshift(device);
    const devicesToSaveString = JSON.stringify(devicesFiltered.slice(0, 15));
    await AsyncStorage.setItem('DEVICES_SAVED', devicesToSaveString);
};
export const getLastConfiguration = async () => {
    const devicesStr = await AsyncStorage.getItem('DEVICES_SAVED') || '[]';
    return JSON.parse(devicesStr) as DeviceSaved[];
};
export const pingToGoogle = async () => {
    return await fetch('https://google.com');
};
export const checkInternetConnection = async () => {
    return await Promise.race([pingToGoogle(), waitForReject(10000)]);
};
export const checkCTIServer = async (mac: string): Promise<{ connected: true, date: string } | { connected: false }> => {
    try {
        await waitForPromise(15000);
        const response = await fetch(
            'http://apidlg.cticontrol.com:8080/SimpleRestWeeb/webresources/dlg/validarconexion/',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: 'mac=' + mac
            }
        );
        //console.log('Response from server', response.status, response.ok);
        const status = response.status;
        if (status === 200) {
            const data = await response.json();
            //console.log('Data server', data);
            const lastDateStr = data.fechaActualizacion.substr(0, 22) + ':' + data.fechaActualizacion.substr(22);
            const lastConnection = new Date(lastDateStr);
            const currentTime = Date.now();
            //console.log('currnet time Check 2', lastConnection, lastConnection.getTime(), currentTime, currentTime - lastConnection.getTime());
            if (data.estado === 1 && (currentTime - lastConnection.getTime()) < 90000) {
                return { connected: true, date: lastDateStr };
            }
            return { connected: false };
        };
        throw new Error('Error connecting to server');
    }
    catch (errorServer) {
        //console.log('CTIServer Error', errorServer);
        throw new Error('Error connecting to server');
    }
};
export const checkServerCommunication = async (mac: string): Promise<{ connected: true, date: string } | { connected: false }> => {
    try {
        await waitForPromise(5000);
        const response = await fetch(
            'http://apidlg.cticontrol.com:8080/SimpleRestWeb/webresources/dlg/validarconexion/',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: 'mac=' + mac
            }
        );
        //console.log('Response from server', response.status, response.ok);
        const status = response.status;
        if (status === 200) {
            const data = await response.json();
            //console.log('Data server', data);
            const lastDateStr = data.fechaActualizacion.substr(0, 22) + ':' + data.fechaActualizacion.substr(22);
            const lastConnection = new Date(lastDateStr);
            const currentTime = Date.now();
            //console.log('currnet time', lastConnection, lastConnection.getTime(), currentTime, currentTime - lastConnection.getTime());
            if (data.estado === 1 && (currentTime - lastConnection.getTime()) < 45000) {
                return { connected: true, date: lastDateStr };
            }
            const status = await checkCTIServer(mac);
            if (status.connected) return status;
            return checkCTIServer(mac);
        };
        throw new Error('Error connecting to server');
    }
    catch (errorServer) {
        //console.log('CTIServer Error', errorServer);
        throw new Error('Error connecting to server');
    }
};