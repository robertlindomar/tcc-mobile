import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { ResgateRecompensa } from "@/types/api";

type Props = {
    resgate: ResgateRecompensa;
};

function formatarData(dataIso: string) {
    return new Date(dataIso).toLocaleString("pt-BR");
}

export function ItemResgate({ resgate }: Props) {
    const status =
        resgate.status === "PENDENTE_ENTREGA"
            ? "Retire na loja"
            : resgate.status === "RECUSADO"
              ? "Recusado · pontos devolvidos"
              : "Entregue";

    return (
        <View style={estilos.item}>
            <Text style={estilos.nome}>{resgate.nomeRecompensaSnapshot}</Text>
            <Text style={estilos.detalhe}>
                {resgate.custoPontosSnapshot} pts · {status}
            </Text>
            <Text style={estilos.data}>Resgatado em {formatarData(resgate.dataCriacao)}</Text>
            {resgate.dataEntrega ? (
                <Text style={estilos.data}>
                    Entregue em {formatarData(resgate.dataEntrega)}
                </Text>
            ) : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    item: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        gap: 4,
        padding: 14,
    },
    nome: { color: cores.texto, fontSize: 15, fontWeight: "700" },
    detalhe: { color: cores.textoSecundario, fontSize: 13 },
    data: { color: cores.textoSecundario, fontSize: 12 },
});
