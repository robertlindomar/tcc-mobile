jest.mock("expo-secure-store", () => ({
    __esModule: true,
    isAvailableAsync: jest.fn(),
    setItemAsync: jest.fn(),
    getItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

import * as SecureStore from "expo-secure-store";
import { obterToken, removerToken, salvarToken } from "@/storage/token";

const secureStoreMock = SecureStore as jest.Mocked<typeof SecureStore>;

describe("armazenamento do token", () => {
    beforeEach(() => jest.clearAllMocks());

    describe("quando o cofre nativo está disponível", () => {
        beforeEach(() => {
            secureStoreMock.isAvailableAsync.mockResolvedValue(true);
        });

        it("centraliza a gravação no SecureStore", async () => {
            await salvarToken("jwt-de-teste");

            expect(secureStoreMock.setItemAsync).toHaveBeenCalledWith(
                "conecta_comercio.token",
                "jwt-de-teste",
            );
        });

        it("consulta e remove o token sem usar AsyncStorage", async () => {
            secureStoreMock.getItemAsync.mockResolvedValue("jwt-de-teste");

            await expect(obterToken()).resolves.toBe("jwt-de-teste");
            await removerToken();

            expect(secureStoreMock.deleteItemAsync).toHaveBeenCalledWith("conecta_comercio.token");
        });
    });

    describe("quando o cofre nativo não está disponível (web)", () => {
        const memoria: Record<string, string> = {};

        beforeEach(() => {
            Object.keys(memoria).forEach((chave) => delete memoria[chave]);
            secureStoreMock.isAvailableAsync.mockResolvedValue(false);
            Object.defineProperty(globalThis, "localStorage", {
                configurable: true,
                value: {
                    getItem: (chave: string) => memoria[chave] ?? null,
                    setItem: (chave: string, valor: string) => {
                        memoria[chave] = valor;
                    },
                    removeItem: (chave: string) => {
                        delete memoria[chave];
                    },
                },
            });
        });

        it("grava, lê e remove o token no localStorage", async () => {
            await salvarToken("jwt-web");

            expect(secureStoreMock.setItemAsync).not.toHaveBeenCalled();
            await expect(obterToken()).resolves.toBe("jwt-web");

            await removerToken();
            await expect(obterToken()).resolves.toBeNull();
        });
    });
});
