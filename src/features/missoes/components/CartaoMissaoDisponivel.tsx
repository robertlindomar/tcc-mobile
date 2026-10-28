import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { MissaoDisponivel } from "@/types/api";

type Props = {
    missao: MissaoDisponivel;
    onRealizar: (missao: MissaoDisponivel) => void;
};

export function CartaoMissaoDisponivel({ missao, onRealizar }: Props) {
    return (
        <View style={estilos.cartao}>
            <View style={estilos.texto}>
                <Text style={estilos.nome}>{missao.nome}</Text>
                <View style={estilos.linhaLoja}>
                    <Ionicons color={cores.textoSecundario} name="storefront-outline" size={14} />
                    <Text style={estilos.loja}>{missao.nomeLoja}</Text>
                </View>
                {missao.descricao ? <Text style={estilos.descricao}>{missao.descricao}</Text> : null}
            </View>
            <View style={estilos.selos}>
                {missao.sistema ? (
                    <View style={estilos.seloSistema}>
                        <Text style={estilos.textoSistema}>Sistema</Text>
                    </View>
                ) : null}
                <View style={estilos.seloPontos}>
                    <Text style={estilos.textoPontos}>+{missao.pontoRecompensa} pts</Text>
                </View>
            </View>
            <Pressable
                accessibilityLabel={`Realizar missão ${missao.nome}`}
                accessibilityRole="button"
                onPress={() => onRealizar(missao)}
                style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
            >
                <Ionicons color="#FFFFFF" name="qr-code-outline" size={18} />
                <Text style={estilos.textoBotao}>Realizar missão</Text>
            </Pressable>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        gap: 10,
        padding: 16,
    },
    texto: { gap: 4 },
    nome: { color: cores.texto, fontSize: 15, fontWeight: "700" },
    linhaLoja: { alignItems: "center", flexDirection: "row", gap: 4 },
    loja: { color: cores.textoSecundario, fontSize: 13 },
    descricao: { color: cores.textoSecundario, fontSize: 13, lineHeight: 18 },
    selos: { alignItems: "center", flexDirection: "row", gap: 8 },
    seloSistema: {
        backgroundColor: cores.primariaSuave,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    textoSistema: { color: cores.primaria, fontSize: 11, fontWeight: "700" },
    seloPontos: {
        backgroundColor: cores.ouroSuave,
        borderRadius: 999,
        marginLeft: "auto",
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    textoPontos: { color: cores.ouro, fontSize: 12, fontWeight: "800" },
    botao: {
        alignItems: "center",
        backgroundColor: cores.primaria,
        borderRadius: 999,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        marginTop: 2,
        paddingVertical: 12,
    },
    pressionado: { opacity: 0.88 },
    textoBotao: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
});
