import { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { MensagemErro } from "@/components/MensagemErro";
import { listarCampanhasVigentes, processarNfce } from "@/features/nfce/servicoNfce";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { formatarDataCivil } from "@/utils/formatarDataCivil";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { CampanhaVigente, RespostaProcessamentoNfce } from "@/types/api";

const INTERVALO_DEBOUNCE_MS = 2000;

function mensagemSucesso(resposta: RespostaProcessamentoNfce): string {
    const tickets =
        resposta.ticketsGerados === 1
            ? "1 ticket"
            : `${resposta.ticketsGerados} tickets`;
    return [
        `Você ganhou ${tickets}.`,
        `Residual: ${formatarMoeda(resposta.residualApos)}.`,
        `Total na campanha: ${resposta.ticketsTotaisCampanha}.`,
        resposta.modoSimulado ? "(Demo — não é consulta SEFAZ)" : "",
    ]
        .filter(Boolean)
        .join("\n");
}

export default function TelaAbaNfce() {
    const [campanhas, setCampanhas] = useState<CampanhaVigente[]>([]);
    const [campanhaId, setCampanhaId] = useState<number | null>(null);
    const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
    const [erroCampanhas, setErroCampanhas] = useState<string | null>(null);

    const carregarCampanhas = useCallback(async () => {
        setCarregandoCampanhas(true);
        setErroCampanhas(null);
        try {
            const lista = await listarCampanhasVigentes();
            setCampanhas(lista);
            setCampanhaId((atual) => {
                if (atual !== null && lista.some((c) => c.id === atual)) {
                    return atual;
                }
                return lista.length === 1 ? lista[0]!.id : lista[0]?.id ?? null;
            });
        } catch (causa) {
            setErroCampanhas(normalizarErro(causa));
            setCampanhas([]);
            setCampanhaId(null);
        } finally {
            setCarregandoCampanhas(false);
        }
    }, []);

    useEffect(() => {
        void carregarCampanhas();
    }, [carregarCampanhas]);

    if (carregandoCampanhas) {
        return (
            <View style={estilos.centralizado}>
                <ActivityIndicator color={cores.primaria} size="large" />
            </View>
        );
    }

    if (erroCampanhas) {
        return (
            <View style={estilos.conteudoEstado}>
                <MensagemErro mensagem={erroCampanhas} />
                <Pressable
                    accessibilityRole="button"
                    onPress={() => void carregarCampanhas()}
                    style={({ pressed }) => [estilos.botaoAcao, pressed && estilos.pressionado]}
                >
                    <Text style={estilos.textoBotaoAcao}>Tentar novamente</Text>
                </Pressable>
            </View>
        );
    }

    if (campanhas.length === 0 || campanhaId === null) {
        return (
            <View style={estilos.conteudoEstado}>
                <Ionicons color={cores.primaria} name="calendar-outline" size={40} />
                <Text style={estilos.tituloEstado}>Nenhuma campanha vigente</Text>
                <Text style={estilos.textoEstado}>
                    Não há campanha aberta para creditar tickets agora. Tente mais tarde.
                </Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => void carregarCampanhas()}
                    style={({ pressed }) => [estilos.botaoAcao, pressed && estilos.pressionado]}
                >
                    <Text style={estilos.textoBotaoAcao}>Atualizar</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={estilos.container}>
            <SeletorCampanha
                campanhaId={campanhaId}
                campanhas={campanhas}
                onChange={setCampanhaId}
            />
            {Platform.OS === "web" ? (
                <FallbackWeb campanhaId={campanhaId} />
            ) : (
                <EscanearNativo campanhaId={campanhaId} />
            )}
        </View>
    );
}

function SeletorCampanha({
    campanhas,
    campanhaId,
    onChange,
}: {
    campanhas: CampanhaVigente[];
    campanhaId: number;
    onChange: (id: number) => void;
}) {
    if (campanhas.length === 1) {
        const unica = campanhas[0]!;
        return (
            <View style={estilos.barraCampanha}>
                <Text style={estilos.rotuloCampanha}>Campanha</Text>
                <Text style={estilos.nomeCampanhaUnica}>{unica.nome}</Text>
                <Text style={estilos.metaCampanha}>
                    {formatarDataCivil(unica.dataInicioCivil)} –{" "}
                    {formatarDataCivil(unica.dataFimCivil)} · {formatarMoeda(unica.valorPorTicket)}
                    /ticket
                </Text>
            </View>
        );
    }

    return (
        <View style={estilos.barraCampanha}>
            <Text style={estilos.rotuloCampanha}>Selecione a campanha</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.listaChips}>
                {campanhas.map((campanha) => {
                    const ativa = campanha.id === campanhaId;
                    return (
                        <Pressable
                            key={campanha.id}
                            accessibilityRole="button"
                            accessibilityState={{ selected: ativa }}
                            onPress={() => onChange(campanha.id)}
                            style={({ pressed }) => [
                                estilos.chip,
                                ativa && estilos.chipAtivo,
                                pressed && estilos.pressionado,
                            ]}
                        >
                            <Text style={[estilos.chipTitulo, ativa && estilos.chipTituloAtivo]}>
                                {campanha.nome}
                            </Text>
                            <Text style={[estilos.chipMeta, ativa && estilos.chipMetaAtivo]}>
                                {formatarMoeda(campanha.valorPorTicket)}/ticket
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

function FallbackWeb({ campanhaId }: { campanhaId: number }) {
    const [entrada, setEntrada] = useState("");
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function enviar() {
        const payload = entrada.trim();
        if (!payload) {
            setErro("Cole o QR da NFC-e (URL, chave ou tcc://nfce-demo?…).");
            return;
        }

        setProcessando(true);
        setErro(null);
        try {
            const resposta = await processarNfce({ payloadQr: payload, campanhaId });
            globalThis.alert(mensagemSucesso(resposta));
            setEntrada("");
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
                    Cole o conteúdo do QR da nota fiscal. Em demo use a chave da fixture ou URI
                    tcc://nfce-demo?…
                </Text>
            </View>
            <Text style={estilos.rotulo}>Payload do QR da NFC-e</Text>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                editable={!processando}
                multiline
                onChangeText={setEntrada}
                placeholder="URL da nota, chave (44 dígitos) ou tcc://nfce-demo?…"
                placeholderTextColor={cores.textoSecundario}
                style={estilos.campo}
                value={entrada}
            />
            <MensagemErro mensagem={erro} />
            <Pressable
                accessibilityRole="button"
                disabled={processando}
                onPress={() => void enviar()}
                style={({ pressed }) => [
                    estilos.botaoAcao,
                    processando && estilos.botaoDesabilitado,
                    pressed && !processando && estilos.pressionado,
                ]}
            >
                {processando ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={estilos.textoBotaoAcao}>Processar nota</Text>
                )}
            </Pressable>
        </View>
    );
}

function EscanearNativo({ campanhaId }: { campanhaId: number }) {
    const [permissao, solicitarPermissao] = useCameraPermissions();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const ultimaLeituraRef = useRef(0);
    const campanhaIdRef = useRef(campanhaId);
    campanhaIdRef.current = campanhaId;

    const processarLeitura = useCallback(async (dados: string) => {
        const agora = Date.now();
        if (processando || agora - ultimaLeituraRef.current < INTERVALO_DEBOUNCE_MS) {
            return;
        }

        const payload = dados.trim();
        if (!payload) {
            return;
        }

        ultimaLeituraRef.current = agora;
        setProcessando(true);
        setErro(null);

        try {
            const resposta = await processarNfce({
                payloadQr: payload,
                campanhaId: campanhaIdRef.current,
            });
            Alert.alert("Tickets creditados!", mensagemSucesso(resposta));
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setProcessando(false);
        }
    }, [processando]);

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
                    Precisamos da câmera para ler o QR code da nota fiscal (NFC-e).
                </Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => void solicitarPermissao()}
                    style={({ pressed }) => [estilos.botaoAcao, pressed && estilos.pressionado]}
                >
                    <Text style={estilos.textoBotaoAcao}>Permitir câmera</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={estilos.containerCamera}>
            <CameraView
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={({ data }) => void processarLeitura(data)}
                style={StyleSheet.absoluteFill}
            />
            <View style={estilos.overlay}>
                <View style={estilos.moldura} />
                <Text style={estilos.instrucao}>Aponte para o QR da nota fiscal</Text>
                {processando ? (
                    <View style={estilos.processando}>
                        <ActivityIndicator color="#FFFFFF" />
                        <Text style={estilos.textoProcessando}>Processando NFC-e…</Text>
                    </View>
                ) : null}
                <MensagemErro mensagem={erro} />
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { backgroundColor: cores.fundo, flex: 1 },
    centralizado: { alignItems: "center", backgroundColor: cores.fundo, flex: 1, justifyContent: "center" },
    conteudoEstado: {
        alignItems: "center",
        backgroundColor: cores.fundo,
        flex: 1,
        gap: 12,
        justifyContent: "center",
        padding: 24,
    },
    tituloEstado: { color: cores.texto, fontSize: 18, fontWeight: "800", textAlign: "center" },
    textoEstado: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20, textAlign: "center" },
    barraCampanha: {
        backgroundColor: cores.superficie,
        borderBottomColor: cores.borda,
        borderBottomWidth: 1,
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    rotuloCampanha: { color: cores.textoSecundario, fontSize: 12, fontWeight: "700" },
    nomeCampanhaUnica: { color: cores.texto, fontSize: 16, fontWeight: "800" },
    metaCampanha: { color: cores.textoSecundario, fontSize: 13 },
    listaChips: { gap: 8, paddingVertical: 2 },
    chip: {
        backgroundColor: cores.fundo,
        borderColor: cores.borda,
        borderRadius: 14,
        borderWidth: 1,
        minWidth: 140,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    chipAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    chipTitulo: { color: cores.texto, fontSize: 14, fontWeight: "800" },
    chipTituloAtivo: { color: "#FFFFFF" },
    chipMeta: { color: cores.textoSecundario, fontSize: 12, marginTop: 2 },
    chipMetaAtivo: { color: "rgba(255,255,255,0.9)" },
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
    botaoAcao: {
        alignItems: "center",
        backgroundColor: cores.primaria,
        borderRadius: 14,
        marginTop: 8,
        paddingVertical: 14,
    },
    botaoDesabilitado: { opacity: 0.7 },
    pressionado: { opacity: 0.88 },
    textoBotaoAcao: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
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
        ...StyleSheet.absoluteFill,
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
