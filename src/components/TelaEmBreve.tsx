import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";

type Props = {
    icone: keyof typeof Ionicons.glyphMap;
    titulo: string;
    descricao: string;
};

export function TelaEmBreve({ icone, titulo, descricao }: Props) {
    return (
        <View style={estilos.tela}>
            <View style={estilos.cartao}>
                <View style={estilos.icone}>
                    <Ionicons color={cores.primaria} name={icone} size={28} />
                </View>
                <Text style={estilos.titulo}>{titulo}</Text>
                <Text style={estilos.descricao}>{descricao}</Text>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    tela: { backgroundColor: cores.fundo, flex: 1, padding: 20 },
    cartao: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 18,
        borderWidth: 1,
        gap: 10,
        paddingHorizontal: 22,
        paddingVertical: 36,
    },
    icone: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 16,
        height: 64,
        justifyContent: "center",
        marginBottom: 6,
        width: 64,
    },
    titulo: { color: cores.texto, fontSize: 20, fontWeight: "800", textAlign: "center" },
    descricao: { color: cores.textoSecundario, fontSize: 15, lineHeight: 22, textAlign: "center" },
});
