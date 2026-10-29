import { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useIsFocused } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    AppState,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { MensagemErro } from "@/components/MensagemErro";
import { FundoPastel } from "@/components/FundoPastel";
import { HistoricoNotasLidas } from "@/features/nfce/components/HistoricoNotasLidas";
import { ResumoTicketsCampanha } from "@/features/nfce/components/ResumoTicketsCampanha";
import { buscarMeuExtrato, listarCampanhasVigentes, processarNfce } from "@/features/nfce/servicoNfce";
import { parsearQrNfce } from "@/features/nfce/parsearQrNfce";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { formatarDataCivil } from "@/utils/formatarDataCivil";
import { formatarMoeda } from "@/utils/formatarMoeda";
import { CampanhaVigente, ExtratoCampanha, RespostaProcessamentoNfce } from "@/types/api";

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
        resposta.provider === "teste"
            ? "Dados obtidos na consulta pública da SEFAZ-SP."
            : resposta.modoSimulado ? "(Demo — não é consulta SEFAZ)" : "",
    ]
        .filter(Boolean)
        .join("\n");
}

export default function TelaAbaNfce() {
    const [campanha, setCampanha] = useState<CampanhaVigente | null>(null);
    const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
    const [erroCampanhas, setErroCampanhas] = useState<string | null>(null);

    const carregarCampanhas = useCallback(async () => {
        setCarregandoCampanhas(true);
        setErroCampanhas(null);
        try {
            const lista = await listarCampanhasVigentes();
            setCampanha(lista[0] ?? null);
        } catch (causa) {
            setErroCampanhas(normalizarErro(causa));
            setCampanha(null);
        } finally {
            setCarregandoCampanhas(false);
        }
    }, []);

    useEffect(() => {
        const agendamento = setTimeout(() => void carregarCampanhas(), 0);
        return () => clearTimeout(agendamento);
    }, [carregarCampanhas]);

    if (carregandoCampanhas) {
        return (
            <FundoPastel>
                <View style={estilos.centralizado}>
                    <ActivityIndicator color={cores.primaria} size="large" />
                </View>
            </FundoPastel>
        );
    }

    if (erroCampanhas) {
        return (
            <FundoPastel>
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
            </FundoPastel>
        );
    }

    if (!campanha) {
        return (
            <FundoPastel>
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
            </FundoPastel>
        );
    }

    return (
        <FundoPastel>
            <ConteudoCampanha campanha={campanha} />
        </FundoPastel>
    );
}

function ConteudoCampanha({ campanha }: { campanha: CampanhaVigente }) {
    const [extrato, setExtrato] = useState<ExtratoCampanha | null>(null);
    const [carregandoExtrato, setCarregandoExtrato] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    const carregarExtrato = useCallback(async () => {
        setCarregandoExtrato(true);
        try {
            setExtrato(await buscarMeuExtrato(campanha.id));
        } catch {
            setExtrato(null);
        } finally {
            setCarregandoExtrato(false);
        }
    }, [campanha.id]);

    const leitura = useLeituraNfce(campanha.id, carregarExtrato);
    const { fecharCamera } = leitura;

    useFocusEffect(
        useCallback(() => {
            void carregarExtrato();
            return () => fecharCamera();
        }, [carregarExtrato, fecharCamera]),
    );

    useEffect(() => {
        const assinatura = AppState.addEventListener("change", (estado) => {
            if (estado !== "active") {
                fecharCamera();
            }
        });
        return () => assinatura.remove();
    }, [fecharCamera]);

    async function atualizar() {
        setAtualizando(true);
        await carregarExtrato();
        setAtualizando(false);
    }

    if (Platform.OS !== "web" && leitura.cameraAberta) {
        return <CameraNfce leitura={leitura} />;
    }

    return (
        <ScrollView
            contentContainerStyle={estilos.conteudoRolavel}
            refreshControl={
                <RefreshControl
                    colors={[cores.primaria]}
                    onRefresh={() => void atualizar()}
                    refreshing={atualizando}
                    tintColor={cores.primaria}
                />
            }
        >
            <CartaoCampanhaVigente campanha={campanha} />
            <ResumoTicketsCampanha carregando={carregandoExtrato} extrato={extrato} />
            {Platform.OS === "web" ? (
                <FallbackWeb campanhaId={campanha.id} onProcessado={carregarExtrato} />
            ) : (
                <PainelLeitura leitura={leitura} />
            )}
            {extrato ? <HistoricoNotasLidas notas={extrato.notas} /> : null}
        </ScrollView>
    );
}

function CartaoCampanhaVigente({ campanha }: { campanha: CampanhaVigente }) {
    return (
        <View style={estilos.cartaoCampanha}>
            <Text style={estilos.rotuloCampanha}>Campanha vigente</Text>
            <Text style={estilos.tituloCampanha}>{campanha.nome}</Text>
            <Text style={estilos.metaCampanha}>
                {formatarDataCivil(campanha.dataInicioCivil)} – {formatarDataCivil(campanha.dataFimCivil)} ·{" "}
                {formatarMoeda(campanha.valorPorTicket)}/ticket
            </Text>
        </View>
    );
}

function FallbackWeb({ campanhaId, onProcessado }: { campanhaId: number; onProcessado: () => void }) {
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
            onProcessado();
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setProcessando(false);
        }
    }

    return (
        <View style={estilos.painel}>
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

type LeituraNfce = ReturnType<typeof useLeituraNfce>;

/** Estado do scanner nativo: abre a câmera sob demanda e a desliga ao ler, sair da aba ou fechar. */
function useLeituraNfce(campanhaId: number, aoProcessar: () => void) {
    const [permissao, solicitarPermissao] = useCameraPermissions();
    const [processando, setProcessando] = useState(false);
    const [cameraAberta, setCameraAberta] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const ultimaLeituraRef = useRef(0);
    const processandoRef = useRef(false);
    const campanhaIdRef = useRef(campanhaId);
    const aoProcessarRef = useRef(aoProcessar);

    useEffect(() => {
        campanhaIdRef.current = campanhaId;
        aoProcessarRef.current = aoProcessar;
    }, [campanhaId, aoProcessar]);

    const fecharCamera = useCallback(() => setCameraAberta(false), []);

    const processarLeitura = useCallback(async (dados: string) => {
        const agora = Date.now();
        if (processandoRef.current || agora - ultimaLeituraRef.current < INTERVALO_DEBOUNCE_MS) {
            return;
        }

        let payload: string;
        try {
            payload = parsearQrNfce(dados).payloadQr;
        } catch (causa) {
            setCameraAberta(false);
            setErro(normalizarErro(causa));
            return;
        }

        ultimaLeituraRef.current = agora;
        processandoRef.current = true;
        setCameraAberta(false);
        setProcessando(true);
        setErro(null);
        setSucesso(null);

        try {
            const resposta = await processarNfce({
                payloadQr: payload,
                campanhaId: campanhaIdRef.current,
            });
            const mensagem = mensagemSucesso(resposta);
            setSucesso(mensagem);
            aoProcessarRef.current();
            Alert.alert("Tickets creditados!", mensagem);
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            processandoRef.current = false;
            setProcessando(false);
        }
    }, []);

    async function abrirCamera() {
        setErro(null);
        setSucesso(null);
        const permissaoAtual = permissao?.granted ? permissao : await solicitarPermissao();
        if (!permissaoAtual.granted) {
            setErro("Permita o acesso à câmera para escanear a NFC-e.");
            return;
        }
        ultimaLeituraRef.current = 0;
        setCameraAberta(true);
    }

    return { cameraAberta, processando, erro, sucesso, abrirCamera, fecharCamera, processarLeitura };
}

function PainelLeitura({ leitura }: { leitura: LeituraNfce }) {
    const { processando, erro, sucesso } = leitura;
    return (
        <View style={estilos.painel}>
            <View style={estilos.cabecalhoPainel}>
                {processando ? (
                    <ActivityIndicator color={cores.primaria} />
                ) : (
                    <Ionicons
                        color={sucesso ? "#15803D" : cores.primaria}
                        name={sucesso ? "checkmark-circle" : "qr-code-outline"}
                        size={28}
                    />
                )}
                <Text style={estilos.tituloPainel}>
                    {processando
                        ? "Consultando NFC-e…"
                        : sucesso
                          ? "NFC-e processada com sucesso"
                          : erro
                            ? "Não foi possível processar a NFC-e"
                            : "Ler nota fiscal"}
                </Text>
            </View>
            <Text style={estilos.textoPainel}>
                {processando
                    ? "Aguarde a resposta da SEFAZ. A câmera já foi desligada."
                    : sucesso ?? "A câmera fica aberta só até identificar o QR code da NFC-e."}
            </Text>
            <MensagemErro mensagem={erro} />
            <Pressable
                accessibilityRole="button"
                disabled={processando}
                onPress={() => void leitura.abrirCamera()}
                style={({ pressed }) => [
                    estilos.botaoAcao,
                    processando && estilos.botaoDesabilitado,
                    pressed && !processando && estilos.pressionado,
                ]}
            >
                <Text style={estilos.textoBotaoAcao}>
                    {erro ? "Tentar novamente" : sucesso ? "Escanear outra NFC-e" : "Escanear NFC-e"}
                </Text>
            </Pressable>
        </View>
    );
}

function CameraNfce({ leitura }: { leitura: LeituraNfce }) {
    const emFoco = useIsFocused();
    return (
        <View style={estilos.containerCamera}>
            {emFoco ? (
                <CameraView
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={({ data }) => void leitura.processarLeitura(data)}
                    style={StyleSheet.absoluteFill}
                />
            ) : null}
            <View style={estilos.overlay}>
                <View style={estilos.moldura} />
                <Text style={estilos.instrucao}>Aponte para o QR da nota fiscal</Text>
            </View>
            <Pressable
                accessibilityLabel="Fechar câmera"
                accessibilityRole="button"
                onPress={leitura.fecharCamera}
                style={({ pressed }) => [estilos.botaoFecharCamera, pressed && estilos.pressionado]}
            >
                <Ionicons color="#FFFFFF" name="close" size={22} />
                <Text style={estilos.textoFecharCamera}>Fechar câmera</Text>
            </Pressable>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: { flex: 1 },
    centralizado: { alignItems: "center", flex: 1, justifyContent: "center" },
    conteudoEstado: {
        alignItems: "center",
        flex: 1,
        gap: 12,
        justifyContent: "center",
        padding: 24,
    },
    tituloEstado: { color: cores.texto, fontSize: 18, fontWeight: "800", textAlign: "center" },
    textoEstado: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20, textAlign: "center" },
    conteudoRolavel: { gap: 14, padding: 16, paddingBottom: 32 },
    rotuloCampanha: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "700" },
    cartaoCampanha: {
        backgroundColor: cores.primaria,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    tituloCampanha: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
    metaCampanha: { color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 2 },
    painel: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 18,
        borderWidth: 1,
        gap: 8,
        padding: 16,
    },
    cabecalhoPainel: { alignItems: "center", flexDirection: "row", gap: 10 },
    tituloPainel: { color: cores.texto, flex: 1, fontSize: 16, fontWeight: "800" },
    textoPainel: { color: cores.textoSecundario, fontSize: 13, lineHeight: 19 },
    avisoWeb: {
        alignItems: "flex-start",
        backgroundColor: cores.primariaSuave,
        borderRadius: 16,
        flexDirection: "row",
        gap: 10,
        padding: 14,
    },
    textoAvisoWeb: { color: cores.texto, flex: 1, fontSize: 14, lineHeight: 20 },
    rotulo: { color: cores.texto, fontSize: 14, fontWeight: "700" },
    campo: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 16,
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
        borderRadius: 16,
        marginTop: 8,
        overflow: "hidden",
        paddingVertical: 14,
    },
    botaoDesabilitado: { opacity: 0.7 },
    pressionado: { opacity: 0.88 },
    textoBotaoAcao: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
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
    botaoFecharCamera: {
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        borderRadius: 999,
        bottom: 32,
        flexDirection: "row",
        gap: 6,
        paddingHorizontal: 18,
        paddingVertical: 12,
        position: "absolute",
    },
    textoFecharCamera: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});
