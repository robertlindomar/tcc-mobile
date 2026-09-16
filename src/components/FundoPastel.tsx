import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { cores } from "@/styles/tema";

type Props = {
    children: ReactNode;
    estilo?: ViewStyle;
};

/** Fundo claro com manchas pastéis suaves (referência visual da marca). */
export function FundoPastel({ children, estilo }: Props) {
    return (
        <View style={[estilos.container, estilo]}>
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
                <View style={[estilos.mancha, estilos.manchaTopoDireita]} />
                <View style={[estilos.mancha, estilos.manchaTopoEsquerda]} />
                <View style={[estilos.mancha, estilos.manchaBaixoEsquerda]} />
                <View style={[estilos.mancha, estilos.manchaBaixoDireita]} />
            </View>
            {children}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        backgroundColor: cores.fundo,
        flex: 1,
        overflow: "hidden",
        position: "relative",
    },
    mancha: {
        borderRadius: 999,
        position: "absolute",
    },
    manchaTopoDireita: {
        backgroundColor: "rgba(255, 150, 138, 0.22)",
        height: 220,
        right: -80,
        top: -60,
        width: 220,
    },
    manchaTopoEsquerda: {
        backgroundColor: "rgba(216, 243, 234, 0.9)",
        height: 180,
        left: -70,
        top: -40,
        width: 180,
    },
    manchaBaixoEsquerda: {
        backgroundColor: "rgba(255, 120, 108, 0.14)",
        bottom: -40,
        height: 200,
        left: -60,
        width: 200,
    },
    manchaBaixoDireita: {
        backgroundColor: "rgba(2, 195, 148, 0.1)",
        bottom: 40,
        height: 160,
        right: -50,
        width: 160,
    },
});
