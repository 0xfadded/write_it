import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Write It!' }} />
      <Stack.Screen name="language/[lang]" options={{ title: 'Language' }} />
      <Stack.Screen name="study/[alphabet]" options={{ title: 'Study' }} />
      <Stack.Screen name="test/[alphabet]" options={{ title: 'Test' }} />
    </Stack>
  );
}