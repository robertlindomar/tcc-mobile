import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { descreverTicketsNota, formatarCnpj, formatarDataHora } from "@/features/nfce/regrasExtrato";
import { cores } from "@/styles/tema";
import { NotaLidaCampanha } from "@/types/api";
import { formatarMoeda } from "@/utils/formatarMoeda";

/** Lista das NFC-e lidas pelo consumidor na edição atual (mais recentes primeiro). */
export function HistoricoNotasLidas({ notas }: { notas: NotaLidaCampanha[] }) {
    return (
        <View style={estilos.secao}>
            <Text style={estilos.titulo}>Notas lidas</Text>
            {notas.length === 0 ? (
                <View style={estilos.vazio}>
                    <Ionicons color={cores.textoSecundario} name="receipt-outline" size={28} />
                    <Text style={estilos.textoVazio}>Nenhuma nota lida nesta campanha ainda.</Text>
                </View>
            ) : (
                notas.map((nota) => <ItemNotaLida key={nota.id} nota={nota} />)
            )}
        </View>
    );
}

function ItemNotaLida({ nota }: { nota: NotaLidaCampanha }) {
    const gerouTicket = nota.ticketsGerados > 0;
    return (
        <View style={estilos.item}>
            <View style={estilos.iconeLoja}>
                <Ionicons color={cores.primaria} name="storefront-outline" size={20} />
            </View>
            <View style={estilos.dadosLoja}>
                <Text numberOfLines={1} style={estilos.nomeLoja}>
                    {nota.loja.nome}
                </Text>
                <Text style={estilos.meta}>CNPJ {formatarCnpj(nota.loja.cnpj)}</Text>
                <Text style={estilos.meta}>Lida em {formatarDataHora(nota.dataLeitura)}</Text>
            </View>
            <View style={estilos.valores}>
                <Text style={estilos.valor}>{formatarMoeda(nota.valorNota)}</Text>
                <Text style={[estilos.tickets, !gerouTicket && estilos.semTicket]}>
                    {descreverTicketsNota(nota)}
                </Text>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    secao: { gap: 8 },
    titulo: { color: cores.texto, fontSize: 15, fontWeight: "800" },
    vazio: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        gap: 6,
        padding: 20,
    },
    textoVazio: { color: cores.textoSecundario, fontSize: 13, textAlign: "center" },
    item: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: "row",
        gap: 12,
        padding: 12,
    },
    iconeLoja: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 12,
        height: 40,
        justifyContent: "center",
        width: 40,
    },
    dadosLoja: { flex: 1, gap: 1 },
    nomeLoja: { color: cores.texto, fontSize: 14, fontWeight: "800" },
    meta: { color: cores.textoSecundario, fontSize: 12 },
    valores: { alignItems: "flex-end", gap: 2, maxWidth: 130 },
    valor: { color: cores.texto, fontSize: 15, fontWeight: "900" },
    tickets: { color: cores.primariaEscura, fontSize: 12, fontWeight: "700", textAlign: "right" },
    semTicket: { color: cores.textoSecundario, fontWeight: "500" },
});
