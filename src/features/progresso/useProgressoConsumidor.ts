import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { buscarMeuProgresso } from "@/features/progresso/servicoProgresso";
import { normalizarErro } from "@/services/normalizarErro";
import { ProgressoConsumidor } from "@/types/api";

/** Progresso do consumidor, recarregado sempre que a tela ganha foco. */
export function useProgressoConsumidor() {
    const [progresso, setProgresso] = useState<ProgressoConsumidor | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(true);

    const recarregar = useCallback(async () => {
        setErro(null);
        try {
            setProgresso(await buscarMeuProgresso());
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setCarregando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void recarregar();
        }, [recarregar]),
    );

    return { progresso, erro, carregando, recarregar };
}
