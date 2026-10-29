export type ArquivoRelease = { name: string; browser_download_url: string };
export type Release = { assets: ArquivoRelease[] };

export function extrairShaDoApk(nome: string): string {
    return /^conecta-comercio-([a-f0-9]{7})\.apk$/i.exec(nome)?.[1] ?? "";
}

export function escolherApk(release: Release): ArquivoRelease | undefined {
    return release.assets.find((arquivo) => /\.apk$/i.test(arquivo.name) && arquivo.browser_download_url);
}

export function precisaAtualizar(shaInstalado: string, shaRelease: string): boolean {
    return Boolean(shaInstalado.trim() && shaRelease.trim()
        && shaInstalado.trim().toLowerCase() !== shaRelease.trim().toLowerCase());
}
