import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Linking,
    Pressable,
    RefreshControl,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { MensagemErro } from "@/components/MensagemErro";
import { CartaoProduto } from "@/features/lojas/components/CartaoProduto";
import { buscarLojaCatalogo } from "@/features/lojas/servicoLoja";
import { listarMissoesCatalogo } from "@/features/missoes/servicoCatalogoMissao";
import { listarOfertasCatalogo } from "@/features/lojas/servicoOferta";
import { listarProdutosCatalogo } from "@/features/lojas/servicoProduto";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { LojaCatalogoDetalhe, MissaoCatalogo, OfertaCatalogo, ProdutoCatalogo } from "@/types/api";
import { formatarDataCivil } from "@/utils/formatarDataCivil";

const LIMITE_OFERTAS = 2;
const LIMITE_MISSOES = 3;
const LIMITE_PRODUTOS = 4;

export default function TelaDetalheLoja() {
    const navigation = useNavigation();
    const parametros = useLocalSearchParams<{ id: string; nome?: string }>();
    const lojistaId = Number(parametros.id);
    const [loja, setLoja] = useState<LojaCatalogoDetalhe | null>(null);
    const [ofertas, setOfertas] = useState<OfertaCatalogo[]>([]);
    const [missoes, setMissoes] = useState<MissaoCatalogo[]>([]);
    const [produtos, setProdutos] = useState<ProdutoCatalogo[]>([]);
    const [todasOfertas, setTodasOfertas] = useState(false);
    const [todasMissoes, setTodasMissoes] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const nomeExibido = loja?.nomeFantasia ?? parametros.nome ?? "Loja";

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
            const [detalhe, ofertasLoja, missoesLoja, produtosLoja] = await Promise.all([
                buscarLojaCatalogo(lojistaId),
                listarOfertasCatalogo(lojistaId),
                listarMissoesCatalogo(lojistaId),
                listarProdutosCatalogo(lojistaId),
            ]);
            setLoja(detalhe);
            setOfertas(ofertasLoja);
            setMissoes(missoesLoja);
            setProdutos(produtosLoja);
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

    useEffect(() => {
        navigation.setOptions({
            title: "",
            headerRight: () => (
                <AcoesCabecalho endereco={loja?.enderecoTexto ?? null} nome={nomeExibido} />
            ),
        });
    }, [loja?.enderecoTexto, nomeExibido, navigation]);

    const ofertasVisiveis = useMemo(
        () => (todasOfertas ? ofertas : ofertas.slice(0, LIMITE_OFERTAS)),
        [ofertas, todasOfertas],
    );
    const missoesVisiveis = useMemo(
        () => (todasMissoes ? missoes : missoes.slice(0, LIMITE_MISSOES)),
        [missoes, todasMissoes],
    );

    if (carregando) {
        return (
            <View style={estilos.centralizado}>
                <ActivityIndicator color={cores.primaria} size="large" />
            </View>
        );
    }

    if (erro && !loja) {
        return (
            <View style={estilos.conteudoErro}>
                <MensagemErro mensagem={erro} />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={estilos.conteudo}
            refreshControl={
                <RefreshControl
                    colors={[cores.primaria]}
                    onRefresh={() => void carregar(true)}
                    refreshing={atualizando}
                />
            }
        >
            <View style={estilos.identidade}>
                <View style={estilos.iconeLoja}>
                    <Ionicons color={cores.primaria} name="storefront" size={28} />
                </View>
                <View style={estilos.identidadeTexto}>
                    <Text style={estilos.nomeLoja}>{nomeExibido}</Text>
                    <Text style={estilos.subtituloLoja}>Loja participante</Text>
                </View>
            </View>

            <View style={estilos.acoes}>
                <BotaoAtalho
                    icone="call-outline"
                    rotulo="Ligar"
                    aoPressionar={() =>
                        Alert.alert("Telefone indisponível", "Esta loja ainda não informou um telefone de contato.")
                    }
                />
                <BotaoAtalho
                    icone="navigate-outline"
                    rotulo="Como chegar"
                    aoPressionar={() => void abrirMapa(loja?.enderecoTexto ?? null)}
                />
                <BotaoAtalho
                    icone="globe-outline"
                    rotulo="Site"
                    aoPressionar={() =>
                        Alert.alert("Site indisponível", "Esta loja ainda não informou um site.")
                    }
                />
            </View>

            {loja?.enderecoTexto ? (
                <View style={estilos.linhaInfo}>
                    <Ionicons color={cores.primaria} name="location-outline" size={18} />
                    <Text style={estilos.textoInfo}>{loja.enderecoTexto}</Text>
                </View>
            ) : null}

            <Secao
                titulo="Ofertas da loja"
                verTodas={ofertas.length > LIMITE_OFERTAS}
                expandido={todasOfertas}
                aoVerTodas={() => setTodasOfertas((atual) => !atual)}
            >
                {ofertasVisiveis.length === 0 ? (
                    <Text style={estilos.vazio}>Nenhuma oferta vigente no momento.</Text>
                ) : (
                    ofertasVisiveis.map((oferta) => <CartaoOferta key={oferta.id} oferta={oferta} />)
                )}
            </Secao>

            <Secao
                titulo="Missões disponíveis"
                verTodas={missoes.length > LIMITE_MISSOES}
                expandido={todasMissoes}
                aoVerTodas={() => setTodasMissoes((atual) => !atual)}
            >
                {missoesVisiveis.length === 0 ? (
                    <Text style={estilos.vazio}>Nenhuma missão disponível nesta loja.</Text>
                ) : (
                    missoesVisiveis.map((missao) => <LinhaMissao key={missao.id} missao={missao} />)
                )}
            </Secao>

            <Secao
                titulo="Produtos"
                verTodas={produtos.length > LIMITE_PRODUTOS}
                rotuloVerTodas="Ver todos"
                aoVerTodas={() =>
                    router.push({
                        pathname: "/lojas/[id]/produtos",
                        params: { id: String(lojistaId), nome: nomeExibido },
                    })
                }
            >
                {produtos.length === 0 ? (
                    <Text style={estilos.vazio}>Nenhum produto com foto nesta loja.</Text>
                ) : (
                    <View style={estilos.gradeProdutos}>
                        {produtos.slice(0, LIMITE_PRODUTOS).map((produto) => (
                            <CartaoProduto key={produto.id} produto={produto} />
                        ))}
                    </View>
                )}
            </Secao>

            <View style={estilos.cta}>
                <Ionicons color={cores.ouro} name="star" size={22} />
                <Text style={estilos.textoCta}>
                    <Text style={estilos.ctaNegrito}>Visite a loja física! </Text>
                    Campanhas e recompensas valem nas lojas participantes.
                </Text>
            </View>
        </ScrollView>
    );
}

function AcoesCabecalho({ nome, endereco }: { nome: string; endereco: string | null }) {
    return (
        <View style={estilos.acoesCabecalho}>
            <Pressable
                accessibilityLabel="Favoritar loja"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() =>
                    Alert.alert("Em breve", "Você poderá favoritar lojas em uma próxima versão.")
                }
            >
                <Ionicons color={cores.perigo} name="heart-outline" size={22} />
            </Pressable>
            <Pressable
                accessibilityLabel="Compartilhar loja"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() =>
                    void Share.share({
                        message: endereco ? `${nome}\n${endereco}` : nome,
                    })
                }
            >
                <Ionicons color={cores.texto} name="share-social-outline" size={22} />
            </Pressable>
        </View>
    );
}

function BotaoAtalho({
    icone,
    rotulo,
    aoPressionar,
}: {
    icone: keyof typeof Ionicons.glyphMap;
    rotulo: string;
    aoPressionar: () => void;
}) {
    return (
        <Pressable
            accessibilityRole="button"
            onPress={aoPressionar}
            style={({ pressed }) => [estilos.botaoAtalho, pressed && estilos.pressionado]}
        >
            <Ionicons color={cores.primaria} name={icone} size={18} />
            <Text style={estilos.rotuloAtalho}>{rotulo}</Text>
        </Pressable>
    );
}

function Secao({
    titulo,
    children,
    verTodas,
    expandido,
    rotuloVerTodas = "Ver todas",
    aoVerTodas,
}: {
    titulo: string;
    children: ReactNode;
    verTodas?: boolean;
    expandido?: boolean;
    rotuloVerTodas?: string;
    aoVerTodas?: () => void;
}) {
    return (
        <View style={estilos.secao}>
            <View style={estilos.cabecalhoSecao}>
                <Text style={estilos.tituloSecao}>{titulo}</Text>
                {verTodas && aoVerTodas ? (
                    <Pressable accessibilityRole="button" onPress={aoVerTodas}>
                        <Text style={estilos.verTodas}>{expandido ? "Ver menos" : rotuloVerTodas}</Text>
                    </Pressable>
                ) : null}
            </View>
            {children}
        </View>
    );
}

function CartaoOferta({ oferta }: { oferta: OfertaCatalogo }) {
    const titulo = oferta.descricao?.trim() || oferta.produtoNome;
    const selo = oferta.percentualDesconto ? `${oferta.percentualDesconto}% OFF` : "Oferta";

    return (
        <View style={estilos.cartaoOferta}>
            <View style={estilos.ofertaTexto}>
                <Text style={estilos.ofertaTitulo}>{titulo}</Text>
                <Text style={estilos.ofertaValidade}>Válido até {formatarDataCivil(oferta.dataFimCivil)}</Text>
            </View>
            <View style={estilos.selo}>
                <Text style={estilos.textoSelo}>{selo}</Text>
            </View>
        </View>
    );
}

function LinhaMissao({ missao }: { missao: MissaoCatalogo }) {
    return (
        <View style={estilos.linhaMissao}>
            <Text style={estilos.nomeMissao}>{missao.nome}</Text>
            <View style={estilos.seloPontos}>
                <Text style={estilos.textoSeloPontos}>+{missao.pontoRecompensa} pts</Text>
            </View>
        </View>
    );
}

async function abrirMapa(endereco: string | null) {
    if (!endereco) {
        Alert.alert("Endereço indisponível", "Esta loja ainda não cadastrou um endereço.");
        return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
    await Linking.openURL(url);
}

const estilos = StyleSheet.create({
    centralizado: { alignItems: "center", backgroundColor: cores.fundo, flex: 1, justifyContent: "center" },
    conteudoErro: { backgroundColor: cores.fundo, flex: 1, padding: 20 },
    conteudo: { backgroundColor: cores.fundo, gap: 18, padding: 20, paddingBottom: 36 },
    acoesCabecalho: { flexDirection: "row", gap: 16, marginRight: 4 },
    identidade: { alignItems: "center", flexDirection: "row", gap: 14 },
    iconeLoja: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 16,
        height: 64,
        justifyContent: "center",
        width: 64,
    },
    identidadeTexto: { flex: 1 },
    nomeLoja: { color: cores.texto, fontSize: 22, fontWeight: "800" },
    subtituloLoja: { color: cores.textoSecundario, fontSize: 14, marginTop: 4 },
    acoes: { flexDirection: "row", gap: 8 },
    botaoAtalho: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 14,
        borderWidth: 1,
        flex: 1,
        gap: 6,
        paddingVertical: 12,
    },
    pressionado: { opacity: 0.85 },
    rotuloAtalho: { color: cores.texto, fontSize: 12, fontWeight: "700" },
    linhaInfo: { alignItems: "flex-start", flexDirection: "row", gap: 8 },
    textoInfo: { color: cores.textoSecundario, flex: 1, fontSize: 14, lineHeight: 20 },
    secao: { gap: 10 },
    cabecalhoSecao: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
    tituloSecao: { color: cores.texto, fontSize: 17, fontWeight: "800" },
    verTodas: { color: cores.primaria, fontSize: 13, fontWeight: "700" },
    vazio: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20 },
    cartaoOferta: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: "row",
        gap: 12,
        padding: 14,
    },
    ofertaTexto: { flex: 1 },
    ofertaTitulo: { color: cores.texto, fontSize: 15, fontWeight: "700" },
    ofertaValidade: { color: cores.textoSecundario, fontSize: 13, marginTop: 4 },
    selo: { backgroundColor: cores.ouroSuave, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    textoSelo: { color: cores.ouro, fontSize: 12, fontWeight: "800" },
    linhaMissao: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    nomeMissao: { color: cores.texto, flex: 1, fontSize: 14, fontWeight: "600" },
    seloPontos: { backgroundColor: cores.ouroSuave, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
    textoSeloPontos: { color: cores.ouro, fontSize: 12, fontWeight: "800" },
    gradeProdutos: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
    cta: {
        alignItems: "flex-start",
        backgroundColor: cores.ctaFundo,
        borderRadius: 16,
        flexDirection: "row",
        gap: 10,
        padding: 16,
    },
    textoCta: { color: cores.texto, flex: 1, fontSize: 14, lineHeight: 20 },
    ctaNegrito: { fontWeight: "800" },
});
