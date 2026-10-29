import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { FundoPastel } from "@/components/FundoPastel";
import { MensagemErro } from "@/components/MensagemErro";
import { useVerificarAtualizacao } from "@/features/atualizacao/useVerificarAtualizacao";
import { useSessao } from "@/features/auth/ContextoSessao";
import { ListaConquistas } from "@/features/progresso/components/ListaConquistas";
import { PainelXp } from "@/features/progresso/components/PainelXp";
import { ResumoAtividades } from "@/features/progresso/components/ResumoAtividades";
import { tituloDoNivel } from "@/features/progresso/regrasProgresso";
import { useProgressoConsumidor } from "@/features/progresso/useProgressoConsumidor";
import { cores } from "@/styles/tema";

export default function TelaPerfil() {
    const atualizacao = useVerificarAtualizacao();
    const { perfil, sair } = useSessao();
    const { progresso, erro, recarregar } = useProgressoConsumidor();
    const [atualizando, setAtualizando] = useState(false);
    const nome = perfil?.usuario.nome ?? "";
    const iniciais = nome
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();

    async function atualizar() {
        setAtualizando(true);
        await recarregar();
        setAtualizando(false);
    }

    function confirmarSaida() {
        if (Platform.OS === "web") {
            const confirmou = globalThis.confirm(
                "Sair da conta? Você precisará informar suas credenciais para entrar novamente.",
            );
            if (confirmou) {
                void sair();
            }
            return;
        }

        Alert.alert("Sair da conta", "Você precisará informar suas credenciais para entrar novamente.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: () => void sair() },
        ]);
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
                        tintColor={cores.primaria}
                    />
                }
                style={estilos.scroll}
            >
                <View style={estilos.resumo}>
                    <View style={estilos.anelAvatar}>
                        <View style={estilos.avatar}>
                            <Text style={estilos.iniciais}>{iniciais}</Text>
                        </View>
                        {progresso ? (
                            <View style={estilos.seloNivel}>
                                <Text style={estilos.textoSeloNivel}>{progresso.nivel}</Text>
                            </View>
                        ) : null}
                    </View>
                    <Text style={estilos.nome}>{nome}</Text>
                    {progresso ? (
                        <View style={estilos.chipTitulo}>
                            <Ionicons color={cores.ouro} name="shield-checkmark" size={14} />
                            <Text style={estilos.textoChip}>{tituloDoNivel(progresso.nivel)}</Text>
                        </View>
                    ) : null}
                </View>

                <MensagemErro mensagem={erro} />
                {progresso ? (
                    <>
                        <PainelXp progresso={progresso} />
                        <Text style={estilos.tituloSecao}>Resumo das atividades</Text>
                        <ResumoAtividades progresso={progresso} />
                        <ListaConquistas progresso={progresso} />
                    </>
                ) : erro ? null : (
                    <View style={estilos.carregando}>
                        <ActivityIndicator color={cores.primaria} />
                    </View>
                )}

                <Text style={estilos.tituloSecao}>Conta</Text>
                <View style={estilos.cartao}>
                    <View style={estilos.linhaDado}>
                        <View style={estilos.iconeCaixa}>
                            <Ionicons color={cores.primaria} name="mail-outline" size={20} />
                        </View>
                        <View style={estilos.textoDado}>
                            <Text style={estilos.rotulo}>E-mail</Text>
                            <Text style={estilos.valor}>{perfil?.usuario.email ?? ""}</Text>
                        </View>
                    </View>
                </View>
                <Text style={estilos.tituloSecao}>Atualização do app</Text>
                <View style={[estilos.cartao, { gap: 12 }]}>
                    <Text style={estilos.valor}>{atualizacao.buildSha ? `Build ${atualizacao.buildSha}` : "Build de desenvolvimento"}</Text>
                    <Text accessibilityLiveRegion="polite" style={estilos.rotulo}>{atualizacao.mensagem}</Text>
                    {atualizacao.estado.tipo === "baixando" ? (
                        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(atualizacao.estado.progresso * 100) }} style={estilos.barraProgresso}>
                            <View style={[estilos.progressoDownload, { width: `${atualizacao.estado.progresso * 100}%` }]} />
                        </View>
                    ) : null}
                    <BotaoPrimario
                        titulo="Verificar atualização"
                        aoPressionar={() => void atualizacao.verificar()}
                        carregando={atualizacao.ocupado}
                        desabilitado={!atualizacao.disponivel}
                    />
                    {atualizacao.disponivel ? <Text style={estilos.rotulo}>Na primeira atualização, permita instalar apps desconhecidos para o Conecta Comércio. Depois, toque em Instalar. Se cancelar, você pode verificar novamente.</Text> : null}
                </View>
                <BotaoPrimario
                    aoPressionar={confirmarSaida}
                    estilo={estilos.botaoSair}
                    titulo="Sair"
                    variante="secundario"
                />
            </ScrollView>
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    scroll: { backgroundColor: "transparent", flex: 1 },
    conteudo: { flexGrow: 1, gap: 16, padding: 20, paddingBottom: 32 },
    resumo: { alignItems: "center", gap: 8, paddingTop: 8 },
    anelAvatar: {
        borderColor: cores.ouro,
        borderRadius: 999,
        borderWidth: 3,
        padding: 4,
    },
    avatar: {
        alignItems: "center",
        backgroundColor: cores.primaria,
        borderRadius: 999,
        height: 88,
        justifyContent: "center",
        width: 88,
    },
    iniciais: { color: "#FFFFFF", fontSize: 29, fontWeight: "800" },
    seloNivel: {
        alignItems: "center",
        backgroundColor: cores.ouro,
        borderColor: cores.superficie,
        borderRadius: 999,
        borderWidth: 3,
        bottom: -6,
        height: 34,
        justifyContent: "center",
        position: "absolute",
        right: -6,
        width: 34,
    },
    textoSeloNivel: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
    nome: { color: cores.texto, fontSize: 23, fontWeight: "900", marginTop: 6 },
    chipTitulo: {
        alignItems: "center",
        backgroundColor: cores.ouroSuave,
        borderRadius: 999,
        flexDirection: "row",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    textoChip: { color: cores.ouro, fontSize: 13, fontWeight: "800" },
    carregando: { alignItems: "center", paddingVertical: 24 },
    tituloSecao: { color: cores.texto, fontSize: 17, fontWeight: "900", marginTop: 4 },
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        padding: 14,
    },
    linhaDado: { alignItems: "center", flexDirection: "row", gap: 13 },
    iconeCaixa: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 12,
        height: 40,
        justifyContent: "center",
        width: 40,
    },
    textoDado: { flex: 1 },
    rotulo: { color: cores.textoSecundario, fontSize: 13 },
    valor: { color: cores.texto, fontSize: 16, fontWeight: "600", marginTop: 3 },
    barraProgresso: { height: 8, borderRadius: 4, backgroundColor: cores.borda, overflow: "hidden" },
    progressoDownload: { height: 8, backgroundColor: cores.primaria },
    botaoSair: { borderRadius: 999 },
});
