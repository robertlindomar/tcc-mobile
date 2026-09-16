import { requisitar } from "@/services/clienteHttp";
import { MissaoConsumidor, RespostaConclusaoMissao } from "@/types/api";

export async function listarHistoricoMissoes(): Promise<MissaoConsumidor[]> {
    return requisitar<MissaoConsumidor[]>("/missao-consumidor");
}

export async function concluirMissaoPorToken(tokenQr: string): Promise<RespostaConclusaoMissao> {
    return requisitar<RespostaConclusaoMissao>("/missao-consumidor/concluir", {
        metodo: "POST",
        corpo: { tokenQr },
    });
}
