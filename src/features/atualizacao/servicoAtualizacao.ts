import type { Release } from "./regrasAtualizacao";

export async function buscarUltimaRelease(): Promise<Release> {
    const resposta = await fetch("https://api.github.com/repos/robertlindomar/tcc-mobile/releases/latest", {
        headers: { Accept: "application/vnd.github+json" },
    });
    if (!resposta.ok) {
        throw new Error(resposta.status === 403 || resposta.status === 429
            ? "Limite de consultas atingido. Tente novamente mais tarde."
            : "Não foi possível consultar a atualização. Tente novamente.");
    }
    const release = await resposta.json();
    if (!Array.isArray(release?.assets) || !release.assets.every((arquivo: Record<string, unknown>) =>
        arquivo && typeof arquivo.name === "string" && typeof arquivo.browser_download_url === "string")) {
        throw new Error("A release possui dados inválidos.");
    }
    return release;
}

export async function baixarApk(url: string, aoProgredir: (progresso: number) => void): Promise<string> {
    const arquivos = await import("expo-file-system/legacy");
    if (!arquivos.cacheDirectory) throw new Error("Cache indisponível para baixar a atualização.");
    const destino = `${arquivos.cacheDirectory}conecta-comercio.apk`;
    const download = arquivos.createDownloadResumable(url, destino, {}, (evento) => {
        aoProgredir(evento.totalBytesExpectedToWrite > 0
            ? Math.min(1, evento.totalBytesWritten / evento.totalBytesExpectedToWrite) : 0);
    });
    const resultado = await download.downloadAsync();
    if (!resultado || resultado.status !== 200) {
        await arquivos.deleteAsync(destino, { idempotent: true });
        throw new Error("Não foi possível baixar o APK. Tente novamente.");
    }
    return resultado.uri;
}

export async function abrirInstalador(arquivo: string): Promise<void> {
    const arquivos = await import("expo-file-system/legacy");
    const instalador = await import("expo-intent-launcher");
    const contentUri = await arquivos.getContentUriAsync(arquivo);
    await instalador.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        flags: 1,
        type: "application/vnd.android.package-archive",
    });
}
