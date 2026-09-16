import { requisitar } from "@/services/clienteHttp";
import { LojaCatalogo, LojaCatalogoDetalhe } from "@/types/api";

export async function listarLojasCatalogo(localizacao?: {
    latitude: number;
    longitude: number;
}): Promise<LojaCatalogo[]> {
    const query = localizacao
        ? `?lat=${encodeURIComponent(localizacao.latitude)}&lng=${encodeURIComponent(localizacao.longitude)}`
        : "";
    return requisitar<LojaCatalogo[]>(`/lojista/catalogo${query}`);
}

export async function buscarLojaCatalogo(id: number): Promise<LojaCatalogoDetalhe> {
    return requisitar<LojaCatalogoDetalhe>(`/lojista/catalogo/${id}`);
}
