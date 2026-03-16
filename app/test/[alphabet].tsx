import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import DrawingCanvas from '../../components/DrawingCanvas';
import { hiragana, katakana } from '../../constants/japanese';
import { hangul } from '../../constants/korean';
import { hanzi } from '../../constants/chinese';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const DATA_MAP = {
  hiragana,
  katakana,
  hangul,
  hanzi
};

export default function TestScreen() {
  const { alphabet } = useLocalSearchParams<{ alphabet: keyof typeof DATA_MAP }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [strokesCount, setStrokesCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const dataList = alphabet && DATA_MAP[alphabet] ? DATA_MAP[alphabet] : [];
  const currentItem = dataList[currentIndex];

  if (!currentItem) {
    return (
      <View style={styles.container}>
        <Text>No data found for this alphabet.</Text>
      </View>
    );
  }

  const handleStrokeEnd = (points: { x: number; y: number }[]) => {
    setStrokesCount(prev => prev + 1);
  };

  const checkAnswer = () => {
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setStrokesCount(0);
    if (currentIndex < dataList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.alphabetTitle}>
          Practice: {alphabet?.toUpperCase()}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.promptText}>Draw the character for:</Text>
          <Text style={styles.romajiText}>{currentItem.romaji}</Text>
        </View>

        <DrawingCanvas key={currentIndex} onStrokeEnd={handleStrokeEnd} />

        <Text style={styles.strokeCount}>
          Strokes drawn: {strokesCount} / {currentItem.strokes.length}
        </Text>

        {showAnswer && (
          <View style={styles.answerBox}>
            <Text style={styles.answerLabel}>Correct Answer:</Text>
            <Text style={styles.answerText}>{currentItem.char}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {!showAnswer ? (
            <Pressable style={styles.button} onPress={checkAnswer}>
              <Text style={styles.buttonText}>Check Answer</Text>
            </Pressable>
          ) : (
            <Pressable style={StyleSheet.flatten([styles.button, styles.nextButton])} onPress={nextQuestion}>
              <Text style={styles.buttonText}>Next Question</Text>
            </Pressable>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
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
  questionCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  promptText: {
    fontSize: 18,
    color: '#333',
  },
  romajiText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  strokeCount: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  answerBox: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#E6F4FE',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  answerLabel: {
    fontSize: 14,
    color: '#666',
  },
  answerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#34C759',
  },
  actions: {
    marginTop: 30,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});