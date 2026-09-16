function normalizarUrl(url: string): string {
    return url.trim().replace(/\/+$/, "");
}

export function obterUrlApi(): string {
    const url = process.env.EXPO_PUBLIC_API_URL;

    if (!url?.trim()) {
        throw new Error(
            "A API não foi configurada. Defina EXPO_PUBLIC_API_URL no arquivo .env.",
        );
    }

    return normalizarUrl(url);
}
