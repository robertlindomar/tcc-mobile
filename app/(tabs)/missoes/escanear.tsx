import { useCallback, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { MensagemErro } from "@/components/MensagemErro";
import { useSessao } from "@/features/auth/ContextoSessao";
import { extrairTokenQrMissao } from "@/features/missoes/extrairTokenQrMissao";
import { concluirMissaoPorToken } from "@/features/missoes/servicoMissaoConsumidor";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";

const INTERVALO_DEBOUNCE_MS = 2000;

export default function TelaEscanearMissao() {
    if (Platform.OS === "web") {
        return <FallbackWeb />;
    }

    return <EscanearNativo />;
}

function FallbackWeb() {
    const { atualizarPerfil } = useSessao();
    const [entrada, setEntrada] = useState("");
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function concluir() {
        const token = extrairTokenQrMissao(entrada);
        if (!token) {
            setErro("Cole o payload do QR (tcc://missao/…) ou o token.");
            return;
        }

        setProcessando(true);
        setErro(null);
        try {
            const resposta = await concluirMissaoPorToken(entrada.trim());
            await atualizarPerfil();
            globalThis.alert(
                `Missão concluída! Você ganhou ${resposta.missaoConsumidor.pontoRecompensa ?? 0} pts. Total: ${resposta.consumidor.pontos} pts.`,
            );
            router.back();
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setProcessando(false);
        }
    }

    return (
        <View style={estilos.conteudoWeb}>
            <View style={estilos.avisoWeb}>
                <Ionicons color={cores.primaria} name="information-circle-outline" size={22} />
                <Text style={estilos.textoAvisoWeb}>
                    No navegador, cole o conteúdo do QR da missão para simular a leitura.
                </Text>
            </View>
            <Text style={estilos.rotulo}>Payload ou token do QR</Text>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!processando}
                multiline
                onChangeText={setEntrada}
                placeholder="tcc://missao/…"
                placeholderTextColor={cores.textoSecundario}
                style={estilos.campo}
                value={entrada}
            />
            <MensagemErro mensagem={erro} />
            <Pressable
                accessibilityRole="button"
                disabled={processando}
                onPress={() => void concluir()}
                style={({ pressed }) => [
                    estilos.botaoConcluir,
                    processando && estilos.botaoDesabilitado,
                    pressed && !processando && estilos.pressionado,
                ]}
            >
                {processando ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={estilos.textoBotaoConcluir}>Concluir missão</Text>
                )}
            </Pressable>
        </View>
    );
}

function EscanearNativo() {
    const { atualizarPerfil } = useSessao();
    const [permissao, solicitarPermissao] = useCameraPermissions();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const ultimaLeituraRef = useRef(0);

    const processarLeitura = useCallback(
        async (dados: string) => {
            const agora = Date.now();
            if (processando || agora - ultimaLeituraRef.current < INTERVALO_DEBOUNCE_MS) {
                return;
            }

            const token = extrairTokenQrMissao(dados);
            if (!token) {
                return;
            }

            ultimaLeituraRef.current = agora;
            setProcessando(true);
            setErro(null);

            try {
                const resposta = await concluirMissaoPorToken(dados.trim());
                await atualizarPerfil();
                Alert.alert(
                    "Missão concluída!",
                    `Você ganhou ${resposta.missaoConsumidor.pontoRecompensa ?? 0} pts. Total: ${resposta.consumidor.pontos} pts.`,
                    [{ text: "OK", onPress: () => router.back() }],
                );
            } catch (causa) {
                setErro(normalizarErro(causa));
            } finally {
                setProcessando(false);
            }
        },
        [atualizarPerfil, processando],
    );

    if (!permissao) {
        return (
            <View style={estilos.centralizado}>
                <ActivityIndicator color={cores.primaria} size="large" />
            </View>
        );
    }

    if (!permissao.granted) {
        return (
            <View style={estilos.conteudoPermissao}>
                <Ionicons color={cores.primaria} name="camera-outline" size={48} />
                <Text style={estilos.tituloPermissao}>Acesso à câmera</Text>
                <Text style={estilos.textoPermissao}>
                    Precisamos da câmera para ler o QR code da missão na loja.
                </Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => void solicitarPermissao()}
                    style={({ pressed }) => [estilos.botaoConcluir, pressed && estilos.pressionado]}
                >
                    <Text style={estilos.textoBotaoConcluir}>Permitir câmera</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={estilos.containerCamera}>
            <CameraView
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={({ data }) => void processarLeitura(data)}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={estilos.overlay}>
                <View style={estilos.moldura} />
                <Text style={estilos.instrucao}>Aponte para o QR code da missão</Text>
                {processando ? (
                    <View style={estilos.processando}>
                        <ActivityIndicator color="#FFFFFF" />
                        <Text style={estilos.textoProcessando}>Concluindo missão…</Text>
                    </View>
                ) : null}
                <MensagemErro mensagem={erro} />
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    centralizado: { alignItems: "center", backgroundColor: cores.fundo, flex: 1, justifyContent: "center" },
    conteudoWeb: { backgroundColor: cores.fundo, flex: 1, gap: 12, padding: 20 },
    avisoWeb: {
        alignItems: "flex-start",
        backgroundColor: cores.primariaSuave,
        borderRadius: 14,
        flexDirection: "row",
        gap: 10,
        padding: 14,
    },
    textoAvisoWeb: { color: cores.texto, flex: 1, fontSize: 14, lineHeight: 20 },
    rotulo: { color: cores.texto, fontSize: 14, fontWeight: "700" },
    campo: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 14,
        borderWidth: 1,
        color: cores.texto,
        fontSize: 14,
        minHeight: 96,
        padding: 14,
        textAlignVertical: "top",
    },
    botaoConcluir: {
        alignItems: "center",
        backgroundColor: cores.primaria,
        borderRadius: 14,
        marginTop: 8,
        paddingVertical: 14,
    },
    botaoDesabilitado: { opacity: 0.7 },
    pressionado: { opacity: 0.88 },
    textoBotaoConcluir: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
    conteudoPermissao: {
        alignItems: "center",
        backgroundColor: cores.fundo,
        flex: 1,
        gap: 12,
        justifyContent: "center",
        padding: 24,
    },
    tituloPermissao: { color: cores.texto, fontSize: 20, fontWeight: "800" },
    textoPermissao: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20, textAlign: "center" },
    containerCamera: { backgroundColor: "#000000", flex: 1 },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    moldura: {
        borderColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 3,
        height: 220,
        width: 220,
    },
    instrucao: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
        marginTop: 24,
        textAlign: "center",
        textShadowColor: "rgba(0,0,0,0.6)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    processando: { alignItems: "center", flexDirection: "row", gap: 8, marginTop: 16 },
    textoProcessando: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});
