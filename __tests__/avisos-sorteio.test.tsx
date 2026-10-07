import React from "react";
import { AppState, type AppStateStatus, Text } from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { AvisosSorteio } from "@/features/sorteios/AvisosSorteio";
import { confirmarLeituraSorteio, listarAvisosSorteio, ocultarAvisoSorteio } from "@/features/sorteios/servicoAvisoSorteio";

const { act, create } = jest.requireActual("react-test-renderer");
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
jest.mock("@/features/auth/ContextoSessao", () => ({ useSessao: () => ({ perfil: { usuario: { id: 20 } } }) }));
jest.mock("@/features/sorteios/servicoAvisoSorteio", () => ({ listarAvisosSorteio: jest.fn(), ocultarAvisoSorteio: jest.fn(), confirmarLeituraSorteio: jest.fn() }));
const listar = jest.mocked(listarAvisosSorteio);
const ocultar = jest.mocked(ocultarAvisoSorteio);
const confirmar = jest.mocked(confirmarLeituraSorteio);
const aviso = {
    resultadoId: 7, sorteioId: 3, campanha: { id: 1, nome: "Natal", descricao: null },
    associacao: "Associação", numeroSorteado: 42, nomeVencedor: "Maria", souVencedor: false,
    situacao: "AGUARDANDO_ENTREGA" as const, dataSorteio: "2026-10-06T12:00:00Z",
    dataConfirmacaoLeitura: null, dataLimiteRetirada: "2026-10-13T12:00:00Z", prazoEncerrado: false,
};
let tela: any;
let aoRetomar: (estado: AppStateStatus) => void;
async function montar() {
    await act(async () => { tela = create(<AvisosSorteio />); });
}
function botao(titulo: string) {
    return tela.root.findAllByType(BotaoPrimario).find((item: any) => item.props.titulo === titulo);
}
function textos() { return tela.root.findAllByType(Text).map((item: any) => item.props.children).join(" "); }

beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-06T13:00:00Z"));
    jest.clearAllMocks();
    listar.mockResolvedValue([aviso]);
    ocultar.mockResolvedValue(undefined);
    confirmar.mockResolvedValue({ dataConfirmacaoLeitura: "2026-10-06T13:00:00Z" });
    jest.spyOn(AppState, "addEventListener").mockImplementation((_tipo, fn) => {
        aoRetomar = fn;
        return { remove: jest.fn() };
    });
});
afterEach(async () => {
    if (tela) await act(async () => tela.unmount());
    tela = null;
    jest.restoreAllMocks();
    jest.useRealTimers();
});
it("mostra o anúncio ao abrir sem ações exclusivas do ganhador", async () => {
    await montar();
    expect(textos()).toContain("Maria");
    expect(botao("Confirmar que vi o resultado")).toBeUndefined();
});
it("fechar é temporário e não persiste a preferência", async () => {
    await montar();
    await act(async () => botao("Fechar").props.aoPressionar());
    expect(ocultar).not.toHaveBeenCalled();
    expect(tela.toJSON()).toBeNull();
    await act(async () => aoRetomar("active"));
    expect(tela.toJSON()).toBeNull();
});
it("ocultar salva por resultado e uma nova tentativa aparece ao retomar", async () => {
    await montar();
    await act(async () => botao("Não mostrar mais este resultado").props.aoPressionar());
    expect(ocultar).toHaveBeenCalledWith(7);
    listar.mockResolvedValue([{ ...aviso, resultadoId: 8, nomeVencedor: "João" }]);
    await act(async () => aoRetomar("active"));
    expect(textos()).toContain("João");
});
it("ganhador confirma a leitura antes de ocultar", async () => {
    listar.mockResolvedValue([{ ...aviso, souVencedor: true }]);
    await montar();
    expect(botao("Não mostrar mais este resultado").props.desabilitado).toBe(true);
    await act(async () => botao("Confirmar que vi o resultado").props.aoPressionar());
    expect(confirmar).toHaveBeenCalledWith(7);
    expect(textos()).toContain("Leitura confirmada!");
    expect(botao("Não mostrar mais este resultado").props.desabilitado).toBe(false);
});
it("prazo vencido remove a confirmação e informa o re-sorteio", async () => {
    listar.mockResolvedValue([{ ...aviso, souVencedor: true }]);
    await montar();
    await act(async () => {
        jest.setSystemTime(new Date("2026-10-13T12:00:01Z"));
        jest.advanceTimersByTime(1000);
    });
    expect(botao("Confirmar que vi o resultado")).toBeUndefined();
    expect(textos()).toContain("O prazo de retirada encerrou");
});
it("falha ao salvar não faz o aviso desaparecer", async () => {
    ocultar.mockRejectedValue(new Error("Falha de conexão"));
    await montar();
    await act(async () => botao("Não mostrar mais este resultado").props.aoPressionar());
    expect(textos()).toContain("Maria");
});
