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

export type MissaoConsumidor = {
    id: number;
    missaoId: number;
    consumidorId: number;
    chavePeriodo: string;
    dataCriacao: string;
    dataAtualizacao: string;
    nomeMissao?: string | null;
    pontoRecompensa?: number | null;
};

export type MissaoDisponivel = MissaoCatalogo & {
    lojistaId: number;
    nomeLoja: string;
};

export type RespostaConclusaoMissao = {
    missaoConsumidor: MissaoConsumidor;
    consumidor: PerfilConsumidorAtual["consumidor"];
};

export type SituacaoRecompensa = "DISPONIVEL" | "DESATIVADA" | "EXPIRADA" | "ESGOTADA";

export type StatusResgateRecompensa = "PENDENTE_ENTREGA" | "ENTREGUE";

export type RecompensaCatalogo = {
    id: number;
    nome: string;
    descricao: string | null;
    custoPontos: number;
    ativa: boolean;
    estoque: number | null;
    dataFim: string | null;
    dataFimCivil: string | null;
    situacao: SituacaoRecompensa;
    lojistaId: number;
    nomeLoja?: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
};

export type CatalogoRecompensas = {
    pontos: number;
    nivel: number;
    recompensas: RecompensaCatalogo[];
};

export type ResgateRecompensa = {
    id: number;
    recompensaId: number;
    consumidorId: number;
    custoPontosSnapshot: number;
    nomeRecompensaSnapshot: string;
    status: StatusResgateRecompensa;
    dataEntrega: string | null;
    dataCriacao: string;
    nomeConsumidor?: string | null;
};

export type RespostaResgatarRecompensa = {
    resgate: ResgateRecompensa;
    consumidor: {
        pontos: number;
        nivel: number;
    };
};
