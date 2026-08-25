import { requisitar } from "@/services/clienteHttp";
import { MissaoCatalogo } from "@/types/api";

export async function listarMissoesCatalogo(lojistaId: number): Promise<MissaoCatalogo[]> {
    return requisitar<MissaoCatalogo[]>(`/missao/catalogo?lojistaId=${lojistaId}`);
}
