import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";

type Props = {
    pontos: number;
    nivel: number;
};

export function ResumoSaldoPontos({ pontos, nivel }: Props) {
    return (
        <View style={estilos.cartao}>
            <View style={estilos.brilho} />
            <View style={estilos.linhaTopo}>
                <Text style={estilos.rotulo}>Seu saldo</Text>
                <View style={estilos.sparkles}>
                    <Ionicons color="#FFFFFF" name="sparkles" size={16} />
                    <Ionicons color="rgba(255,255,255,0.85)" name="sparkles" size={13} />
                    <Ionicons color="rgba(255,255,255,0.7)" name="sparkles" size={11} />
                </View>
            </View>
            <Text style={estilos.pontos}>{pontos} pts</Text>
            <Text style={estilos.nivel}>Nível {nivel}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.primaria,
        borderRadius: 20,
        gap: 4,
        overflow: "hidden",
        padding: 18,
    },
    brilho: {
        backgroundColor: cores.primariaEscura,
        borderRadius: 90,
        bottom: -40,
        height: 110,
        opacity: 0.35,
        position: "absolute",
        right: -30,
        width: 130,
    },
    linhaTopo: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
    sparkles: { flexDirection: "row", gap: 4 },
    rotulo: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" },
    pontos: { color: "#FFFFFF", fontSize: 28, fontWeight: "800", marginTop: 4 },
    nivel: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "600", marginTop: 2 },
});
