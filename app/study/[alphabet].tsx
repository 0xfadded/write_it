import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hiragana, katakana } from '../../constants/japanese';
import { hangul } from '../../constants/korean';
import { hanzi } from '../../constants/chinese';

const DATA_MAP = {
  hiragana,
  katakana,
  hangul,
  hanzi
};

export default function StudyScreen() {
  const { alphabet } = useLocalSearchParams<{ alphabet: keyof typeof DATA_MAP }>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const dataList = alphabet && DATA_MAP[alphabet] ? DATA_MAP[alphabet] : [];
  const currentItem = dataList[currentIndex];

  if (!currentItem) {
    return (
      <View style={styles.container}>
        <Text>No data found for this alphabet.</Text>
      </View>
    );
  }

  const nextChar = () => {
    if (currentIndex < dataList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevChar = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.alphabetTitle}>
        {alphabet?.toUpperCase()} - {currentIndex + 1} / {dataList.length}
      </Text>

      <View style={styles.card}>
        <Text style={styles.charText}>{currentItem.char}</Text>
        <Text style={styles.romajiText}>{currentItem.romaji}</Text>

        <View style={styles.svgContainer}>
           <Svg height="100" width="100" viewBox="0 0 100 100">
             {currentItem.strokes.map((stroke, index) => (
                <Path
                  key={index}
                  d={stroke}
                  stroke="#333"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
             ))}
           </Svg>
        </View>
      </View>

      <View style={styles.navigation}>
        <Pressable
          style={StyleSheet.flatten([styles.navButton, currentIndex === 0 && styles.navButtonDisabled])}
          onPress={prevChar}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navText}>Previous</Text>
        </Pressable>

        <Pressable
          style={StyleSheet.flatten([styles.navButton, currentIndex === dataList.length - 1 && styles.navButtonDisabled])}
          onPress={nextChar}
          disabled={currentIndex === dataList.length - 1}
        >
          <Text style={styles.navText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  alphabetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#666',
  },
  card: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  charText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  romajiText: {
    fontSize: 24,
    color: '#888',
    marginBottom: 20,
  },
  svgContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
    gap: 20,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#ccc',
  },
  navText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});