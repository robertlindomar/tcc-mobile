import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { listarConquistas } from "@/features/progresso/regrasProgresso";
import { cores } from "@/styles/tema";
import { ProgressoConsumidor } from "@/types/api";

export function ListaConquistas({ progresso }: { progresso: ProgressoConsumidor }) {
    const conquistas = listarConquistas(progresso);
    const total = conquistas.filter((item) => item.conquistada).length;

    return (
        <View style={estilos.secao}>
            <View style={estilos.cabecalho}>
                <Text style={estilos.titulo}>Conquistas</Text>
                <Text style={estilos.contador}>
                    {total}/{conquistas.length}
                </Text>
            </View>
            <View style={estilos.grade}>
                {conquistas.map((conquista) => (
                    <View
                        accessibilityLabel={`${conquista.titulo}: ${conquista.conquistada ? "conquistada" : `${conquista.atual} de ${conquista.meta}`}`}
                        key={conquista.id}
                        style={[estilos.medalha, !conquista.conquistada && estilos.medalhaBloqueada]}
                    >
                        <View style={[estilos.icone, conquista.conquistada ? estilos.iconeAtivo : estilos.iconeBloqueado]}>
                            <Ionicons
                                color={conquista.conquistada ? "#FFFFFF" : cores.textoSecundario}
                                name={conquista.conquistada ? conquista.icone : "lock-closed"}
                                size={20}
                            />
                        </View>
                        <Text numberOfLines={2} style={estilos.nome}>
                            {conquista.titulo}
                        </Text>
                        <Text numberOfLines={2} style={estilos.descricao}>
                            {conquista.conquistada ? conquista.descricao : `${conquista.atual}/${conquista.meta} · ${conquista.descricao}`}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    secao: { gap: 10 },
    cabecalho: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
    titulo: { color: cores.texto, fontSize: 17, fontWeight: "900" },
    contador: {
        backgroundColor: cores.ouroSuave,
        borderRadius: 999,
        color: cores.ouro,
        fontSize: 12,
        fontWeight: "900",
        overflow: "hidden",
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    grade: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    medalha: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.ouroSuave,
        borderRadius: 18,
        borderWidth: 1,
        flexBasis: "30%",
        flexGrow: 1,
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    medalhaBloqueada: { borderColor: cores.borda, opacity: 0.75 },
    icone: { alignItems: "center", borderRadius: 999, height: 44, justifyContent: "center", width: 44 },
    iconeAtivo: { backgroundColor: cores.ouro },
    iconeBloqueado: { backgroundColor: cores.fundo },
    nome: { color: cores.texto, fontSize: 12, fontWeight: "800", textAlign: "center" },
    descricao: { color: cores.textoSecundario, fontSize: 10, textAlign: "center" },
});
