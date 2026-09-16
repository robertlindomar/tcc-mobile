import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { FundoPastel } from "@/components/FundoPastel";
import { cores } from "@/styles/tema";

type Props = {
    mensagem: string | null;
    aoTentarNovamente: () => void;
};

export function TelaRestauracao({ mensagem, aoTentarNovamente }: Props) {
    if (!mensagem) {
        return (
            <FundoPastel>
                <View style={estilos.centralizada}>
                    <ActivityIndicator color={cores.primaria} size="large" />
                </View>
            </FundoPastel>
        );
    }

    return (
        <FundoPastel>
            <View style={estilos.centralizada}>
                <View style={estilos.cartao}>
                    <Text style={estilos.titulo}>Não foi possível validar sua sessão</Text>
                    <Text style={estilos.mensagem}>{mensagem}</Text>
                    <BotaoPrimario titulo="Tentar novamente" aoPressionar={aoTentarNovamente} />
                </View>
            </View>
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    centralizada: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        gap: 14,
        maxWidth: 420,
        padding: 24,
        width: "100%",
    },
    titulo: { color: cores.texto, fontSize: 20, fontWeight: "700" },
    mensagem: { color: cores.textoSecundario, fontSize: 15, lineHeight: 22 },
});
