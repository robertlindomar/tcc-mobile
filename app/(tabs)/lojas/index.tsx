import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { FundoPastel } from "@/components/FundoPastel";
import { MensagemErro } from "@/components/MensagemErro";
import { TelaEmBreve } from "@/components/TelaEmBreve";
import { listarLojasCatalogo } from "@/features/lojas/servicoLoja";
import { obterLocalizacaoConsumidor } from "@/features/lojas/servicoLocalizacao";
import { formatarDistancia } from "@/features/lojas/formatarDistancia";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { LojaCatalogo } from "@/types/api";

export default function TelaLojas() {
    const [lojas, setLojas] = useState<LojaCatalogo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const carregar = useCallback(async (silencioso = false) => {
        if (silencioso) {
            setAtualizando(true);
        } else {
            setCarregando(true);
        }
        setErro(null);
        try {
            const localizacao = await obterLocalizacaoConsumidor();
            setLojas(await listarLojasCatalogo(localizacao ?? undefined));
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

    useEffect(() => {
        void carregar();
    }, [carregar]);

    if (carregando) {
        return (
            <FundoPastel>
                <View style={estilos.centralizado}>
                    <ActivityIndicator color={cores.primaria} size="large" />
                </View>
            </FundoPastel>
        );
    }

    if (erro && lojas.length === 0) {
        return (
            <FundoPastel>
                <View style={estilos.conteudo}>
                    <MensagemErro mensagem={erro} />
                </View>
            </FundoPastel>
        );
    }

    if (lojas.length === 0) {
        return (
            <TelaEmBreve
                descricao="Ainda não há lojas aprovadas para exibir no aplicativo."
                icone="storefront-outline"
                titulo="Nenhuma loja por aqui"
            />
        );
    }

    return (
        <FundoPastel>
            <FlatList
                contentContainerStyle={estilos.lista}
                data={lojas}
                keyExtractor={(item) => String(item.id)}
                refreshControl={
                    <RefreshControl
                        colors={[cores.primaria]}
                        onRefresh={() => void carregar(true)}
                        refreshing={atualizando}
                    />
                }
                renderItem={({ item }) => (
                    <Pressable
                        accessibilityHint="Abre os produtos desta loja"
                        accessibilityLabel={item.nomeFantasia}
                        accessibilityRole="button"
                        onPress={() =>
                            router.push({
                                pathname: "/lojas/[id]",
                                params: { id: String(item.id), nome: item.nomeFantasia },
                            })
                        }
                        style={({ pressed }) => [estilos.cartao, pressed && estilos.cartaoPressionado]}
                    >
                        <View style={estilos.icone}>
                            <Ionicons color={cores.primaria} name="storefront-outline" size={22} />
                        </View>
                        <View style={estilos.texto}>
                            <Text style={estilos.nome}>{item.nomeFantasia}</Text>
                            <Text style={estilos.subtitulo}>
                                {item.distanciaKm != null
                                    ? formatarDistancia(item.distanciaKm)
                                    : "Ver produtos"}
                            </Text>
                        </View>
                        <Ionicons color={cores.textoSecundario} name="chevron-forward" size={20} />
                    </Pressable>
                )}
                style={estilos.listaScroll}
            />
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    centralizado: { alignItems: "center", flex: 1, justifyContent: "center" },
    conteudo: { flex: 1, padding: 20 },
    listaScroll: { backgroundColor: "transparent", flex: 1 },
    lista: { flexGrow: 1, gap: 12, padding: 20 },
    cartao: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: "row",
        gap: 14,
        padding: 16,
    },
    cartaoPressionado: { opacity: 0.86 },
    icone: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 14,
        height: 48,
        justifyContent: "center",
        width: 48,
    },
    texto: { flex: 1 },
    nome: { color: cores.texto, fontSize: 16, fontWeight: "700" },
    subtitulo: { color: cores.textoSecundario, fontSize: 13, marginTop: 3 },
});
