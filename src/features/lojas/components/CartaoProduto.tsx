import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { ProdutoCatalogo } from "@/types/api";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { urlPublicaArquivo } from "@/utils/urlPublicaArquivo";

export function CartaoProduto({ produto }: { produto: ProdutoCatalogo }) {
    const uri = urlPublicaArquivo(produto.urlImagem);

    return (
        <View style={estilos.cartao}>
            {uri ? (
                <Image
                    accessibilityIgnoresInvertColors
                    accessibilityLabel={produto.nome}
                    source={{ uri }}
                    style={estilos.foto}
                />
            ) : (
                <View style={estilos.fotoVazia}>
                    <Ionicons color={cores.textoSecundario} name="image-outline" size={28} />
                </View>
            )}
            <View style={estilos.dados}>
                <Text numberOfLines={2} style={estilos.nome}>
                    {produto.nome}
                </Text>
                <Text style={estilos.valor}>{formatarMoeda(produto.valor)}</Text>
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
        overflow: "hidden",
        width: "48%",
    },
    foto: { backgroundColor: cores.primariaSuave, height: 120, width: "100%" },
    fotoVazia: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        height: 120,
        justifyContent: "center",
        width: "100%",
    },
    dados: { gap: 6, padding: 12 },
    nome: { color: cores.texto, fontSize: 14, fontWeight: "700" },
    valor: { color: cores.primaria, fontSize: 15, fontWeight: "800" },
});
