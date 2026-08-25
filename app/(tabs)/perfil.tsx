import { Ionicons } from "@expo/vector-icons";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { BotaoPrimario } from "@/components/BotaoPrimario";
import { useSessao } from "@/features/auth/ContextoSessao";
import { cores } from "@/styles/tema";

export default function TelaPerfil() {
    const { perfil, sair } = useSessao();
    const nome = perfil?.usuario.nome ?? "";
    const iniciais = nome
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();

    function confirmarSaida() {
        Alert.alert("Sair da conta", "Você precisará informar suas credenciais para entrar novamente.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: () => void sair() },
        ]);
    }

    return (
        <ScrollView contentContainerStyle={estilos.conteudo}>
            <View style={estilos.resumo}>
                <View style={estilos.avatar}><Text style={estilos.iniciais}>{iniciais}</Text></View>
                <Text style={estilos.nome}>{nome}</Text>
                <Text style={estilos.email}>{perfil?.usuario.email}</Text>
            </View>
            <View style={estilos.cartao}>
                <DadoPerfil icone="mail-outline" rotulo="E-mail" valor={perfil?.usuario.email ?? ""} />
                <View style={estilos.divisor} />
                <DadoPerfil icone="sparkles-outline" rotulo="Pontos" valor={`${perfil?.consumidor.pontos ?? 0} pts`} />
                <View style={estilos.divisor} />
                <DadoPerfil icone="ribbon-outline" rotulo="Nível" valor={`${perfil?.consumidor.nivel ?? 1}`} />
            </View>
            <BotaoPrimario aoPressionar={confirmarSaida} titulo="Sair" variante="secundario" />
        </ScrollView>
    );
}

function DadoPerfil({ icone, rotulo, valor }: { icone: keyof typeof Ionicons.glyphMap; rotulo: string; valor: string }) {
    return (
        <View style={estilos.linhaDado}>
            <Ionicons color={cores.primaria} name={icone} size={21} />
            <View style={estilos.textoDado}>
                <Text style={estilos.rotulo}>{rotulo}</Text>
                <Text style={estilos.valor}>{valor}</Text>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    conteudo: { backgroundColor: cores.fundo, flexGrow: 1, gap: 22, padding: 20 },
    resumo: { alignItems: "center", paddingVertical: 20 },
    avatar: { alignItems: "center", backgroundColor: cores.primaria, borderRadius: 44, height: 88, justifyContent: "center", width: 88 },
    iniciais: { color: "#FFFFFF", fontSize: 29, fontWeight: "800" },
    nome: { color: cores.texto, fontSize: 23, fontWeight: "800", marginTop: 14 },
    email: { color: cores.textoSecundario, fontSize: 15, marginTop: 5 },
    cartao: { backgroundColor: cores.superficie, borderColor: cores.borda, borderRadius: 18, borderWidth: 1, padding: 18 },
    linhaDado: { alignItems: "center", flexDirection: "row", gap: 13, paddingVertical: 7 },
    textoDado: { flex: 1 },
    rotulo: { color: cores.textoSecundario, fontSize: 13 },
    valor: { color: cores.texto, fontSize: 16, fontWeight: "600", marginTop: 3 },
    divisor: { backgroundColor: cores.borda, height: 1, marginVertical: 12 },
});
