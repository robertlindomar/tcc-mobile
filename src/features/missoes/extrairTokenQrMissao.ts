export const PREFIXO_PAYLOAD_QR_MISSAO = "tcc://missao/";

export function extrairTokenQrMissao(entrada: unknown): string {
    if (typeof entrada !== "string") {
        return "";
    }
    const trim = entrada.trim();
    if (trim.startsWith(PREFIXO_PAYLOAD_QR_MISSAO)) {
        return trim.slice(PREFIXO_PAYLOAD_QR_MISSAO.length).trim();
    }
    return trim;
}
