export type TipoErroApi = "HTTP" | "REDE" | "CONFIGURACAO";

export class ErroApi extends Error {
    constructor(
        message: string,
        readonly tipo: TipoErroApi,
        readonly status?: number,
        readonly disponivelEm?: string | null,
        readonly frequencia?: string | null,
        readonly repetivel?: boolean | null,
    ) {
        super(message);
        this.name = "ErroApi";
    }
}

export class ErroDominio extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ErroDominio";
    }
}
