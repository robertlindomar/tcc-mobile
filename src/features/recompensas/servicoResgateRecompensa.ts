import { requisitar } from "@/services/clienteHttp";
import { ResgateRecompensa } from "@/types/api";

export async function listarMeusResgates(): Promise<ResgateRecompensa[]> {
    return requisitar<ResgateRecompensa[]>("/resgate-recompensa");
}
