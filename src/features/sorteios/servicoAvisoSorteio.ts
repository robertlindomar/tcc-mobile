import { requisitar } from "@/services/clienteHttp";

export type AvisoSorteio = {
    resultadoId: number;
    sorteioId: number;
    campanha: { id: number; nome: string; descricao: string | null };
    associacao: string;
    numeroSorteado: number;
    nomeVencedor: string;
    souVencedor: boolean;
    situacao: "AGUARDANDO_ENTREGA" | "ENTREGUE";
    dataSorteio: string;
    dataConfirmacaoLeitura: string | null;
    dataLimiteRetirada: string;
    prazoEncerrado: boolean;
};

export function listarAvisosSorteio() {
    return requisitar<AvisoSorteio[]>("/sorteio/resultados");
}

export function ocultarAvisoSorteio(resultadoId: number) {
    return requisitar<void>(`/sorteio/resultados/${resultadoId}/ocultar`, { metodo: "PATCH" });
}

export function confirmarLeituraSorteio(resultadoId: number) {
    return requisitar<{ dataConfirmacaoLeitura: string }>(`/sorteio/resultados/${resultadoId}/confirmar-leitura`, { metodo: "PATCH" });
}
