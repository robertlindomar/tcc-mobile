import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";

export function MensagemErro({ mensagem }: { mensagem: string | null }) {
    if (!mensagem) {
        return null;
    }

    return (
        <View accessibilityRole="alert" style={estilos.container}>
            <Text style={estilos.texto}>{mensagem}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        backgroundColor: cores.perigoSuave,
        borderRadius: 10,
        padding: 12,
    },
    texto: { color: cores.perigo, fontSize: 14, lineHeight: 20 },
});
