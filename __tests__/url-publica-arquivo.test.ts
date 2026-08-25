jest.mock("@/config/ambiente", () => ({
    obterUrlApi: () => "http://localhost:3000",
}));

import { urlPublicaArquivo } from "@/utils/urlPublicaArquivo";

describe("urlPublicaArquivo", () => {
    it("concatena o caminho relativo à API", () => {
        expect(urlPublicaArquivo("/uploads/produtos/a.jpg")).toBe(
            "http://localhost:3000/uploads/produtos/a.jpg",
        );
    });

    it("devolve nulo quando não há imagem", () => {
        expect(urlPublicaArquivo(null)).toBeNull();
    });
});
