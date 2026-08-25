import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { cores } from "@/styles/tema";

type Props = {
    mensagem: string | null;
    aoTentarNovamente: () => void;
};

export function TelaRestauracao({ mensagem, aoTentarNovamente }: Props) {
    if (!mensagem) {
        return (
            <View style={estilos.centralizada}>
                <ActivityIndicator color={cores.primaria} size="large" />
            </View>
        );
    }

    return (
        <View style={estilos.centralizada}>
            <View style={estilos.cartao}>
                <Text style={estilos.titulo}>Não foi possível validar sua sessão</Text>
                <Text style={estilos.mensagem}>{mensagem}</Text>
                <BotaoPrimario titulo="Tentar novamente" aoPressionar={aoTentarNovamente} />
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    centralizada: {
        alignItems: "center",
        backgroundColor: cores.fundo,
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    cartao: {
        backgroundColor: cores.superficie,
        borderRadius: 20,
        gap: 14,
        maxWidth: 420,
        padding: 24,
        width: "100%",
    },
    titulo: { color: cores.texto, fontSize: 20, fontWeight: "700" },
    mensagem: { color: cores.textoSecundario, fontSize: 15, lineHeight: 22 },
});
