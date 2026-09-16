import { ErroDominio } from "@/services/erros";

const CHAVE_NFCE = /\d{44}/;

export type QrNfceParseado = {
    chaveAcesso: string;
    payloadQr: string;
};

/** Validação rápida da câmera; dados fiscais e crédito continuam na API. */
export function parsearQrNfce(payloadLido: string): QrNfceParseado {
    const payloadQr = payloadLido.trim().replace(/&amp;/gi, "&");
    if (!payloadQr) throw new ErroDominio("O QR code está vazio.");

    let chaveAcesso: string | undefined;
    try {
        const url = new URL(payloadQr);
        const parametro = url.searchParams.get("p") ?? url.searchParams.get("chNFe");
        chaveAcesso = parametro?.split("|")[0]?.replace(/\D/g, "");
    } catch {
        chaveAcesso = payloadQr.match(CHAVE_NFCE)?.[0];
    }

    if (!chaveAcesso || !/^\d{44}$/.test(chaveAcesso)) {
        throw new ErroDominio("Este QR code não contém uma chave NFC-e válida.");
    }
    if (chaveAcesso.slice(20, 22) !== "65") {
        throw new ErroDominio("O documento lido não é uma NFC-e modelo 65.");
    }
    return { chaveAcesso, payloadQr };
}
