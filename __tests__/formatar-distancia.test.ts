import { formatarDistancia } from "@/features/lojas/formatarDistancia";

describe("formatarDistancia", () => {
    it("exibe uma casa decimal para distancias curtas", () => {
        expect(formatarDistancia(2.34)).toBe("2,3 km de você");
    });

    it("arredonda distancias a partir de dez quilometros", () => {
        expect(formatarDistancia(12.6)).toBe("13 km de você");
    });
});
