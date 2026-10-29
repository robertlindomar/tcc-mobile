import { useState } from "react";
import { Link } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { CampoTexto } from "@/components/CampoTexto";
import { FundoPastel } from "@/components/FundoPastel";
import { LogoMarca } from "@/components/LogoMarca";
import { MensagemErro } from "@/components/MensagemErro";
import { esqueciSenhaApi } from "@/features/auth/servicoAuth";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";

const SENHA_PADRAO_TESTE = "senha123";

export default function TelaEsqueciSenha() {
    const [email, setEmail] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    async function redefinir() {
        if (carregando) {
            return;
        }
        if (!email.trim()) {
            setErro("Informe o e-mail da sua conta.");
            return;
        }

        setErro(null);
        setSucesso(null);
        setCarregando(true);
        try {
            await esqueciSenhaApi(email.trim());
            setSucesso(
                `Sua senha foi redefinida para "${SENHA_PADRAO_TESTE}". Entre com ela e troque assim que possível.`,
            );
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <FundoPastel>
            <SafeAreaView style={estilos.areaSegura}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={estilos.flex}>
                    <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
                        <View style={estilos.cabecalho}>
                            <LogoMarca />
                            <Text style={estilos.titulo}>Esqueci minha senha</Text>
                            <Text style={estilos.subtitulo}>
                                Modo de teste: a senha da conta será redefinida para {SENHA_PADRAO_TESTE}.
                            </Text>
                        </View>
                        <View style={estilos.cartao}>
                            <CampoTexto
                                autoCapitalize="none"
                                autoComplete="email"
                                icone="mail-outline"
                                keyboardType="email-address"
                                onChangeText={setEmail}
                                onSubmitEditing={() => void redefinir()}
                                placeholder="voce@exemplo.com"
                                rotulo="E-mail"
                                value={email}
                            />
                            <MensagemErro mensagem={erro} />
                            {sucesso ? (
                                <Text accessibilityRole="alert" style={estilos.sucesso}>
                                    {sucesso}
                                </Text>
                            ) : null}
                            <BotaoPrimario
                                carregando={carregando}
                                aoPressionar={() => void redefinir()}
                                titulo="Redefinir senha"
                            />
                            <Text style={estilos.rodape}>
                                Lembrou a senha?{" "}
                                <Link href="/(auth)" style={estilos.link}>
                                    Entrar
                                </Link>
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    areaSegura: { flex: 1 },
    flex: { flex: 1 },
    conteudo: { flexGrow: 1, justifyContent: "center", padding: 24 },
    cabecalho: { alignItems: "center", marginBottom: 24 },
    titulo: { color: cores.texto, fontSize: 28, fontWeight: "800", marginTop: 16, textAlign: "center" },
    subtitulo: {
        color: cores.textoSecundario,
        fontSize: 15,
        lineHeight: 22,
        marginTop: 8,
        textAlign: "center",
    },
    cartao: {
        backgroundColor: cores.superficie,
        borderColor: cores.borda,
        borderRadius: 20,
        borderWidth: 1,
        elevation: 2,
        gap: 16,
        padding: 22,
        shadowColor: cores.sidebar,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
    },
    sucesso: {
        backgroundColor: cores.primariaSuave,
        borderRadius: 16,
        color: cores.primariaEscura,
        fontSize: 14,
        lineHeight: 20,
        padding: 12,
    },
    rodape: { color: cores.textoSecundario, fontSize: 14, textAlign: "center" },
    link: { color: cores.primaria, fontWeight: "700", textDecorationLine: "underline" },
});
