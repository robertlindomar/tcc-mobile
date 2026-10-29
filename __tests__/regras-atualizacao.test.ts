import { escolherApk, extrairShaDoApk, precisaAtualizar } from "../src/features/atualizacao/regrasAtualizacao";

describe("atualização por APK", () => {
    test.each([
        ["conecta-comercio-28534a3.apk", "28534a3"],
        ["conecta-comercio-ABC1234.APK", "ABC1234"],
        ["conecta-comercio.apk", ""],
        ["conecta-comercio-xyz1234.apk", ""],
        ["conecta-comercio-28534a3.apk.zip", ""],
    ])("extrai SHA de %s", (nome, esperado) => {
        expect(extrairShaDoApk(nome)).toBe(esperado);
    });

    test("escolhe o primeiro APK com endereço de download", () => {
        const apk = { name: "conecta-comercio-28534a3.apk", browser_download_url: "https://github.com/app.apk" };
        expect(escolherApk({ assets: [
            { name: "notas.txt", browser_download_url: "https://github.com/notas.txt" },
            { name: "sem-url.apk", browser_download_url: "" }, apk,
            { name: "outro.apk", browser_download_url: "https://github.com/outro.apk" },
        ] })).toBe(apk);
        expect(escolherApk({ assets: [] })).toBeUndefined();
    });

    test.each([
        ["28534a3", "28534a3", false], ["ABC1234", "abc1234", false],
        ["", "28534a3", false], ["28534a3", "", false], ["", "", false],
        ["28534a3", "1234567", true],
    ])("compara %s com %s", (instalado, release, esperado) => {
        expect(precisaAtualizar(instalado, release)).toBe(esperado);
    });
});
