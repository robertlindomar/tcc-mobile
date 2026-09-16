import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { cores } from "@/styles/tema";
import { RecompensaCatalogo } from "@/types/api";

type Props = {
    recompensa: RecompensaCatalogo;
    resgatando: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
};

export function ModalConfirmarResgate({ recompensa, resgatando, onCancelar, onConfirmar }: Props) {
    return (
        <Modal animationType="fade" transparent visible onRequestClose={onCancelar}>
            <View style={estilos.overlay}>
                <View style={estilos.modal}>
                    <Text style={estilos.titulo}>Confirmar resgate</Text>
                    <Text style={estilos.texto}>
                        Recomendamos resgatar esta recompensa quando você estiver na loja. Após o
                        resgate, apresente a tela ao estabelecimento para confirmar a entrega.
                    </Text>
                    <Text style={estilos.resumo}>
                        {recompensa.nome} · {recompensa.custoPontos} pts
                    </Text>
                    <View style={estilos.acoes}>
                        <Pressable
                            accessibilityRole="button"
                            disabled={resgatando}
                            onPress={onCancelar}
                            style={({ pressed }) => [
                                estilos.botaoSecundario,
                                pressed && estilos.pressionado,
                            ]}
                        >
                            <Text style={estilos.textoSecundario}>Cancelar</Text>
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            disabled={resgatando}
                            onPress={onConfirmar}
                            style={({ pressed }) => [
                                estilos.botaoPrimario,
                                resgatando && estilos.botaoDesabilitado,
                                pressed && !resgatando && estilos.pressionado,
                            ]}
                        >
                            <Text style={estilos.textoPrimario}>
                                {resgatando ? "Resgatando..." : "Confirmar resgate"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const estilos = StyleSheet.create({
    overlay: {
        alignItems: "center",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    modal: {
        backgroundColor: cores.superficie,
        borderRadius: 20,
        gap: 12,
        maxWidth: 420,
        padding: 20,
        width: "100%",
    },
    titulo: { color: cores.texto, fontSize: 18, fontWeight: "800" },
    texto: { color: cores.textoSecundario, fontSize: 14, lineHeight: 20 },
    resumo: { color: cores.texto, fontSize: 14, fontWeight: "600" },
    acoes: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 4 },
    botaoSecundario: {
        borderColor: cores.borda,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    botaoPrimario: {
        backgroundColor: cores.primaria,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    botaoDesabilitado: { opacity: 0.6 },
    pressionado: { opacity: 0.85 },
    textoSecundario: { color: cores.texto, fontSize: 14, fontWeight: "600" },
    textoPrimario: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
