import { parsearQrNfce } from "@/features/nfce/parsearQrNfce";

const CHAVE = "35260822399004000631650010001161211824962233";

describe("parsearQrNfce", () => {
    it("preserva o link completo necessário à consulta pública", () => {
        const payload = `https://www.nfce.fazenda.sp.gov.br/NFCeConsultaPublica/Paginas/ConsultaQRCode.aspx?p=${CHAVE}|2|1|1|HASH`;
        expect(parsearQrNfce(`  ${payload}  `)).toEqual({ chaveAcesso: CHAVE, payloadQr: payload });
    });
    it("decodifica &amp; produzido por alguns leitores", () => {
        expect(parsearQrNfce(`https://exemplo.test/?chNFe=${CHAVE}&amp;x=1`).payloadQr).toContain("&x=1");
    });
    it("aceita chave crua para providers compatíveis", () => {
        expect(parsearQrNfce(CHAVE).chaveAcesso).toBe(CHAVE);
    });
    it.each(["", "https://example.test/sem-chave", "123"])("rejeita payload inválido: %s", (payload) => {
        expect(() => parsearQrNfce(payload)).toThrow(/QR code|chave NFC-e/);
    });
    it("rejeita modelo diferente de 65", () => {
        const nfeModelo55 = `${CHAVE.slice(0, 20)}55${CHAVE.slice(22)}`;
        expect(() => parsearQrNfce(nfeModelo55)).toThrow("modelo 65");
    });
});
