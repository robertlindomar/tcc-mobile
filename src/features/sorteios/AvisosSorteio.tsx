import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { MensagemErro } from "@/components/MensagemErro";
import { useSessao } from "@/features/auth/ContextoSessao";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { AvisoSorteio, confirmarLeituraSorteio, listarAvisosSorteio, ocultarAvisoSorteio } from "./servicoAvisoSorteio";

/** Aviso compartilhado por todas as abas; consulta ao abrir/retomar o aplicativo. */
export function AvisosSorteio() {
    const { perfil } = useSessao();
    const usuarioId = perfil?.usuario.id;
    const [avisos, setAvisos] = useState<AvisoSorteio[]>([]);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [agora, setAgora] = useState(() => Date.now());
    useEffect(() => {
        const intervalo = setInterval(() => setAgora(Date.now()), 1_000);
        return () => clearInterval(intervalo);
    }, []);
    const fechadosNestaAbertura = useRef(new Set<number>());
    const versaoConsulta = useRef(0);
    const ativo = useRef(true);

    const carregar = useCallback(async () => {
        const versao = ++versaoConsulta.current;
        if (!usuarioId) return;
        try {
            const resultados = await listarAvisosSorteio();
            if (ativo.current && versao === versaoConsulta.current) {
                setAvisos(resultados.filter((item) => !fechadosNestaAbertura.current.has(item.resultadoId)));
            }
        } catch {
            // Falha de conexão no anúncio não impede o consumidor de usar o aplicativo.
            if (ativo.current && versao === versaoConsulta.current) setAvisos([]);
        }
    }, [usuarioId]);

    const encerrarConsulta = useCallback(() => {
        ativo.current = false;
        ++versaoConsulta.current;
    }, []);

    useEffect(() => {
        ativo.current = true;
        void carregar();
        const assinatura = AppState.addEventListener("change", (estado) => {
            if (estado === "active") void carregar();
        });
        return () => {
            encerrarConsulta();
            assinatura.remove();
        };
    }, [carregar, encerrarConsulta]);

    const aviso = avisos[0];
    function fechar() {
        if (!aviso || salvando) return;
        fechadosNestaAbertura.current.add(aviso.resultadoId);
        setAvisos((lista) => lista.filter((item) => item.resultadoId !== aviso.resultadoId));
        setErro(null);
    }

    async function confirmarLeitura() {
        if (!aviso || salvando) return;
        setErro(null);
        setSalvando(true);
        try {
            const resposta = await confirmarLeituraSorteio(aviso.resultadoId);
            if (!ativo.current) return;
            ++versaoConsulta.current;
            setAvisos((lista) => lista.map((item) => item.resultadoId === aviso.resultadoId
                ? { ...item, dataConfirmacaoLeitura: resposta.dataConfirmacaoLeitura } : item));
        } catch (falha) {
            if (ativo.current) setErro(normalizarErro(falha));
        } finally {
            if (ativo.current) setSalvando(false);
        }
    }

    async function naoMostrarMais() {
        if (!aviso || salvando) return;
        setErro(null);
        setSalvando(true);
        try {
            await ocultarAvisoSorteio(aviso.resultadoId);
            if (!ativo.current) return;
            fechadosNestaAbertura.current.add(aviso.resultadoId);
            setAvisos((lista) => lista.filter((item) => item.resultadoId !== aviso.resultadoId));
        } catch (falha) {
            if (ativo.current) setErro(normalizarErro(falha));
        } finally {
            if (ativo.current) setSalvando(false);
        }
    }

    if (!aviso) return null;
    const prazoEncerrado = aviso.prazoEncerrado || agora > new Date(aviso.dataLimiteRetirada).getTime();
    const precisaConfirmar = aviso.souVencedor && aviso.situacao === "AGUARDANDO_ENTREGA" &&
        !aviso.dataConfirmacaoLeitura && !prazoEncerrado;
    return (
        <Modal transparent visible animationType="fade" onRequestClose={fechar}>
            <View style={estilos.overlay}>
                <View style={estilos.modal} accessibilityViewIsModal>
                    <ScrollView contentContainerStyle={estilos.conteudo}>
                        <Ionicons name="trophy" size={44} color={cores.primaria} />
                        <Text style={estilos.titulo}>
                            {aviso.souVencedor ? "Parabéns, você ganhou!" : "Temos um ganhador!"}
                        </Text>
                        <Text style={estilos.campanha}>{aviso.campanha.nome}</Text>
                        <Text style={estilos.nome}>{aviso.nomeVencedor}</Text>
                        <Text style={estilos.numero}>Ticket #{aviso.numeroSorteado}</Text>
                        <Text style={estilos.texto}>{aviso.associacao}</Text>
                        {aviso.situacao === "ENTREGUE" ? (
                            <Text style={estilos.texto}>Prêmio entregue ao ganhador.</Text>
                        ) : null}
                        {aviso.situacao === "AGUARDANDO_ENTREGA" ? (
                            <View style={estilos.prazo}>
                                <Text style={estilos.texto}>
                                    {prazoEncerrado
                                        ? "O prazo de retirada encerrou. A associação poderá realizar um novo sorteio."
                                        : `Retirada até ${new Date(aviso.dataLimiteRetirada).toLocaleString("pt-BR")}.`}
                                </Text>
                                {aviso.souVencedor && !prazoEncerrado ? (
                                    <Text style={estilos.texto}>
                                        {aviso.dataConfirmacaoLeitura
                                            ? "Leitura confirmada! Procure a associação para retirar seu prêmio dentro do prazo."
                                            : "Confirme que viu este resultado e procure a associação para retirar seu prêmio. Você tem 7 dias a partir do sorteio."}
                                    </Text>
                                ) : null}
                            </View>
                        ) : null}
                        {precisaConfirmar ? (
                            <BotaoPrimario titulo="Confirmar que vi o resultado" carregando={salvando} aoPressionar={() => void confirmarLeitura()} />
                        ) : null}
                        <MensagemErro mensagem={erro} />
                        <BotaoPrimario titulo="Fechar" variante="secundario" desabilitado={salvando} aoPressionar={fechar} />
                        <BotaoPrimario titulo="Não mostrar mais este resultado" variante="secundario" carregando={salvando} desabilitado={precisaConfirmar} aoPressionar={() => void naoMostrarMais()} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const estilos = StyleSheet.create({
    overlay: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "rgba(7,22,46,0.55)" },
    modal: { width: "100%", maxWidth: 440, maxHeight: "90%", borderRadius: 24, backgroundColor: cores.superficie },
    conteudo: { padding: 24, gap: 14, alignItems: "stretch" },
    titulo: { fontSize: 25, fontWeight: "800", color: cores.texto },
    campanha: { fontSize: 16, color: cores.textoSecundario },
    nome: { fontSize: 23, fontWeight: "700", color: cores.texto },
    numero: { fontSize: 20, fontWeight: "700", color: cores.primaria },
    prazo: { borderRadius: 16, backgroundColor: cores.fundo, padding: 14, gap: 8 },
    texto: { fontSize: 14, lineHeight: 21, color: cores.textoSecundario },
});
