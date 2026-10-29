import { useRef, useState } from "react";
import { Platform } from "react-native";
import { escolherApk, extrairShaDoApk, precisaAtualizar } from "./regrasAtualizacao";
import { abrirInstalador, baixarApk, buscarUltimaRelease } from "./servicoAtualizacao";

type EstadoAtualizacao =
    | { tipo: "ocioso" | "verificando" | "atualizado" | "instalando" }
    | { tipo: "baixando"; progresso: number }
    | { tipo: "erro"; mensagem: string };

export function useVerificarAtualizacao() {
    const buildSha = process.env.EXPO_PUBLIC_BUILD_SHA ?? "";
    const [estado, setEstado] = useState<EstadoAtualizacao>({ tipo: "ocioso" });
    const emAndamento = useRef(false);
    const desenvolvimento = __DEV__ || !buildSha;
    const disponivel = Platform.OS === "android" && !desenvolvimento;
    const ocupado = estado.tipo === "verificando" || estado.tipo === "baixando" || estado.tipo === "instalando";
    let mensagem = desenvolvimento ? "Versão de desenvolvimento, sem verificação"
        : Platform.OS !== "android" ? "Atualização disponível apenas no Android." : "";
    if (estado.tipo === "atualizado") mensagem = "Você já está na versão mais recente";
    if (estado.tipo === "verificando") mensagem = "Verificando atualização…";
    if (estado.tipo === "baixando") mensagem = `Baixando ${Math.round(estado.progresso * 100)}%`;
    if (estado.tipo === "instalando") mensagem = "Confirme a instalação no Android.";
    if (estado.tipo === "erro") mensagem = estado.mensagem;

    async function verificar() {
        if (!disponivel || emAndamento.current) return;
        emAndamento.current = true;
        setEstado({ tipo: "verificando" });
        try {
            const apk = escolherApk(await buscarUltimaRelease());
            if (!apk) throw new Error("Nenhum APK disponível na última release.");
            const shaRelease = extrairShaDoApk(apk.name);
            if (!shaRelease) throw new Error("Não foi possível identificar a versão do APK.");
            if (!precisaAtualizar(buildSha, shaRelease)) {
                setEstado({ tipo: "atualizado" });
                return;
            }
            setEstado({ tipo: "baixando", progresso: 0 });
            const arquivo = await baixarApk(apk.browser_download_url, (progresso) =>
                setEstado({ tipo: "baixando", progresso }));
            setEstado({ tipo: "instalando" });
            await abrirInstalador(arquivo);
            setEstado({ tipo: "ocioso" });
        } catch (erro) {
            setEstado({ tipo: "erro", mensagem: erro instanceof Error ? erro.message : "Não foi possível atualizar o app." });
        } finally {
            emAndamento.current = false;
        }
    }

    return { buildSha, estado, mensagem, ocupado, disponivel, verificar };
}
