import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Href, router, useFocusEffect } from "expo-router";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { FundoPastel } from "@/components/FundoPastel";
import { MensagemErro } from "@/components/MensagemErro";
import { useSessao } from "@/features/auth/ContextoSessao";
import { CarrosselLojasDestaque } from "@/features/progresso/components/CarrosselLojasDestaque";
import { PainelXp } from "@/features/progresso/components/PainelXp";
import { ResumoAtividades } from "@/features/progresso/components/ResumoAtividades";
import { listarLojasDestaque } from "@/features/progresso/servicoProgresso";
import { useProgressoConsumidor } from "@/features/progresso/useProgressoConsumidor";
import { cores } from "@/styles/tema";
import { LojaDestaque } from "@/types/api";

const ATALHOS: { rotulo: string; icone: keyof typeof Ionicons.glyphMap; destino: Href; cor: string; fundo: string }[] = [
    { rotulo: "Missões", icone: "flag", destino: "/missoes", cor: cores.primaria, fundo: cores.primariaSuave },
    { rotulo: "Campanha", icone: "receipt", destino: "/nfce", cor: cores.ouro, fundo: cores.ouroSuave },
    { rotulo: "Recompensas", icone: "gift", destino: "/recompensas", cor: cores.coral, fundo: cores.perigoSuave },
];

export default function TelaInicio() {
    const { perfil, atualizarPerfil } = useSessao();
    const { progresso, erro, recarregar } = useProgressoConsumidor();
    const [lojas, setLojas] = useState<LojaDestaque[] | null>(null);
    const [atualizando, setAtualizando] = useState(false);
    const primeiroNome = perfil?.usuario.nome.trim().split(/\s+/)[0] ?? "";

    const carregarLojas = useCallback(async () => {
        try {
            setLojas(await listarLojasDestaque());
        } catch {
            setLojas([]);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void carregarLojas();
        }, [carregarLojas]),
    );

    async function atualizar() {
        setAtualizando(true);
        await Promise.allSettled([recarregar(), carregarLojas(), atualizarPerfil()]);
        setAtualizando(false);
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
                <View>
                    <Text style={estilos.saudacao}>Olá, {primeiroNome} 👋</Text>
                    <Text style={estilos.introducao}>Bora subir de nível no comércio local?</Text>
                </View>

                <MensagemErro mensagem={erro} />
                {progresso ? (
                    <>
                        <PainelXp compacto progresso={progresso} />
                        <ResumoAtividades progresso={progresso} somente={["pontos", "tickets"]} />
                    </>
                ) : erro ? null : (
                    <View style={estilos.carregando}>
                        <ActivityIndicator color={cores.primaria} />
                    </View>
                )}

                <View style={estilos.cabecalhoSecao}>
                    <View>
                        <Text style={estilos.tituloSecao}>Lojas em destaque</Text>
                        <Text style={estilos.subtituloSecao}>Mais ofertas valendo agora</Text>
                    </View>
                    <Pressable accessibilityRole="link" hitSlop={8} onPress={() => router.push("/lojas")}>
                        <Text style={estilos.verTodas}>Ver todas</Text>
                    </Pressable>
                </View>
                {lojas ? (
                    <CarrosselLojasDestaque lojas={lojas} />
                ) : (
                    <View style={estilos.carregando}>
                        <ActivityIndicator color={cores.primaria} />
                    </View>
                )}

                <Text style={estilos.tituloSecao}>Atalhos</Text>
                <View style={estilos.atalhos}>
                    {ATALHOS.map((atalho) => (
                        <Pressable
                            accessibilityRole="button"
                            key={atalho.rotulo}
                            onPress={() => router.push(atalho.destino)}
                            style={({ pressed }) => [estilos.atalho, pressed && estilos.pressionado]}
                        >
                            <View style={[estilos.iconeAtalho, { backgroundColor: atalho.fundo }]}>
                                <Ionicons color={atalho.cor} name={atalho.icone} size={22} />
                            </View>
                            <Text style={estilos.rotuloAtalho}>{atalho.rotulo}</Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    scroll: { backgroundColor: "transparent", flex: 1 },
    conteudo: { flexGrow: 1, gap: 16, padding: 20, paddingBottom: 32 },
    saudacao: { color: cores.texto, fontSize: 28, fontWeight: "900" },
    introducao: { color: cores.textoSecundario, fontSize: 15, lineHeight: 22, marginTop: 2 },
    carregando: { alignItems: "center", paddingVertical: 24 },
    cabecalhoSecao: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    tituloSecao: { color: cores.texto, fontSize: 18, fontWeight: "900" },
    subtituloSecao: { color: cores.textoSecundario, fontSize: 13, marginTop: 2 },
    verTodas: { color: cores.primaria, fontSize: 14, fontWeight: "800" },
    atalhos: { flexDirection: "row", gap: 10 },
    atalho: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 18,
        borderWidth: 1,
        flex: 1,
        gap: 8,
        paddingVertical: 14,
    },
    iconeAtalho: { alignItems: "center", borderRadius: 14, height: 44, justifyContent: "center", width: 44 },
    rotuloAtalho: { color: cores.texto, fontSize: 12, fontWeight: "800" },
    pressionado: { opacity: 0.85 },
});
