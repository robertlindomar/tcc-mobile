import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { progressoProximoTicket, rotuloQuantidadeTickets } from "@/features/nfce/regrasExtrato";
import { cores } from "@/styles/tema";
import { ExtratoCampanha } from "@/types/api";
import { formatarMoeda } from "@/utils/formatarMoeda";

type Props = {
    extrato: ExtratoCampanha | null;
    carregando: boolean;
};

/** Cartão com o total de tickets do consumidor e o progresso para o próximo. */
export function ResumoTicketsCampanha({ extrato, carregando }: Props) {
    if (!extrato) {
        return (
            <View style={[estilos.cartao, estilos.cartaoCarregando]}>
                {carregando ? <ActivityIndicator color={cores.primaria} /> : null}
                <Text style={estilos.textoSecundario}>
                    {carregando ? "Carregando seus tickets…" : "Não foi possível carregar seus tickets."}
                </Text>
            </View>
        );
    }

    const progresso = progressoProximoTicket(extrato.valorResidual, extrato.valorPorTicket);

    return (
        <View accessibilityLabel={`Você tem ${rotuloQuantidadeTickets(extrato.totalTickets)}`} style={estilos.cartao}>
            <View style={estilos.linhaTopo}>
                <View style={estilos.icone}>
                    <Ionicons color={cores.ouro} name="ticket" size={26} />
                </View>
                <View style={estilos.blocoTotal}>
                    <Text style={estilos.rotulo}>Meus tickets</Text>
                    <Text style={estilos.total}>{extrato.totalTickets}</Text>
                </View>
                <View style={estilos.blocoNotas}>
                    <Text style={estilos.numeroNotas}>{extrato.notas.length}</Text>
                    <Text style={estilos.textoSecundario}>
                        {extrato.notas.length === 1 ? "nota lida" : "notas lidas"}
                    </Text>
                </View>
            </View>

            <View style={estilos.barra}>
                <View style={[estilos.preenchimento, { width: `${Math.round(progresso * 100)}%` }]} />
            </View>
            <Text style={estilos.textoSecundario}>
                Saldo {formatarMoeda(extrato.valorResidual)} · faltam{" "}
                <Text style={estilos.destaque}>{formatarMoeda(extrato.faltaParaProximoTicket)}</Text> para o
                próximo ticket
            </Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 18,
        borderWidth: 1,
        gap: 10,
        padding: 16,
    },
    cartaoCarregando: { alignItems: "center", flexDirection: "row", gap: 10 },
    linhaTopo: { alignItems: "center", flexDirection: "row", gap: 12 },
    icone: {
        alignItems: "center",
        backgroundColor: cores.ouroSuave,
        borderRadius: 14,
        height: 48,
        justifyContent: "center",
        width: 48,
    },
    blocoTotal: { flex: 1 },
    rotulo: { color: cores.textoSecundario, fontSize: 12, fontWeight: "700", textTransform: "uppercase" },
    total: { color: cores.texto, fontSize: 32, fontWeight: "900", lineHeight: 36 },
    blocoNotas: { alignItems: "flex-end" },
    numeroNotas: { color: cores.primariaEscura, fontSize: 20, fontWeight: "800" },
    barra: { backgroundColor: cores.primariaSuave, borderRadius: 999, height: 8, overflow: "hidden" },
    preenchimento: { backgroundColor: cores.primaria, borderRadius: 999, height: 8 },
    textoSecundario: { color: cores.textoSecundario, fontSize: 13, lineHeight: 18 },
    destaque: { color: cores.primariaEscura, fontWeight: "800" },
});
