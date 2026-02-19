import "react-native-paper";

declare module "react-native-paper" {
    interface MD3Colors {
        // legacy/compat
        text: string;

        // tus colores CTI
        ctiGreen: string;
        ctiGrey: string;
        ctiGreyDark: string;
        ctiWhite: string;
        ctiBlueGrey: string;
        warning: string;

        // si lo sigues usando en código viejo
        accent: string;
    }
}
