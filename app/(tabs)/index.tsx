import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { FundoPastel } from "@/components/FundoPastel";
import { MensagemErro } from "@/components/MensagemErro";
import { useSessao } from "@/features/auth/ContextoSessao";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";

export default function TelaInicio() {
    const { perfil, atualizarPerfil } = useSessao();
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const primeiroNome = perfil?.usuario.nome.trim().split(/\s+/)[0] ?? "";

    async function atualizar() {
        setAtualizando(true);
        setErro(null);
        try {
            await atualizarPerfil();
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setAtualizando(false);
        }
    }

    return (
        <FundoPastel>
            <ScrollView
                contentContainerStyle={estilos.conteudo}
                refreshControl={
                    <RefreshControl
                        colors={[cores.primaria]}
                        onRefresh={() => void atualizar()}
                        refreshing={atualizando}
                    />
                }
                style={estilos.scroll}
            >
                <Text style={estilos.saudacao}>Olá, {primeiroNome} 👋</Text>
                <Text style={estilos.introducao}>
                    Seu progresso está sempre atualizado pelo Conecta Comércio.
                </Text>
                <MensagemErro mensagem={erro} />
                <View style={estilos.linhaCards}>
                    <View style={[estilos.cardDestaque, estilos.cardPontos]}>
                        <View style={estilos.brilho} />
                        <View style={estilos.linhaSparkles}>
                            <Ionicons color="#FFFFFF" name="sparkles" size={18} />
                            <Ionicons color="rgba(255,255,255,0.85)" name="sparkles" size={14} />
                            <Ionicons color="rgba(255,255,255,0.7)" name="sparkles" size={12} />
                        </View>
                        <Text style={estilos.rotuloDestaque}>Seus pontos</Text>
                        <Text style={estilos.numeroDestaque}>{perfil?.consumidor.pontos ?? 0} pts</Text>
                    </View>
                    <View style={[estilos.cardDestaque, estilos.cardNivel]}>
                        <Ionicons color={cores.primaria} name="ribbon-outline" size={25} />
                        <Text style={estilos.rotuloNivel}>Nível</Text>
                        <Text style={estilos.numeroNivel}>{perfil?.consumidor.nivel ?? 1}</Text>
                    </View>
                </View>
                <View style={estilos.cartaoInformativo}>
                    <View style={estilos.iconeInformativo}>
                        <Ionicons color={cores.primaria} name="storefront-outline" size={24} />
                    </View>
                    <View style={estilos.textoInformativo}>
                        <Text style={estilos.tituloInformativo}>Acompanhe por aqui</Text>
                        <Text style={estilos.descricaoInformativa}>
                            Novas formas de aproveitar o comércio local chegarão em breve.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    scroll: { backgroundColor: "transparent", flex: 1 },
    conteudo: { flexGrow: 1, gap: 18, padding: 20 },
    saudacao: { color: cores.texto, fontSize: 28, fontWeight: "800", marginTop: 4 },
    introducao: { color: cores.textoSecundario, fontSize: 15, lineHeight: 22, marginTop: -10 },
    linhaCards: { flexDirection: "row", gap: 12 },
    cardDestaque: {
        borderRadius: 20,
        flex: 1,
        minHeight: 156,
        overflow: "hidden",
        padding: 18,
    },
    cardPontos: { backgroundColor: cores.primaria },
    brilho: {
        backgroundColor: cores.primariaEscura,
        borderRadius: 80,
        bottom: -36,
        height: 100,
        opacity: 0.35,
        position: "absolute",
        right: -28,
        width: 120,
    },
    linhaSparkles: { flexDirection: "row", gap: 6 },
    cardNivel: { backgroundColor: cores.superficie, borderColor: cores.borda, borderWidth: 1 },
    rotuloDestaque: { color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: "600", marginTop: 18 },
    numeroDestaque: { color: "#FFFFFF", fontSize: 25, fontWeight: "800", marginTop: 5 },
    rotuloNivel: { color: cores.textoSecundario, fontSize: 14, fontWeight: "600", marginTop: 18 },
    numeroNivel: { color: cores.texto, fontSize: 25, fontWeight: "800", marginTop: 5 },
    cartaoInformativo: {
        alignItems: "flex-start",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        flexDirection: "row",
        gap: 14,
        padding: 18,
    },
    iconeInformativo: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 14,
        height: 48,
        justifyContent: "center",
        width: 48,
    },
    textoInformativo: { flex: 1 },
    tituloInformativo: { color: cores.texto, fontSize: 16, fontWeight: "700" },
    descricaoInformativa: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20, marginTop: 5 },
});
