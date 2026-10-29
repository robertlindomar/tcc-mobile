import { requisitar } from "@/services/clienteHttp";
import { LojaDestaque, ProgressoConsumidor } from "@/types/api";

export async function buscarMeuProgresso(): Promise<ProgressoConsumidor> {
    return requisitar<ProgressoConsumidor>("/consumidor/me/progresso");
}

export async function listarLojasDestaque(): Promise<LojaDestaque[]> {
    return requisitar<LojaDestaque[]>("/lojista/catalogo/destaques");
}
