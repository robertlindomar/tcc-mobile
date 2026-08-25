import * as SecureStore from "expo-secure-store";

const CHAVE_TOKEN = "conecta_comercio.token";

function armazenamentoNavegador(): Storage | undefined {
    if (typeof globalThis.localStorage === "undefined") {
        return undefined;
    }
    return globalThis.localStorage;
}

export async function salvarToken(token: string): Promise<void> {
    if (await SecureStore.isAvailableAsync()) {
        await SecureStore.setItemAsync(CHAVE_TOKEN, token);
        return;
    }
    armazenamentoNavegador()?.setItem(CHAVE_TOKEN, token);
}

export async function obterToken(): Promise<string | null> {
    if (await SecureStore.isAvailableAsync()) {
        return SecureStore.getItemAsync(CHAVE_TOKEN);
    }
    return armazenamentoNavegador()?.getItem(CHAVE_TOKEN) ?? null;
}

export async function removerToken(): Promise<void> {
    if (await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync(CHAVE_TOKEN);
        return;
    }
    armazenamentoNavegador()?.removeItem(CHAVE_TOKEN);
}
