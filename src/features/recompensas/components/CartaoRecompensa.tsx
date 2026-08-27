import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    podeResgatar,
    rotuloBotaoResgate,
} from "@/features/recompensas/regrasRecompensa";
import { cores } from "@/styles/tema";
import { RecompensaCatalogo } from "@/types/api";

type Props = {
    recompensa: RecompensaCatalogo;
    pontos: number;
    resgatando: boolean;
    onResgatar: (recompensa: RecompensaCatalogo) => void;
};

export function CartaoRecompensa({ recompensa, pontos, resgatando, onResgatar }: Props) {
    const habilitado = podeResgatar(recompensa, pontos) && !resgatando;
    const rotulo = rotuloBotaoResgate(recompensa, pontos, resgatando);

    return (
        <View style={estilos.cartao}>
            <View style={estilos.texto}>
                <Text style={estilos.nome}>{recompensa.nome}</Text>
                {recompensa.nomeLoja ? (
                    <View style={estilos.linhaLoja}>
                        <Ionicons color={cores.textoSecundario} name="storefront-outline" size={14} />
                        <Text style={estilos.loja}>{recompensa.nomeLoja}</Text>
                    </View>
                ) : null}
                {recompensa.descricao ? (
                    <Text style={estilos.descricao}>{recompensa.descricao}</Text>
                ) : null}
                <Text style={estilos.meta}>
                    {recompensa.estoque === null
                        ? "Estoque ilimitado"
                        : `${recompensa.estoque} restantes`}
                    {recompensa.dataFimCivil ? ` · válida até ${recompensa.dataFimCivil}` : ""}
                </Text>
            </View>
            <View style={estilos.rodape}>
                <View style={estilos.seloPontos}>
                    <Text style={estilos.textoPontos}>{recompensa.custoPontos} pts</Text>
                </View>
                <Pressable
                    accessibilityRole="button"
                    disabled={!habilitado}
                    onPress={() => onResgatar(recompensa)}
                    style={({ pressed }) => [
                        estilos.botao,
                        !habilitado && estilos.botaoDesabilitado,
                        pressed && habilitado && estilos.pressionado,
                    ]}
                >
                    <Text style={[estilos.textoBotao, !habilitado && estilos.textoBotaoDesabilitado]}>
                        {rotulo}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        padding: 14,
    },
    texto: { gap: 4 },
    nome: { color: cores.texto, fontSize: 15, fontWeight: "700" },
    linhaLoja: { alignItems: "center", flexDirection: "row", gap: 4 },
    loja: { color: cores.textoSecundario, fontSize: 13 },
    descricao: { color: cores.textoSecundario, fontSize: 13, lineHeight: 18 },
    meta: { color: cores.textoSecundario, fontSize: 12, marginTop: 2 },
    rodape: { alignItems: "center", flexDirection: "row", gap: 10 },
    seloPontos: {
        backgroundColor: cores.ouroSuave,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    textoPontos: { color: cores.ouro, fontSize: 12, fontWeight: "800" },
    botao: {
        backgroundColor: cores.primaria,
        borderRadius: 10,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    botaoDesabilitado: { backgroundColor: cores.borda },
    pressionado: { opacity: 0.85 },
    textoBotao: { color: "#FFFFFF", fontSize: 13, fontWeight: "700", textAlign: "center" },
    textoBotaoDesabilitado: { color: cores.textoSecundario },
});
