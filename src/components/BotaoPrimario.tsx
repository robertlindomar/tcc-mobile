import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { cores } from "@/styles/tema";

type Props = {
    titulo: string;
    aoPressionar: () => void;
    carregando?: boolean;
    desabilitado?: boolean;
    variante?: "primario" | "perigo" | "secundario";
    estilo?: ViewStyle;
};

export function BotaoPrimario({
    titulo,
    aoPressionar,
    carregando = false,
    desabilitado = false,
    variante = "primario",
    estilo,
}: Props) {
    const bloqueado = carregando || desabilitado;
    const estiloVariante = estilos[variantes[variante]];

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: bloqueado, busy: carregando }}
            disabled={bloqueado}
            onPress={aoPressionar}
            style={({ pressed }) => [
                estilos.botao,
                estiloVariante,
                bloqueado && estilos.botaoDesabilitado,
                pressed && !bloqueado && estilos.botaoPressionado,
                estilo,
            ]}
        >
            {carregando ? (
                <ActivityIndicator color={variante === "secundario" ? cores.primaria : "#FFFFFF"} />
            ) : (
                <Text style={[estilos.texto, variante === "secundario" && estilos.textoSecundario]}>
                    {titulo}
                </Text>
            )}
        </Pressable>
    );
}

const variantes = {
    primario: "primario",
    perigo: "perigo",
    secundario: "secundario",
} as const;

const estilos = StyleSheet.create({
    botao: {
        alignItems: "center",
        borderRadius: 16,
        justifyContent: "center",
        minHeight: 52,
        overflow: "hidden",
        paddingHorizontal: 20,
    },
    primario: { backgroundColor: cores.primaria },
    perigo: { backgroundColor: cores.perigo },
    secundario: {
        backgroundColor: cores.superficie,
        borderColor: cores.primaria,
        borderRadius: 999,
        borderWidth: 1.5,
    },
    botaoDesabilitado: { opacity: 0.55 },
    botaoPressionado: { opacity: 0.84 },
    texto: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
    textoSecundario: { color: cores.primaria },
});
