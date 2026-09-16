import { Stack } from "expo-router";
import { cores } from "@/styles/tema";

export default function LayoutLojas() {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: { backgroundColor: cores.fundo },
                headerTitleStyle: { color: cores.texto, fontWeight: "700" },
                headerTintColor: cores.primaria,
                contentStyle: { backgroundColor: cores.fundo },
            }}
        >
            <Stack.Screen name="index" options={{ title: "Lojas" }} />
            <Stack.Screen name="[id]/index" options={{ title: "" }} />
            <Stack.Screen name="[id]/produtos" options={{ title: "Produtos" }} />
        </Stack>
    );
}
