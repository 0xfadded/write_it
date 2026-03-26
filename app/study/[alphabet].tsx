import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import Svg, { Path, Text as SvgText, Circle } from 'react-native-svg';
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
  const [animatedStrokeIndex, setAnimatedStrokeIndex] = useState(-1);

  const dataList = alphabet && DATA_MAP[alphabet] ? DATA_MAP[alphabet] : [];
  const currentItem = dataList[currentIndex];

  // Helper to get starting point of SVG path for placing the number
  const getStartingPoint = (d: string) => {
    const match = d.match(/M\s*([\d.]+)[,\s]+([\d.]+)/i);
    if (match) {
      return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
    }
    return null;
  };

  useEffect(() => {
    if (!currentItem) return;
    setAnimatedStrokeIndex(-1); // Reset animation state on character change
  }, [currentIndex, currentItem]);

  const triggerAnimation = () => {
    if (!currentItem) return;
    setAnimatedStrokeIndex(0);
  };

  useEffect(() => {
    if (!currentItem) return;
    if (animatedStrokeIndex >= 0 && animatedStrokeIndex < currentItem.strokes.length) {
      const timer = setTimeout(() => {
        setAnimatedStrokeIndex(prev => prev + 1);
      }, 800); // 800ms per stroke
      return () => clearTimeout(timer);
    }
  }, [animatedStrokeIndex, currentItem]);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.alphabetTitle}>
        {alphabet?.toUpperCase()} - {currentIndex + 1} / {dataList.length}
      </Text>

      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.charText}>{currentItem.char}</Text>
          <View style={styles.metaData}>
            <Text style={styles.romajiText}>{currentItem.romaji}</Text>
            <Text style={styles.strokesText}>{currentItem.strokes.length} strokes</Text>
          </View>
        </View>

        <Pressable style={styles.svgContainer} onPress={triggerAnimation}>
           <Svg height="250" width="250" viewBox="0 0 109 109">
             {currentItem.strokes.map((stroke, index) => {
                const startPoint = getStartingPoint(stroke);
                const isAnimating = animatedStrokeIndex >= 0;
                const isVisible = !isAnimating || index <= animatedStrokeIndex;
                const isCurrentAnimation = isAnimating && index === animatedStrokeIndex;

                return isVisible ? (
                  <React.Fragment key={`study-stroke-${index}`}>
                    <Path
                      d={stroke}
                      stroke={isCurrentAnimation ? "#007AFF" : "#333"}
                      strokeWidth="5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {startPoint && (
                      <SvgText
                        x={startPoint.x - 6}
                        y={startPoint.y + 2}
                        fill={isCurrentAnimation ? "#007AFF" : "#FF3B30"}
                        fontSize="8"
                        fontWeight="bold"
                      >
                        {index + 1}
                      </SvgText>
                    )}
                  </React.Fragment>
                ) : null;
             })}
           </Svg>
           <Text style={styles.instructionText}>Tap to animate</Text>
        </Pressable>
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
    </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metaData: {
    alignItems: 'flex-end',
  },
  charText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#333',
  },
  romajiText: {
    fontSize: 32,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  strokesText: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  svgContainer: {
    width: 250,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 10,
    paddingTop: 10,
  },
  instructionText: {
    marginTop: 10,
    color: '#bbb',
    fontSize: 14,
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