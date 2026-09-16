import { useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { CampoTexto } from "@/components/CampoTexto";
import { FundoPastel } from "@/components/FundoPastel";
import { LogoMarca } from "@/components/LogoMarca";
import { MensagemErro } from "@/components/MensagemErro";
import { useSessao } from "@/features/auth/ContextoSessao";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";

export default function TelaLogin() {
    const { entrar } = useSessao();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function enviar() {
        if (carregando) {
            return;
        }
        if (!email.trim() || !senha) {
            setErro("Preencha seu e-mail e sua senha.");
            return;
        }

        setErro(null);
        setCarregando(true);
        try {
            await entrar(email.trim(), senha);
        } catch (causa) {
            setErro(normalizarErro(causa));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <FundoPastel>
            <SafeAreaView style={estilos.areaSegura}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={estilos.container}
                >
                    <View style={estilos.cabecalho}>
                        <LogoMarca />
                        <Text style={estilos.subtitulo}>Benefícios locais, perto de você.</Text>
                    </View>

                    <View style={estilos.cartao}>
                        <Text style={estilos.tituloCartao}>Entre na sua conta</Text>
                        <Text style={estilos.ajuda}>Acompanhe seus pontos e seu nível.</Text>
                        <CampoTexto
                            autoCapitalize="none"
                            autoComplete="email"
                            icone="mail-outline"
                            keyboardType="email-address"
                            onChangeText={setEmail}
                            placeholder="voce@exemplo.com"
                            rotulo="E-mail"
                            value={email}
                        />
                        <CampoTexto
                            autoComplete="password"
                            icone="lock-closed-outline"
                            onChangeText={setSenha}
                            onSubmitEditing={() => void enviar()}
                            placeholder="Sua senha"
                            rotulo="Senha"
                            secureTextEntry={!senhaVisivel}
                            value={senha}
                            acessorio={
                                <Pressable
                                    accessibilityLabel={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                                    hitSlop={10}
                                    onPress={() => setSenhaVisivel((visivel) => !visivel)}
                                >
                                    <Ionicons
                                        color={cores.textoSecundario}
                                        name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                    />
                                </Pressable>
                            }
                        />
                        <MensagemErro mensagem={erro} />
                        <BotaoPrimario carregando={carregando} aoPressionar={() => void enviar()} titulo="Entrar" />
                        <Text style={estilos.rodape}>
                            Ainda não tem uma conta?{" "}
                            <Link href="/(auth)/criar-conta" style={estilos.link}>
                                Criar conta
                            </Link>
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </FundoPastel>
    );
}

const estilos = StyleSheet.create({
    areaSegura: { flex: 1 },
    container: { flex: 1, justifyContent: "center", padding: 24 },
    cabecalho: { alignItems: "center", marginBottom: 28 },
    subtitulo: { color: cores.textoSecundario, fontSize: 15, marginTop: 12 },
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
    tituloCartao: { color: cores.texto, fontSize: 21, fontWeight: "700" },
    ajuda: { color: cores.textoSecundario, fontSize: 15, marginTop: -8 },
    rodape: { color: cores.textoSecundario, fontSize: 14, textAlign: "center" },
    link: { color: cores.primaria, fontWeight: "700", textDecorationLine: "underline" },
});
