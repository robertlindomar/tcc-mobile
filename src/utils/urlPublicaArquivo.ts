import { obterUrlApi } from "@/config/ambiente";

export function urlPublicaArquivo(caminhoRelativo: string | null | undefined): string | null {
    if (!caminhoRelativo) {
        return null;
    }
    if (caminhoRelativo.startsWith("http://") || caminhoRelativo.startsWith("https://")) {
        return caminhoRelativo;
    }
    const base = obterUrlApi();
    return `${base}${caminhoRelativo.startsWith("/") ? "" : "/"}${caminhoRelativo}`;
}
