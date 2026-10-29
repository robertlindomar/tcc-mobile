import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { fracaoNivel, tituloDoNivel, xpParaProximoNivel } from "@/features/progresso/regrasProgresso";
import { cores } from "@/styles/tema";
import { ProgressoConsumidor } from "@/types/api";

/** Cartão de nível com barra de XP. `compacto` esconde a explicação (uso no Início). */
export function PainelXp({ progresso, compacto = false }: { progresso: ProgressoConsumidor; compacto?: boolean }) {
    const fracao = fracaoNivel(progresso);
    const faltam = xpParaProximoNivel(progresso);

    return (
        <View
            accessibilityLabel={`Nível ${progresso.nivel}, ${progresso.xp} XP, faltam ${faltam} XP para o próximo nível`}
            style={estilos.cartao}
        >
            <View style={[estilos.brilho, estilos.brilhoTopo]} />
            <View style={[estilos.brilho, estilos.brilhoBaixo]} />
            <View style={estilos.linhaTopo}>
                <View style={estilos.medalha}>
                    <Text style={estilos.rotuloMedalha}>NÍVEL</Text>
                    <Text style={estilos.numeroNivel}>{progresso.nivel}</Text>
                </View>
                <View style={estilos.blocoTitulo}>
                    <Text style={estilos.titulo}>{tituloDoNivel(progresso.nivel)}</Text>
                    <View style={estilos.linhaXp}>
                        <Ionicons color={cores.ouroSuave} name="flash" size={16} />
                        <Text style={estilos.xpTotal}>{progresso.xp} XP</Text>
                    </View>
                </View>
            </View>

            <View style={estilos.barra}>
                <View style={[estilos.preenchimento, { width: `${Math.round(fracao * 100)}%` }]} />
            </View>
            <View style={estilos.linhaRodape}>
                <Text style={estilos.textoRodape}>
                    {progresso.xp - progresso.xpInicioNivel}/{progresso.xpProximoNivel - progresso.xpInicioNivel} XP
                </Text>
                <Text style={estilos.textoRodape}>
                    faltam <Text style={estilos.destaque}>{faltam} XP</Text> para o nível {progresso.nivel + 1}
                </Text>
            </View>
            {compacto ? null : (
                <Text style={estilos.explicacao}>
                    Cada ponto ganho em missões vira XP. Gastar pontos em recompensas não tira seu XP.
                </Text>
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    cartao: {
        backgroundColor: cores.sidebar,
        borderRadius: 24,
        gap: 12,
        overflow: "hidden",
        padding: 18,
    },
    brilho: { backgroundColor: cores.primaria, borderRadius: 999, position: "absolute" },
    brilhoTopo: { height: 160, opacity: 0.35, right: -50, top: -70, width: 160 },
    brilhoBaixo: { bottom: -60, height: 120, left: -40, opacity: 0.2, width: 120 },
    linhaTopo: { alignItems: "center", flexDirection: "row", gap: 14 },
    medalha: {
        alignItems: "center",
        backgroundColor: cores.ouro,
        borderColor: cores.ouroSuave,
        borderRadius: 999,
        borderWidth: 3,
        height: 68,
        justifyContent: "center",
        width: 68,
    },
    rotuloMedalha: { color: cores.ouroSuave, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
    numeroNivel: { color: "#FFFFFF", fontSize: 26, fontWeight: "900", lineHeight: 28 },
    blocoTitulo: { flex: 1, gap: 4 },
    titulo: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
    linhaXp: { alignItems: "center", flexDirection: "row", gap: 4 },
    xpTotal: { color: cores.ouroSuave, fontSize: 15, fontWeight: "800" },
    barra: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 999, height: 12, overflow: "hidden" },
    preenchimento: { backgroundColor: cores.primariaViva, borderRadius: 999, height: 12 },
    linhaRodape: { flexDirection: "row", justifyContent: "space-between" },
    textoRodape: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" },
    destaque: { color: "#FFFFFF", fontWeight: "900" },
    explicacao: { color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 17 },
});
