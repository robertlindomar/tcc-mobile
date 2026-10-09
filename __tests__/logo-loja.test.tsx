import React from "react";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LogoLoja } from "@/features/lojas/components/LogoLoja";

jest.mock("@/config/ambiente", () => ({ obterUrlApi: () => "http://localhost:3000" }));
const { act, create } = jest.requireActual("react-test-renderer");
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let tela: any;
afterEach(async () => { if (tela) await act(async () => tela.unmount()); tela = null; });

it("exibe imagem da API sem cortar a logo", async () => {
    await act(async () => { tela = create(<LogoLoja nome="Padaria" urlLogo="/uploads/lojistas/logo.png" />); });
    const imagem = tela.root.findByType(Image);
    expect(imagem.props.source.uri).toBe("http://localhost:3000/uploads/lojistas/logo.png");
    expect(imagem.props.resizeMode).toBe("contain");
    expect(imagem.props.accessibilityLabel).toBe("Logo de Padaria");
});
it("mantém o ícone quando a loja não tem logo", async () => {
    await act(async () => { tela = create(<LogoLoja nome="Loja" />); });
    expect(tela.root.findAllByType(Image)).toHaveLength(0);
    expect(tela.root.findByType(Ionicons).props.name).toBe("storefront-outline");
});
it("volta ao ícone se o arquivo falha e tenta uma nova logo ao atualizar a URL", async () => {
    await act(async () => { tela = create(<LogoLoja nome="Loja" urlLogo="/uploads/lojistas/antiga.png" />); });
    await act(async () => tela.root.findByType(Image).props.onError());
    expect(tela.root.findAllByType(Image)).toHaveLength(0);
    await act(async () => tela.update(<LogoLoja nome="Loja" urlLogo="/uploads/lojistas/nova.png" />));
    expect(tela.root.findByType(Image).props.source.uri).toContain("nova.png");
});
