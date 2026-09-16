import { requisitar } from "@/services/clienteHttp";
import { OfertaCatalogo } from "@/types/api";

export async function listarOfertasCatalogo(lojistaId: number): Promise<OfertaCatalogo[]> {
    return requisitar<OfertaCatalogo[]>(`/promocao/catalogo?lojistaId=${lojistaId}`);
}
