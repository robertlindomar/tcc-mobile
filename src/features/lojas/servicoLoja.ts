import { requisitar } from "@/services/clienteHttp";
import { LojaCatalogo, LojaCatalogoDetalhe } from "@/types/api";

export async function listarLojasCatalogo(): Promise<LojaCatalogo[]> {
    return requisitar<LojaCatalogo[]>("/lojista/catalogo");
}

export async function buscarLojaCatalogo(id: number): Promise<LojaCatalogoDetalhe> {
    return requisitar<LojaCatalogoDetalhe>(`/lojista/catalogo/${id}`);
}
