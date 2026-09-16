import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { FundoPastel } from "@/components/FundoPastel";
import { MensagemErro } from "@/components/MensagemErro";
import { TelaEmBreve } from "@/components/TelaEmBreve";
import { CartaoProduto } from "@/features/lojas/components/CartaoProduto";
import { listarProdutosCatalogo } from "@/features/lojas/servicoProduto";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { ProdutoCatalogo } from "@/types/api";

export default function TelaProdutosLoja() {
    const navigation = useNavigation();
    const parametros = useLocalSearchParams<{ id: string; nome?: string }>();
    const lojistaId = Number(parametros.id);
    const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        navigation.setOptions({ title: parametros.nome ? `Produtos · ${parametros.nome}` : "Produtos" });
    }, [navigation, parametros.nome]);

    const carregar = useCallback(async (silencioso = false) => {
        if (!Number.isInteger(lojistaId) || lojistaId <= 0) {
            setErro("Loja inválida.");
            setCarregando(false);
            return;
        }
        if (silencioso) {
            setAtualizando(true);
        } else {
            setCarregando(true);
        }
        setErro(null);
        try {
            setProdutos(await listarProdutosCatalogo(lojistaId));
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [lojistaId]);

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

    if (erro && produtos.length === 0) {
        return (
            <FundoPastel>
                <View style={estilos.conteudo}>
                    <MensagemErro mensagem={erro} />
                </View>
            </FundoPastel>
        );
    }

    if (produtos.length === 0) {
        return (
            <TelaEmBreve
                descricao="Esta loja ainda não publicou produtos com foto."
                icone="cube-outline"
                titulo="Nenhum produto"
            />
        );
    }

    return (
        <FundoPastel>
            <FlatList
                columnWrapperStyle={estilos.linha}
                contentContainerStyle={estilos.lista}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                refreshControl={
                    <RefreshControl
                        colors={[cores.primaria]}
                        onRefresh={() => void carregar(true)}
                        refreshing={atualizando}
                    />
                }
                renderItem={({ item }) => <CartaoProduto produto={item} />}
                style={estilos.listaScroll}
            />
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    centralizado: { alignItems: "center", flex: 1, justifyContent: "center" },
    conteudo: { flex: 1, padding: 20 },
    listaScroll: { backgroundColor: "transparent", flex: 1 },
    lista: { flexGrow: 1, padding: 16 },
    linha: { gap: 12, justifyContent: "space-between", marginBottom: 12 },
});
