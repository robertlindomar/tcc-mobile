import { requisitar } from "@/services/clienteHttp";
import { ProdutoCatalogo } from "@/types/api";

export async function listarProdutosCatalogo(lojistaId: number): Promise<ProdutoCatalogo[]> {
    return requisitar<ProdutoCatalogo[]>(`/produto/catalogo?lojistaId=${lojistaId}`);
}
