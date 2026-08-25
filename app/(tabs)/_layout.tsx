import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { cores } from "@/styles/tema";

export default function LayoutAbas() {
    return (
        <Tabs
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: cores.superficie },
                headerTitleStyle: { color: cores.texto, fontWeight: "700" },
                tabBarActiveTintColor: cores.primaria,
                tabBarInactiveTintColor: cores.textoSecundario,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
                tabBarStyle: { borderTopColor: cores.borda },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Início",
                    tabBarIcon: ({ color, size }) => <Ionicons color={color} name="home-outline" size={size} />,
                }}
            />
            <Tabs.Screen
                name="lojas"
                options={{
                    title: "Lojas",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons color={color} name="storefront-outline" size={size} />,
                }}
            />
            <Tabs.Screen
                name="missoes"
                options={{
                    title: "Missões",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Ionicons color={color} name="flag-outline" size={size} />,
                }}
            />
            <Tabs.Screen
                name="recompensas"
                options={{
                    title: "Recompensas",
                    tabBarIcon: ({ color, size }) => <Ionicons color={color} name="gift-outline" size={size} />,
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => <Ionicons color={color} name="person-outline" size={size} />,
                }}
            />
        </Tabs>
    );
}
