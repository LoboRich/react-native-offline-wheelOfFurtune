import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Main Tabs layout */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* Modal screen */}
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', title: 'Modal' }}
      />

      {/* ✅ Wheel screen */}
      <Stack.Screen
        name="wheel"
        options={{ title: 'Wheel of Fortune' }}
      />
    </Stack>
  );
}
