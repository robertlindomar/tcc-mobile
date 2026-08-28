export function formatarDisponibilidadeMissao(iso: string): string {
    const data = new Date(iso);
    if (Number.isNaN(data.getTime())) {
        return iso;
    }

    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/** Fallback local quando a API não envia disponivelEm (ex.: DIÁRIA). */
export function obterDataCivilSeguinteLocal(): string {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);

    return amanha.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
