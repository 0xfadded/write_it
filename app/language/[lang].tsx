import { useLocalSearchParams, Link } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';

const ALPHABETS = {
  japanese: [
    { id: 'hiragana', name: 'Hiragana' },
    { id: 'katakana', name: 'Katakana' }
  ],
  chinese: [
    { id: 'hanzi', name: 'Hanzi (Basic)' }
  ],
  korean: [
    { id: 'hangul', name: 'Hangul' }
  ]
};

export default function LanguageMenu() {
  const { lang } = useLocalSearchParams<{ lang: keyof typeof ALPHABETS }>();

  const alphabets = lang && ALPHABETS[lang] ? ALPHABETS[lang] : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : ''}
      </Text>

      <View style={styles.menu}>
        {alphabets.map((alphabet) => (
          <View key={alphabet.id} style={styles.alphabetGroup}>
            <Text style={styles.alphabetName}>{alphabet.name}</Text>
            <View style={styles.actions}>
              <Link href={`/study/${alphabet.id}`} asChild>
                <Pressable style={StyleSheet.flatten([styles.button, styles.studyButton])}>
                  <Text style={styles.buttonText}>Study</Text>
                </Pressable>
              </Link>
              <Link href={`/test/${alphabet.id}`} asChild>
                <Pressable style={StyleSheet.flatten([styles.button, styles.testButton])}>
                  <Text style={styles.buttonText}>Test</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  menu: {
    gap: 30,
  },
  alphabetGroup: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
  },
  alphabetName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  studyButton: {
    backgroundColor: '#34C759',
  },
  testButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});