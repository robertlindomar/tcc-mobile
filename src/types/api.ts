export type PapelUsuario = "ASSOCIACAO" | "LOJISTA" | "CONSUMIDOR";

export type UsuarioApi = {
    id: number;
    nome: string;
    email: string;
    role: PapelUsuario;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
};

export type PerfilConsumidorAtual = {
    usuario: UsuarioApi & { role: "CONSUMIDOR" };
    consumidor: {
        id: number;
        cpf: string;
        pontos: number;
        nivel: number;
        sexoId: number | null;
        usuarioId: number;
        dataCriacao: string;
        dataAtualizacao: string;
    };
};

export type LojaCatalogo = {
    id: number;
    nomeFantasia: string;
};

export type LojaCatalogoDetalhe = {
    id: number;
    nomeFantasia: string;
    enderecoTexto: string | null;
};

export type ProdutoCatalogo = {
    id: number;
    nome: string;
    valor: number;
    categoriaId: number | null;
    lojistaId: number;
    urlImagem: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
};

export type OfertaCatalogo = {
    id: number;
    descricao: string | null;
    preco: number;
    produtoId: number;
    produtoNome: string;
    percentualDesconto: number | null;
    dataFim: string;
    dataFimCivil: string;
};

export type MissaoCatalogo = {
    id: number;
    nome: string;
    descricao: string | null;
    pontoRecompensa: number;
    sistema: boolean;
};
