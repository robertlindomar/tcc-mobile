import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { ProgressoConsumidor } from "@/types/api";

type Item = {
    chave: string;
    rotulo: string;
    valor: number;
    icone: keyof typeof Ionicons.glyphMap;
    cor: string;
    fundo: string;
};

function itensResumo(progresso: ProgressoConsumidor): Item[] {
    return [
        { chave: "pontos", rotulo: "Pontos", valor: progresso.pontos, icone: "sparkles", cor: cores.primaria, fundo: cores.primariaSuave },
        { chave: "tickets", rotulo: "Tickets", valor: progresso.ticketsCampanhasAtivas, icone: "ticket", cor: cores.ouro, fundo: cores.ouroSuave },
        { chave: "missoes", rotulo: "Missões", valor: progresso.missoesConcluidas, icone: "flag", cor: cores.primariaEscura, fundo: cores.primariaSuave },
        { chave: "lojas", rotulo: "Lojas", valor: progresso.lojasVisitadas, icone: "storefront", cor: cores.coral, fundo: cores.perigoSuave },
        { chave: "notas", rotulo: "Notas lidas", valor: progresso.notasLidas, icone: "receipt", cor: cores.primaria, fundo: cores.primariaSuave },
        { chave: "resgates", rotulo: "Resgates", valor: progresso.resgates, icone: "gift", cor: cores.coral, fundo: cores.perigoSuave },
    ];
}

/** Grade de contadores. `somente` limita aos itens indicados (ex.: Início mostra pontos e tickets). */
export function ResumoAtividades({
    progresso,
    somente,
}: {
    progresso: ProgressoConsumidor;
    somente?: string[];
}) {
    const itens = itensResumo(progresso).filter((item) => !somente || somente.includes(item.chave));
    return (
        <View style={estilos.grade}>
            {itens.map((item) => (
                <View
                    accessibilityLabel={`${item.rotulo}: ${item.valor}`}
                    key={item.chave}
                    style={[estilos.bloco, itens.length <= 2 && estilos.blocoLargo]}
                >
                    <View style={[estilos.icone, { backgroundColor: item.fundo }]}>
                        <Ionicons color={item.cor} name={item.icone} size={18} />
                    </View>
                    <Text style={estilos.valor}>{item.valor}</Text>
                    <Text style={estilos.rotulo}>{item.rotulo}</Text>
                </View>
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    grade: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    bloco: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 18,
        borderWidth: 1,
        flexBasis: "30%",
        flexGrow: 1,
        gap: 2,
        padding: 12,
    },
    blocoLargo: { flexBasis: "45%" },
    icone: {
        alignItems: "center",
        borderRadius: 10,
        height: 32,
        justifyContent: "center",
        marginBottom: 6,
        width: 32,
    },
    valor: { color: cores.texto, fontSize: 22, fontWeight: "900" },
    rotulo: { color: cores.textoSecundario, fontSize: 12, fontWeight: "600" },
});
