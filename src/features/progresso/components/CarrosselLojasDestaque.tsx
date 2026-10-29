import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LogoLoja } from "@/features/lojas/components/LogoLoja";
import { rotuloOfertas } from "@/features/progresso/regrasProgresso";
import { cores } from "@/styles/tema";
import { LojaDestaque } from "@/types/api";

const LARGURA_CARTAO = 230;
const ESPACO = 12;

/** Carrossel horizontal das lojas com mais ofertas vigentes. */
export function CarrosselLojasDestaque({ lojas }: { lojas: LojaDestaque[] }) {
    const [indiceAtual, setIndiceAtual] = useState(0);

    function aoRolar(evento: NativeSyntheticEvent<NativeScrollEvent>) {
        const indice = Math.round(evento.nativeEvent.contentOffset.x / (LARGURA_CARTAO + ESPACO));
        setIndiceAtual(Math.min(Math.max(indice, 0), lojas.length - 1));
    }

    if (lojas.length === 0) {
        return (
            <View style={estilos.vazio}>
                <Ionicons color={cores.textoSecundario} name="storefront-outline" size={24} />
                <Text style={estilos.textoVazio}>Nenhuma loja em destaque agora.</Text>
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            <ScrollView
                contentContainerStyle={estilos.trilho}
                decelerationRate="fast"
                horizontal
                onMomentumScrollEnd={aoRolar}
                showsHorizontalScrollIndicator={false}
                snapToInterval={LARGURA_CARTAO + ESPACO}
            >
                {lojas.map((loja, indice) => (
                    <Pressable
                        accessibilityHint="Abre a loja"
                        accessibilityLabel={`${loja.nomeFantasia}, ${rotuloOfertas(loja)}`}
                        accessibilityRole="button"
                        key={loja.id}
                        onPress={() =>
                            router.push({
                                pathname: "/lojas/[id]",
                                params: { id: String(loja.id), nome: loja.nomeFantasia },
                            })
                        }
                        style={({ pressed }) => [
                            estilos.cartao,
                            indice % 2 === 1 && estilos.cartaoAlternado,
                            pressed && estilos.pressionado,
                        ]}
                    >
                        <View style={estilos.circulo} />
                        {loja.maiorDesconto ? (
                            <View style={estilos.selo}>
                                <Text style={estilos.textoSelo}>-{loja.maiorDesconto}%</Text>
                            </View>
                        ) : null}
                        <LogoLoja nome={loja.nomeFantasia} tamanho={56} urlLogo={loja.urlLogo} />
                        <Text numberOfLines={1} style={estilos.nome}>
                            {loja.nomeFantasia}
                        </Text>
                        <View style={estilos.linhaOfertas}>
                            <Ionicons color="#FFFFFF" name="pricetags" size={14} />
                            <Text numberOfLines={1} style={estilos.ofertas}>
                                {rotuloOfertas(loja)}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
            {lojas.length > 1 ? (
                <View style={estilos.pontos}>
                    {lojas.map((loja, indice) => (
                        <View key={loja.id} style={[estilos.ponto, indice === indiceAtual && estilos.pontoAtivo]} />
                    ))}
                </View>
            ) : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { gap: 10, marginHorizontal: -20 },
    trilho: { gap: ESPACO, paddingHorizontal: 20 },
    cartao: {
        backgroundColor: cores.primaria,
        borderRadius: 22,
        gap: 8,
        minHeight: 168,
        overflow: "hidden",
        padding: 16,
        width: LARGURA_CARTAO,
    },
    cartaoAlternado: { backgroundColor: cores.sidebar },
    pressionado: { opacity: 0.9, transform: [{ scale: 0.98 }] },
    circulo: {
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 999,
        height: 150,
        position: "absolute",
        right: -50,
        top: -50,
        width: 150,
    },
    selo: {
        backgroundColor: cores.coral,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        position: "absolute",
        right: 12,
        top: 12,
    },
    textoSelo: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
    nome: { color: "#FFFFFF", fontSize: 17, fontWeight: "900", marginTop: 6 },
    linhaOfertas: { alignItems: "center", flexDirection: "row", gap: 6 },
    ofertas: { color: "rgba(255,255,255,0.9)", flex: 1, fontSize: 13, fontWeight: "600" },
    pontos: { flexDirection: "row", gap: 6, justifyContent: "center" },
    ponto: { backgroundColor: cores.borda, borderRadius: 999, height: 6, width: 6 },
    pontoAtivo: { backgroundColor: cores.primaria, width: 18 },
    vazio: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 18,
        borderWidth: 1,
        flexDirection: "row",
        gap: 10,
        padding: 16,
    },
    textoVazio: { color: cores.textoSecundario, fontSize: 14 },
});
