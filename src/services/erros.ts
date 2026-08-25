export type TipoErroApi = "HTTP" | "REDE" | "CONFIGURACAO";

export class ErroApi extends Error {
    constructor(
        message: string,
        readonly tipo: TipoErroApi,
        readonly status?: number,
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
