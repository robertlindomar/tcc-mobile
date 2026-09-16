import { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
import { ProvedorSessao, useSessao } from "@/features/auth/ContextoSessao";
import { TelaRestauracao } from "@/components/TelaRestauracao";

void SplashScreen.preventAutoHideAsync();

function NavegacaoRaiz() {
    const { situacao, erroRestauracao, restaurar } = useSessao();

    useEffect(() => {
        if (situacao !== "CARREGANDO_SESSAO" || erroRestauracao) {
            void SplashScreen.hideAsync();
        }
    }, [erroRestauracao, situacao]);

    if (situacao === "CARREGANDO_SESSAO") {
        return <TelaRestauracao mensagem={erroRestauracao} aoTentarNovamente={() => void restaurar()} />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={situacao === "NAO_AUTENTICADO"}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Protected guard={situacao === "CONSUMIDOR_AUTENTICADO"}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
        </Stack>
    );
}

export default function LayoutRaiz() {
    return (
        <ProvedorSessao>
            <NavegacaoRaiz />
        </ProvedorSessao>
    );
}
