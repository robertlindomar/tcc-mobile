import { requisitar } from "@/services/clienteHttp";
import { CatalogoRecompensas, RespostaResgatarRecompensa } from "@/types/api";

export async function obterCatalogoRecompensas(): Promise<CatalogoRecompensas> {
    return requisitar<CatalogoRecompensas>("/recompensa/catalogo");
}

export async function resgatarRecompensa(id: number): Promise<RespostaResgatarRecompensa> {
    return requisitar<RespostaResgatarRecompensa>(`/recompensa/${id}/resgatar`, {
        metodo: "POST",
    });
}
