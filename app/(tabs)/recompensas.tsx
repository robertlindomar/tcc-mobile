import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { MensagemErro } from "@/components/MensagemErro";
import { CartaoRecompensa } from "@/features/recompensas/components/CartaoRecompensa";
import { ItemResgate } from "@/features/recompensas/components/ItemResgate";
import { ModalConfirmarResgate } from "@/features/recompensas/components/ModalConfirmarResgate";
import { ResumoSaldoPontos } from "@/features/recompensas/components/ResumoSaldoPontos";
import { ordenarResgates } from "@/features/recompensas/regrasRecompensa";
import { obterCatalogoRecompensas } from "@/features/recompensas/servicoRecompensa";
import { listarMeusResgates } from "@/features/recompensas/servicoResgateRecompensa";
import { useResgateRecompensa } from "@/features/recompensas/useResgateRecompensa";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { RecompensaCatalogo, ResgateRecompensa } from "@/types/api";

export default function TelaRecompensas() {
    const [estado, setEstado] = useState({
        pontos: 0,
        nivel: 1,
        recompensas: [] as RecompensaCatalogo[],
    });
    const [resgates, setResgates] = useState<ResgateRecompensa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const {
        recompensaPendente,
        resgatandoId,
        iniciarResgate,
        cancelarResgate,
        confirmarResgate,
    } = useResgateRecompensa({
        estado,
        setEstado,
        setResgates,
        setErro,
    });

    const carregar = useCallback(async (silencioso = false) => {
        if (silencioso) {
            setAtualizando(true);
        } else {
            setCarregando(true);
        }
        setErro(null);
        try {
            const [catalogo, historico] = await Promise.all([
                obterCatalogoRecompensas(),
                listarMeusResgates(),
            ]);
            setEstado({
                pontos: catalogo.pontos,
                nivel: catalogo.nivel,
                recompensas: catalogo.recompensas,
            });
            setResgates(ordenarResgates(historico));
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
            <View style={estilos.centralizado}>
                <ActivityIndicator color={cores.primaria} size="large" />
            </View>
        );
    }

    return (
        <>
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
                <ResumoSaldoPontos nivel={estado.nivel} pontos={estado.pontos} />
                <MensagemErro mensagem={erro} />

                <Secao titulo="Disponíveis">
                    {estado.recompensas.length === 0 ? (
                        <Text style={estilos.vazio}>
                            Nenhuma recompensa disponível no momento.
                        </Text>
                    ) : (
                        estado.recompensas.map((recompensa) => (
                            <CartaoRecompensa
                                key={recompensa.id}
                                onResgatar={iniciarResgate}
                                pontos={estado.pontos}
                                recompensa={recompensa}
                                resgatando={resgatandoId === recompensa.id}
                            />
                        ))
                    )}
                </Secao>

                <Secao titulo="Meus resgates">
                    {resgates.length === 0 ? (
                        <Text style={estilos.vazio}>Nenhum resgate ainda.</Text>
                    ) : (
                        resgates.map((resgate) => (
                            <ItemResgate key={resgate.id} resgate={resgate} />
                        ))
                    )}
                </Secao>
            </ScrollView>

            {recompensaPendente ? (
                <ModalConfirmarResgate
                    onCancelar={cancelarResgate}
                    onConfirmar={() => void confirmarResgate()}
                    recompensa={recompensaPendente}
                    resgatando={resgatandoId === recompensaPendente.id}
                />
            ) : null}
        </>
    );
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
    return (
        <View style={estilos.secao}>
            <Text style={estilos.tituloSecao}>{titulo}</Text>
            <View style={estilos.lista}>{children}</View>
        </View>
    );
}

const estilos = StyleSheet.create({
    centralizado: {
        alignItems: "center",
        backgroundColor: cores.fundo,
        flex: 1,
        justifyContent: "center",
    },
    conteudo: { backgroundColor: cores.fundo, gap: 18, padding: 20, paddingBottom: 36 },
    secao: { gap: 10 },
    tituloSecao: { color: cores.texto, fontSize: 17, fontWeight: "800" },
    lista: { gap: 10 },
    vazio: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20 },
});
