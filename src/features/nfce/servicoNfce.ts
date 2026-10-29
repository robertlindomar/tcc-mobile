import { requisitar } from "@/services/clienteHttp";
import { CampanhaVigente, ExtratoCampanha, RespostaProcessamentoNfce } from "@/types/api";

export async function listarCampanhasVigentes(): Promise<CampanhaVigente[]> {
    return requisitar<CampanhaVigente[]>("/nfce/campanhas-vigentes");
}

export async function buscarMeuExtrato(campanhaId: number): Promise<ExtratoCampanha> {
    return requisitar<ExtratoCampanha>(`/nfce/campanhas/${campanhaId}/meu-extrato`);
}

export async function processarNfce(dados: {
    payloadQr: string;
    campanhaId: number;
}): Promise<RespostaProcessamentoNfce> {
    return requisitar<RespostaProcessamentoNfce>("/nfce/processar", {
        metodo: "POST",
        tempoLimiteMs: 30_000,
        corpo: {
            payloadQr: dados.payloadQr,
            campanhaId: dados.campanhaId,
        },
    });
}
