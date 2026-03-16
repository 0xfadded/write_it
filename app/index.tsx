import { Link } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learn to Write</Text>

      <View style={styles.menu}>
        <Link href="/language/japanese" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Japanese</Text>
          </Pressable>
        </Link>

        <Link href="/language/chinese" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Chinese</Text>
          </Pressable>
        </Link>

        <Link href="/language/korean" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Korean</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  menu: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});