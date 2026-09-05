import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
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
import { MensagemErro } from "@/components/MensagemErro";
import { CartaoMissaoDisponivel } from "@/features/missoes/components/CartaoMissaoDisponivel";
import { ItemMissaoConcluida } from "@/features/missoes/components/ItemMissaoConcluida";
import {
    listarMissoesDisponiveis,
    ordenarHistoricoMissoes,
} from "@/features/missoes/listarMissoesDisponiveis";
import { listarHistoricoMissoes } from "@/features/missoes/servicoMissaoConsumidor";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { MissaoConsumidor, MissaoDisponivel } from "@/types/api";

export default function TelaMissoes() {
    const [disponiveis, setDisponiveis] = useState<MissaoDisponivel[]>([]);
    const [concluidas, setConcluidas] = useState<MissaoConsumidor[]>([]);
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

    if (carregando) {
        return (
            <View style={estilos.centralizado}>
                <ActivityIndicator color={cores.primaria} size="large" />
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
            <View style={estilos.grupoAcoes}>
                <Pressable
                    accessibilityLabel="Escanear QR da missão"
                    accessibilityRole="button"
                    onPress={() => router.push("/missoes/escanear")}
                    style={({ pressed }) => [estilos.botaoEscanear, pressed && estilos.pressionado]}
                >
                    <Ionicons color="#FFFFFF" name="qr-code-outline" size={22} />
                    <Text style={estilos.textoBotaoEscanear}>Escanear QR</Text>
                </Pressable>
                <Pressable
                    accessibilityLabel="Ler NFC-e da nota fiscal"
                    accessibilityRole="button"
                    onPress={() => router.push("/missoes/ler-nfce")}
                    style={({ pressed }) => [estilos.botaoNfce, pressed && estilos.pressionado]}
                >
                    <Ionicons color={cores.primaria} name="receipt-outline" size={22} />
                    <Text style={estilos.textoBotaoNfce}>Ler NFC-e</Text>
                </Pressable>
            </View>

            <MensagemErro mensagem={erro} />

            <Secao titulo="Disponíveis">
                {disponiveis.length === 0 ? (
                    <Text style={estilos.vazio}>
                        Nenhuma missão disponível no momento. Visite uma loja participante para descobrir
                        novas missões.
                    </Text>
                ) : (
                    disponiveis.map((missao) => (
                        <CartaoMissaoDisponivel key={`${missao.lojistaId}-${missao.id}`} missao={missao} />
                    ))
                )}
            </Secao>

            <Secao titulo="Concluídas">
                {concluidas.length === 0 ? (
                    <Text style={estilos.vazio}>Nenhuma missão concluída ainda. Escaneie um QR na loja!</Text>
                ) : (
                    concluidas.map((conclusao) => (
                        <ItemMissaoConcluida key={conclusao.id} conclusao={conclusao} />
                    ))
                )}
            </Secao>
        </ScrollView>
    );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
    return (
        <View style={estilos.secao}>
            <Text style={estilos.tituloSecao}>{titulo}</Text>
            <View style={estilos.lista}>{children}</View>
        </View>
    );
}

const estilos = StyleSheet.create({
    centralizado: { alignItems: "center", backgroundColor: cores.fundo, flex: 1, justifyContent: "center" },
    conteudo: { backgroundColor: cores.fundo, gap: 20, padding: 20, paddingBottom: 36 },
    botaoEscanear: {
        alignItems: "center",
        backgroundColor: cores.primaria,
        borderRadius: 16,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        paddingVertical: 16,
    },
    botaoNfce: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.primaria,
        borderRadius: 16,
        borderWidth: 2,
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        paddingVertical: 14,
    },
    grupoAcoes: { gap: 10 },
    pressionado: { opacity: 0.88 },
    textoBotaoEscanear: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
    textoBotaoNfce: { color: cores.primaria, fontSize: 16, fontWeight: "800" },
    secao: { gap: 10 },
    tituloSecao: { color: cores.texto, fontSize: 17, fontWeight: "800" },
    lista: { gap: 10 },
    vazio: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20 },
});
