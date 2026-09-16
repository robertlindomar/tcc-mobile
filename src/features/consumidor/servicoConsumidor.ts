import { requisitar } from "@/services/clienteHttp";
import { PerfilConsumidorAtual } from "@/types/api";

export async function obterPerfilAtual(token?: string): Promise<PerfilConsumidorAtual> {
    return requisitar<PerfilConsumidorAtual>("/consumidor/me", { token });
}
