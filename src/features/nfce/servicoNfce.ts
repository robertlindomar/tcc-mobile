import { requisitar } from "@/services/clienteHttp";
import { RespostaProcessamentoNfce } from "@/types/api";

export async function processarNfce(dados: {
    payloadQr: string;
    campanhaId?: number;
}): Promise<RespostaProcessamentoNfce> {
    return requisitar<RespostaProcessamentoNfce>("/nfce/processar", {
        metodo: "POST",
        corpo: {
            payloadQr: dados.payloadQr,
            ...(dados.campanhaId !== undefined ? { campanhaId: dados.campanhaId } : {}),
        },
    });
}
