import { requisitar } from "@/services/clienteHttp";
import { PapelUsuario, PerfilConsumidorAtual, UsuarioApi } from "@/types/api";

export type CredenciaisLogin = {
    email: string;
    senha: string;
};

export type RespostaLogin = {
    token: string;
    usuario: UsuarioApi;
};

export type DadosCadastroConsumidor = {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    cep: string;
    numero?: string;
};

export async function entrarApi(dados: CredenciaisLogin): Promise<RespostaLogin> {
    return requisitar<RespostaLogin>("/auth/login", {
        metodo: "POST",
        corpo: dados,
        token: "",
    });
}

export async function cadastrarConsumidorApi(
    dados: DadosCadastroConsumidor,
): Promise<PerfilConsumidorAtual> {
    return requisitar<PerfilConsumidorAtual>("/auth/cadastro-consumidor", {
        metodo: "POST",
        corpo: dados,
        token: "",
    });
}

export function usuarioEhConsumidor(role: PapelUsuario): boolean {
    return role === "CONSUMIDOR";
}
