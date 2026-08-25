import { formatarMoeda } from "@/utils/formatarMoeda";

describe("formatarMoeda", () => {
    it("formata valor em real brasileiro", () => {
        expect(formatarMoeda(29.9)).toMatch(/R\$\s?29,90/);
    });
});
