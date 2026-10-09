import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import { cores } from "@/styles/tema";
import { urlPublicaArquivo } from "@/utils/urlPublicaArquivo";

export function LogoLoja({ nome, urlLogo, tamanho = 48 }: { nome: string; urlLogo?: string | null; tamanho?: number }) {
    const uri = urlPublicaArquivo(urlLogo);
    const [uriComErro, setUriComErro] = useState<string | null>(null);

    return (
        <View style={[estilos.quadro, { height: tamanho, width: tamanho }]}>
            {uri && uri !== uriComErro ? (
                <Image
                    accessibilityIgnoresInvertColors
                    accessibilityLabel={`Logo de ${nome}`}
                    onError={() => setUriComErro(uri)}
                    resizeMode="contain"
                    source={{ uri }}
                    style={estilos.imagem}
                />
            ) : (
                <Ionicons color={cores.primaria} name="storefront-outline" size={22} />
            )}
        </View>
    );
}

const estilos = StyleSheet.create({
    quadro: {
        alignItems: "center",
        backgroundColor: cores.primariaSuave,
        borderRadius: 14,
        flexShrink: 0,
        height: 48,
        justifyContent: "center",
        overflow: "hidden",
        width: 48,
    },
    imagem: { backgroundColor: cores.superficie, height: "100%", width: "100%" },
});
