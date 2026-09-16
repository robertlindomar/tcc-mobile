import { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { cores } from "@/styles/tema";

type Props = TextInputProps & {
    rotulo: string;
    erro?: string;
    acessorio?: ReactNode;
    icone?: keyof typeof Ionicons.glyphMap;
};

export function CampoTexto({ rotulo, erro, acessorio, icone, style, ...props }: Props) {
    return (
        <View style={estilos.grupo}>
            <Text style={estilos.rotulo}>{rotulo}</Text>
            <View style={[estilos.caixa, erro && estilos.caixaErro]}>
                {icone ? (
                    <Ionicons color={cores.textoSecundario} name={icone} size={20} style={estilos.icone} />
                ) : null}
                <TextInput
                    accessibilityLabel={rotulo}
                    placeholderTextColor="#94A3B8"
                    style={[estilos.entrada, style]}
                    {...props}
                />
                {acessorio}
            </View>
            {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
        </View>
    );
}

const estilos = StyleSheet.create({
    grupo: { gap: 7 },
    rotulo: { color: cores.texto, fontSize: 14, fontWeight: "600" },
    caixa: {
        alignItems: "center",
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: "row",
        minHeight: 52,
        paddingHorizontal: 14,
    },
    caixaErro: { borderColor: cores.perigo },
    icone: { marginRight: 8 },
    entrada: { color: cores.texto, flex: 1, fontSize: 16, minHeight: 50 },
    erro: { color: cores.perigo, fontSize: 13 },
});
