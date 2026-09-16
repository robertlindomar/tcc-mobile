import { Stack } from "expo-router";
import { cores } from "@/styles/tema";

export default function LayoutMissoes() {
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
            <Stack.Screen name="index" options={{ title: "Missões" }} />
            <Stack.Screen name="escanear" options={{ title: "Escanear QR" }} />
        </Stack>
    );
}
