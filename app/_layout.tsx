import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Main Tabs layout */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
