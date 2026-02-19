import { DefaultTheme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      text: string;
      ctiGreen: string;
      ctiGrey: string;
      ctiGreyDark: string;
      ctiWhite: string;
      ctiBlueGrey: string;
      warning: string;
    }
  }
}

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#17314C',
    accent: '#BDEF22',
    background: '#172737',
    text: 'white',
    ctiGreen: '#C7EC53',
    ctiGrey: '#E1E1E1',
    ctiGreyDark: '#707070',
    ctiWhite: '#FFF',
    ctiBlueGrey: '#32485E',
    warning: 'orange'
  }
};

export default theme;
// import "react-native-paper";

// declare module "react-native-paper" {
//   interface MD3Colors {
//     // legacy/compat
//     text: string;

//     // tus colores CTI
//     ctiGreen: string;
//     ctiGrey: string;
//     ctiGreyDark: string;
//     ctiWhite: string;
//     ctiBlueGrey: string;
//     warning: string;

//     // si lo sigues usando en código viejo
//     accent: string;
//   }
// }
