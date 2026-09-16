import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";

const logoHorizontal = require("../../assets/marca/conecta-comercio-logo-horizontal.png");
const simbolo = require("../../assets/marca/conecta-comercio-simbolo.png");

type Props = {
    variante?: "horizontal" | "simbolo";
    estilo?: StyleProp<ImageStyle>;
};

export function LogoMarca({ variante = "horizontal", estilo }: Props) {
    if (variante === "simbolo") {
        return (
            <Image
                accessibilityIgnoresInvertColors
                accessibilityLabel="Conecta Comércio"
                resizeMode="contain"
                source={simbolo}
                style={[estilos.simbolo, estilo]}
            />
        );
    }

    return (
        <Image
            accessibilityIgnoresInvertColors
            accessibilityLabel="Conecta Comércio"
            resizeMode="contain"
            source={logoHorizontal}
            style={[estilos.horizontal, estilo]}
        />
    );
}

const estilos = StyleSheet.create({
    horizontal: { height: 48, width: 220 },
    simbolo: { height: 56, width: 56 },
});
