import {
    PREFIXO_PAYLOAD_QR_MISSAO,
    extrairTokenQrMissao,
} from "@/features/missoes/extrairTokenQrMissao";

describe("extrairTokenQrMissao", () => {
    it("extrai token do payload tcc://missao/<token>", () => {
        const token = "ab".repeat(32);
        const payload = `${PREFIXO_PAYLOAD_QR_MISSAO}${token}`;
        expect(extrairTokenQrMissao(payload)).toBe(token);
    });

    it("aceita token cru com espaços", () => {
        const token = "ab".repeat(32);
        expect(extrairTokenQrMissao(`  ${token}  `)).toBe(token);
    });

    it("retorna vazio para entrada inválida", () => {
        expect(extrairTokenQrMissao(null)).toBe("");
        expect(extrairTokenQrMissao("")).toBe("");
    });
});
