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
  const [clearTrigger, setClearTrigger] = useState(0);

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

  const handleClear = () => {
    setStrokesCount(0);
    setClearTrigger(prev => prev + 1);
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
        <View style={styles.header}>
          <Text style={styles.romajiText}>{currentItem.romaji}</Text>
          <Text style={styles.alphabetTitle}>
            {alphabet?.toLowerCase()}
          </Text>
        </View>

        <DrawingCanvas
          key={currentIndex}
          onStrokeEnd={handleStrokeEnd}
          targetStrokes={currentItem.strokes}
          currentStrokeIndex={strokesCount}
          clearTrigger={clearTrigger}
        />

        <Text style={styles.helperText}>trace the character</Text>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleClear}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={checkAnswer}>
            <Text style={styles.actionIcon}>👁️</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={nextQuestion}>
            <Text style={styles.actionIcon}>➡️</Text>
          </Pressable>
        </View>

        {showAnswer && (
          <View style={styles.answerBox}>
            <Text style={styles.answerText}>Correct Answer: {currentItem.char}</Text>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  alphabetTitle: {
    fontSize: 16,
    color: '#aaa',
  },
  romajiText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  helperText: {
    marginTop: 30,
    fontSize: 16,
    color: '#aaa',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 30,
  },
  actionButton: {
    padding: 15,
  },
  actionIcon: {
    fontSize: 24,
  },
  answerBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  answerText: {
    fontSize: 20,
    color: '#34C759',
    fontWeight: 'bold',
  },
});