import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { OfertaCatalogo } from "@/types/api";
import { formatarDataCivil } from "@/utils/formatarDataCivil";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { urlPublicaArquivo } from "@/utils/urlPublicaArquivo";

type Props = {
    oferta: OfertaCatalogo;
    urlImagem?: string | null;
    valorOriginal?: number | null;
};

export function CartaoOferta({ oferta, urlImagem = null, valorOriginal = null }: Props) {
    const titulo = oferta.descricao?.trim() || oferta.produtoNome;
    const uri = urlPublicaArquivo(urlImagem);
    const selo = oferta.percentualDesconto ? `${oferta.percentualDesconto}% OFF` : "Oferta";
    const mostrarOriginal =
        valorOriginal != null && Number.isFinite(valorOriginal) && valorOriginal > oferta.preco;

    return (
        <View style={estilos.cartao}>
            <View style={estilos.areaFoto}>
                {uri ? (
                    <Image
                        accessibilityIgnoresInvertColors
                        accessibilityLabel={titulo}
                        source={{ uri }}
                        style={estilos.foto}
                    />
                ) : (
                    <View style={estilos.fotoVazia}>
                        <Ionicons color={cores.textoSecundario} name="pricetag-outline" size={28} />
                    </View>
                )}
                <View style={estilos.selo}>
                    <Text style={estilos.textoSelo}>{selo}</Text>
                </View>
            </View>
            <View style={estilos.dados}>
                <Text numberOfLines={2} style={estilos.nome}>
                    {titulo}
                </Text>
                <View style={estilos.precos}>
                    {mostrarOriginal ? (
                        <Text style={estilos.valorOriginal}>{formatarMoeda(valorOriginal)}</Text>
                    ) : null}
                    <Text style={estilos.valor}>{formatarMoeda(oferta.preco)}</Text>
                </View>
                <Text style={estilos.validade}>Até {formatarDataCivil(oferta.dataFimCivil)}</Text>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        overflow: "hidden",
        width: 168,
    },
    areaFoto: { position: "relative" },
    foto: { backgroundColor: cores.primariaSuave, height: 120, width: "100%" },
    fotoVazia: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        height: 120,
        justifyContent: "center",
        width: "100%",
    },
    selo: {
        backgroundColor: cores.ouroSuave,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        position: "absolute",
        right: 8,
        top: 8,
    },
    textoSelo: { color: cores.ouro, fontSize: 11, fontWeight: "800" },
    dados: { gap: 4, padding: 12 },
    nome: { color: cores.texto, fontSize: 14, fontWeight: "700", minHeight: 36 },
    precos: { alignItems: "baseline", flexDirection: "row", flexWrap: "wrap", gap: 6 },
    valorOriginal: {
        color: cores.textoSecundario,
        fontSize: 12,
        fontWeight: "600",
        textDecorationLine: "line-through",
    },
    valor: { color: cores.primaria, fontSize: 15, fontWeight: "800" },
    validade: { color: cores.textoSecundario, fontSize: 12, marginTop: 2 },
});
