import { formatarDataCivil } from "@/utils/formatarDataCivil";

describe("formatarDataCivil", () => {
    it("converte YYYY-MM-DD para o formato brasileiro", () => {
        expect(formatarDataCivil("2025-05-31")).toBe("31/05/2025");
    });
});
