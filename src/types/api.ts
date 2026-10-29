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
    urlLogo?: string | null;
    distanciaKm?: number | null;
};

export type LojaCatalogoDetalhe = {
    id: number;
    nomeFantasia: string;
    urlLogo?: string | null;
    enderecoTexto: string | null;
    latitude: number | null;
    longitude: number | null;
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

export type FrequenciaMissao = "UMA_VEZ" | "DIARIA" | "SEMANAL" | "MENSAL";

export type MissaoCatalogo = {
    id: number;
    nome: string;
    descricao: string | null;
    pontoRecompensa: number;
    frequencia: FrequenciaMissao;
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

export type StatusResgateRecompensa = "PENDENTE_ENTREGA" | "ENTREGUE" | "RECUSADO";

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

/** Resposta de POST /nfce/processar. */
export type RespostaProcessamentoNfce = {
    id: number;
    campanhaId: number;
    /** Edição da campanha que recebeu os tickets (numeração recomeça a cada edição). */
    edicao?: number;
    chaveAcesso: string;
    valorNota: number;
    ticketsGerados: number;
    residualAntes: number;
    residualApos: number;
    ticketsTotaisCampanha: number;
    lojistaId: number;
    dataEmissao: string;
    modoSimulado: boolean;
    provider?: "simulado" | "sefaz" | "teste";
    statusFiscal?: string;
};

/** Item de GET /nfce/campanhas-vigentes */
export type CampanhaVigente = {
    id: number;
    nome: string;
    dataInicioCivil: string;
    dataFimCivil: string;
    valorPorTicket: number;
};

export type NotaLidaCampanha = {
    id: number;
    valorNota: number;
    ticketsGerados: number;
    numerosTickets: { primeiro: number; ultimo: number } | null;
    dataEmissao: string;
    dataLeitura: string;
    loja: { nome: string; cnpj: string };
};

export type ExtratoCampanha = {
    campanhaId: number;
    edicao: number;
    valorPorTicket: number;
    totalTickets: number;
    valorResidual: number;
    faltaParaProximoTicket: number;
    notas: NotaLidaCampanha[];
};
