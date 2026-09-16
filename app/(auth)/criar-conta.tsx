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
import { useSessao } from "@/features/auth/ContextoSessao";
import { cadastrarConsumidorApi } from "@/features/auth/servicoAuth";
import { normalizarErro } from "@/services/normalizarErro";
import { cores } from "@/styles/tema";
import { formatarCep, formatarCpf } from "@/utils/mascaras";

export default function TelaCriarConta() {
    const { entrar } = useSessao();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [cpf, setCpf] = useState("");
    const [cep, setCep] = useState("");
    const [numero, setNumero] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [carregando, setCarregando] = useState(false);

    async function cadastrar() {
        if (carregando) {
            return;
        }
        if (!nome.trim() || !email.trim() || !senha || !cpf || !cep) {
            setErro("Preencha os campos obrigatórios para criar sua conta.");
            return;
        }

        setErro(null);
        setSucesso(null);
        setCarregando(true);
        try {
            await cadastrarConsumidorApi({ nome, email, senha, cpf, cep, numero });
        } catch (causa) {
            setErro(normalizarErro(causa));
            setCarregando(false);
            return;
        }

        try {
            await entrar(email.trim(), senha);
        } catch {
            setSucesso("Conta criada com sucesso. Entre com seu e-mail e senha para continuar.");
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
                            <Text style={estilos.titulo}>Crie sua conta</Text>
                            <Text style={estilos.subtitulo}>
                                Tudo pronto para começar a aproveitar o comércio local.
                            </Text>
                        </View>
                        <View style={estilos.cartao}>
                            <CampoTexto
                                autoComplete="name"
                                icone="person-outline"
                                onChangeText={setNome}
                                placeholder="Seu nome completo"
                                rotulo="Nome"
                                value={nome}
                            />
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
                                autoComplete="new-password"
                                icone="lock-closed-outline"
                                onChangeText={setSenha}
                                placeholder="Crie uma senha"
                                rotulo="Senha"
                                secureTextEntry
                                value={senha}
                            />
                            <CampoTexto
                                icone="card-outline"
                                keyboardType="numeric"
                                onChangeText={(valor) => setCpf(formatarCpf(valor))}
                                placeholder="000.000.000-00"
                                rotulo="CPF"
                                value={cpf}
                            />
                            <CampoTexto
                                icone="location-outline"
                                keyboardType="numeric"
                                onChangeText={(valor) => setCep(formatarCep(valor))}
                                placeholder="00000-000"
                                rotulo="CEP"
                                value={cep}
                            />
                            <CampoTexto
                                icone="home-outline"
                                keyboardType="default"
                                onChangeText={setNumero}
                                placeholder="Ex.: 100"
                                rotulo="Número (opcional)"
                                value={numero}
                            />
                            <MensagemErro mensagem={erro} />
                            {sucesso ? (
                                <Text accessibilityRole="alert" style={estilos.sucesso}>
                                    {sucesso}
                                </Text>
                            ) : null}
                            <BotaoPrimario carregando={carregando} aoPressionar={() => void cadastrar()} titulo="Criar conta" />
                            <Text style={estilos.rodape}>
                                Já tem uma conta?{" "}
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
