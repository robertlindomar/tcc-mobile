import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { MissaoConsumidor } from "@/types/api";
import { formatarDataCivil } from "@/utils/formatarDataCivil";

type Props = {
    conclusao: MissaoConsumidor;
};

export function ItemMissaoConcluida({ conclusao }: Props) {
    const nome = conclusao.nomeMissao?.trim() || `Missão #${conclusao.missaoId}`;
    const pontos = conclusao.pontoRecompensa ?? 0;
    const data = formatarDataCivil(conclusao.dataCriacao.slice(0, 10));

    return (
        <View style={estilos.item}>
            <View style={estilos.texto}>
                <Text style={estilos.nome}>{nome}</Text>
                <Text style={estilos.data}>Concluída em {data}</Text>
            </View>
            <View style={estilos.selo}>
                <Text style={estilos.pontos}>+{pontos} pts</Text>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    item: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: "row",
        gap: 12,
        padding: 14,
    },
    texto: { flex: 1 },
    nome: { color: cores.texto, fontSize: 15, fontWeight: "700" },
    data: { color: cores.textoSecundario, fontSize: 13, marginTop: 4 },
    selo: { backgroundColor: cores.primariaSuave, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
    pontos: { color: cores.primaria, fontSize: 12, fontWeight: "800" },
});
