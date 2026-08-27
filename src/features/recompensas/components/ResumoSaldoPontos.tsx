import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";

type Props = {
    pontos: number;
    nivel: number;
};

export function ResumoSaldoPontos({ pontos, nivel }: Props) {
    return (
        <View style={estilos.cartao}>
            <Text style={estilos.rotulo}>Seu saldo</Text>
            <Text style={estilos.pontos}>{pontos} pts</Text>
            <Text style={estilos.nivel}>Nível {nivel}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.primariaSuave,
        borderColor: cores.primaria,
        borderRadius: 16,
        borderWidth: 1,
        gap: 4,
        padding: 16,
    },
    rotulo: { color: cores.primaria, fontSize: 13, fontWeight: "600" },
    pontos: { color: cores.texto, fontSize: 24, fontWeight: "800" },
    nivel: { color: cores.textoSecundario, fontSize: 14, fontWeight: "600" },
});
