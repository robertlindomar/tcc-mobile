import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { Alert } from "react-native";
import { useSessao } from "@/features/auth/ContextoSessao";
import {
    aplicarResgateNoCatalogo,
} from "@/features/recompensas/regrasRecompensa";
import { resgatarRecompensa } from "@/features/recompensas/servicoRecompensa";
import { normalizarErro } from "@/services/normalizarErro";
import { RecompensaCatalogo, ResgateRecompensa } from "@/types/api";

type EstadoCatalogo = {
    pontos: number;
    nivel: number;
    recompensas: RecompensaCatalogo[];
};

type OpcoesUseResgateRecompensa = {
    estado: EstadoCatalogo;
    setEstado: Dispatch<SetStateAction<EstadoCatalogo>>;
    setResgates?: Dispatch<SetStateAction<ResgateRecompensa[]>>;
    setErro: (mensagem: string | null) => void;
};

export function useResgateRecompensa({
    estado,
    setEstado,
    setResgates,
    setErro,
}: OpcoesUseResgateRecompensa) {
    const { atualizarPerfil } = useSessao();
    const [recompensaPendente, setRecompensaPendente] = useState<RecompensaCatalogo | null>(null);
    const [resgatandoId, setResgatandoId] = useState<number | null>(null);

    const iniciarResgate = useCallback((recompensa: RecompensaCatalogo) => {
        setErro(null);
        setRecompensaPendente(recompensa);
    }, [setErro]);

    const cancelarResgate = useCallback(() => {
        if (resgatandoId === null) {
            setRecompensaPendente(null);
        }
    }, [resgatandoId]);

    const confirmarResgate = useCallback(async () => {
        if (!recompensaPendente) {
            return;
        }

        const recompensa = recompensaPendente;
        setResgatandoId(recompensa.id);
        setErro(null);

        try {
            const resposta = await resgatarRecompensa(recompensa.id);

            setEstado((atual) => ({
                pontos: resposta.consumidor.pontos,
                nivel: resposta.consumidor.nivel,
                recompensas: aplicarResgateNoCatalogo(atual.recompensas, recompensa.id),
            }));
            setResgates?.((atual) => [resposta.resgate, ...atual]);
            setRecompensaPendente(null);

            try {
                await atualizarPerfil();
            } catch {
                // POST já confirmou o resgate; não tratar falha de sincronização como erro do resgate.
            }

            Alert.alert(
                "Resgate realizado!",
                "Apresente este resgate ao estabelecimento para confirmar a entrega.",
            );
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setResgatandoId(null);
        }
    }, [atualizarPerfil, recompensaPendente, setErro, setEstado, setResgates]);

    return {
        estado,
        recompensaPendente,
        resgatandoId,
        iniciarResgate,
        cancelarResgate,
        confirmarResgate,
    };
}
