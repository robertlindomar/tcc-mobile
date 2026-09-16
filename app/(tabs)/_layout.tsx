import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { cores } from "@/styles/tema";

export default function LayoutAbas() {
    return (
        <Tabs
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: cores.fundo },
                headerTitleStyle: {
                    color: cores.texto,
                    fontWeight: "700",
                    fontSize: 22,
                },
                tabBarActiveTintColor: cores.primaria,
                tabBarInactiveTintColor: cores.textoSecundario,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
                tabBarStyle: {
                    borderTopColor: cores.borda,
                    backgroundColor: cores.superficie,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 6,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Início",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons color={color} name="home-outline" size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="lojas"
                options={{
                    title: "Lojas",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons color={color} name="storefront-outline" size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="missoes"
                options={{
                    title: "Missões",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons color={color} name="flag-outline" size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="nfce"
                options={{
                    title: "Ler NFC-e",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons color={color} name="receipt-outline" size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recompensas"
                options={{
                    title: "Recompensas",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons color={color} name="gift-outline" size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons color={color} name="person-outline" size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}
