import { useCallback, useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { FundoPastel } from "@/components/FundoPastel";
import { MensagemErro } from "@/components/MensagemErro";
import { CartaoMissaoDisponivel } from "@/features/missoes/components/CartaoMissaoDisponivel";
import { ItemMissaoConcluida } from "@/features/missoes/components/ItemMissaoConcluida";
import {
    listarMissoesDisponiveis,
    ordenarHistoricoMissoes,
    separarMissoesDiarias,
} from "@/features/missoes/listarMissoesDisponiveis";
import { listarHistoricoMissoes } from "@/features/missoes/servicoMissaoConsumidor";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { MissaoConsumidor, MissaoDisponivel } from "@/types/api";

type AbaMissoes = "diarias" | "outras" | "concluidas";

const ABAS: { id: AbaMissoes; rotulo: string }[] = [
    { id: "diarias", rotulo: "Diárias" },
    { id: "outras", rotulo: "Outras" },
    { id: "concluidas", rotulo: "Concluídas" },
];

export default function TelaMissoes() {
    const [disponiveis, setDisponiveis] = useState<MissaoDisponivel[]>([]);
    const [concluidas, setConcluidas] = useState<MissaoConsumidor[]>([]);
    const [aba, setAba] = useState<AbaMissoes>("diarias");
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const { diarias, outras } = useMemo(() => separarMissoesDiarias(disponiveis), [disponiveis]);

    const carregar = useCallback(async (silencioso = false) => {
        if (silencioso) {
            setAtualizando(true);
        } else {
            setCarregando(true);
        }
        setErro(null);
        try {
            const [missoesDisponiveis, historico] = await Promise.all([
                listarMissoesDisponiveis(),
                listarHistoricoMissoes(),
            ]);
            setDisponiveis(missoesDisponiveis);
            setConcluidas(ordenarHistoricoMissoes(historico));
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

    function realizarMissao() {
        router.push("/missoes/escanear");
    }

    if (carregando) {
        return (
            <FundoPastel>
                <View style={estilos.centralizado}>
                    <ActivityIndicator color={cores.primaria} size="large" />
                </View>
            </FundoPastel>
        );
    }

    const contagem: Record<AbaMissoes, number> = {
        diarias: diarias.length,
        outras: outras.length,
        concluidas: concluidas.length,
    };

    return (
        <FundoPastel>
            <View accessibilityRole="tablist" style={estilos.abas}>
                {ABAS.map((item) => {
                    const ativa = item.id === aba;
                    return (
                        <Pressable
                            accessibilityRole="tab"
                            accessibilityState={{ selected: ativa }}
                            key={item.id}
                            onPress={() => setAba(item.id)}
                            style={[estilos.aba, ativa && estilos.abaAtiva]}
                        >
                            <Text style={[estilos.textoAba, ativa && estilos.textoAbaAtiva]}>
                                {item.rotulo} ({contagem[item.id]})
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <ScrollView
                contentContainerStyle={estilos.conteudo}
                refreshControl={
                    <RefreshControl
                        colors={[cores.primaria]}
                        onRefresh={() => void carregar(true)}
                        refreshing={atualizando}
                    />
                }
                style={estilos.scroll}
            >
                <MensagemErro mensagem={erro} />

                {aba === "diarias" ? (
                    <ListaDisponiveis
                        missoes={diarias}
                        onRealizar={realizarMissao}
                        vazio="Nenhuma missão diária disponível no momento."
                    />
                ) : null}

                {aba === "outras" ? (
                    <ListaDisponiveis
                        missoes={outras}
                        onRealizar={realizarMissao}
                        vazio="Nenhuma outra missão disponível no momento. Visite uma loja participante para descobrir novas missões."
                    />
                ) : null}

                {aba === "concluidas" ? (
                    concluidas.length === 0 ? (
                        <Text style={estilos.vazio}>
                            Nenhuma missão concluída ainda. Escolha uma missão e toque em Realizar missão!
                        </Text>
                    ) : (
                        <View style={estilos.lista}>
                            {concluidas.map((conclusao) => (
                                <ItemMissaoConcluida key={conclusao.id} conclusao={conclusao} />
                            ))}
                        </View>
                    )
                ) : null}
            </ScrollView>
        </FundoPastel>
    );
}

function ListaDisponiveis({
    missoes,
    onRealizar,
    vazio,
}: {
    missoes: MissaoDisponivel[];
    onRealizar: (missao: MissaoDisponivel) => void;
    vazio: string;
}) {
    if (missoes.length === 0) {
        return <Text style={estilos.vazio}>{vazio}</Text>;
    }
    return (
        <View style={estilos.lista}>
            {missoes.map((missao) => (
                <CartaoMissaoDisponivel
                    key={`${missao.lojistaId}-${missao.id}`}
                    missao={missao}
                    onRealizar={onRealizar}
                />
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    centralizado: { alignItems: "center", flex: 1, justifyContent: "center" },
    abas: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 999,
        borderWidth: 1,
        flexDirection: "row",
        gap: 4,
        marginHorizontal: 20,
        marginTop: 12,
        padding: 4,
    },
    aba: {
        alignItems: "center",
        borderRadius: 999,
        flex: 1,
        paddingVertical: 10,
    },
    abaAtiva: { backgroundColor: cores.primaria },
    textoAba: { color: cores.textoSecundario, fontSize: 13, fontWeight: "700" },
    textoAbaAtiva: { color: "#FFFFFF" },
    scroll: { backgroundColor: "transparent", flex: 1 },
    conteudo: { gap: 16, padding: 20, paddingBottom: 36 },
    lista: { gap: 10 },
    vazio: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20 },
});
