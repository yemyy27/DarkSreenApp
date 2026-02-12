import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake, deactivateKeepAwake, activateKeepAwake } from 'expo-keep-awake';

const SCREEN_COLORS = [
  { name: 'Black', color: '#000000' },
  { name: 'Dark Grey', color: '#1a1a1a' },
  { name: 'Dark Blue', color: '#0a0a2e' },
  { name: 'Dark Red', color: '#2e0a0a' },
  { name: 'Dark Green', color: '#0a2e0a' },
  { name: 'Warm', color: '#1a0f00' },
];

export default function App() {
  const [screenColor, setScreenColor] = useState(SCREEN_COLORS[0].color);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [keepAwake, setKeepAwake] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lastTap = useRef(0);

  // Keep screen awake by default
  useKeepAwake();

  const toggleControls = useCallback(() => {
    const now = Date.now();
    // Debounce rapid taps
    if (now - lastTap.current < 300) return;
    lastTap.current = now;

    if (controlsVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setControlsVisible(false));
    } else {
      setControlsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [controlsVisible, fadeAnim]);

  const handleKeepAwakeToggle = useCallback(() => {
    if (keepAwake) {
      deactivateKeepAwake();
    } else {
      activateKeepAwake();
    }
    setKeepAwake((prev) => !prev);
  }, [keepAwake]);

  return (
    <View style={[styles.container, { backgroundColor: screenColor }]}>
      <StatusBar hidden />

      <TouchableWithoutFeedback onPress={toggleControls}>
        <View style={styles.touchArea}>
          {controlsVisible && (
            <Animated.View style={[styles.controls, { opacity: fadeAnim }]}>
              <Text style={styles.title}>Dark Screen</Text>
              <Text style={styles.subtitle}>Tap anywhere to hide controls</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Screen Color</Text>
                <View style={styles.colorGrid}>
                  {SCREEN_COLORS.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.colorButton,
                        { backgroundColor: item.color },
                        screenColor === item.color && styles.colorButtonActive,
                      ]}
                      onPress={() => setScreenColor(item.color)}
                    >
                      <Text style={styles.colorLabel}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <TouchableOpacity
                  style={styles.toggleRow}
                  onPress={handleKeepAwakeToggle}
                >
                  <Text style={styles.toggleLabel}>Keep Screen Awake</Text>
                  <View
                    style={[
                      styles.toggle,
                      keepAwake ? styles.toggleOn : styles.toggleOff,
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleKnob,
                        keepAwake ? styles.knobOn : styles.knobOff,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {!controlsVisible && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>Tap to show controls</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    width: width * 0.85,
    maxWidth: 400,
    padding: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#aaaaaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  colorButton: {
    width: (width * 0.85 - 48 - 20) / 3,
    maxWidth: 115,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#ffffff',
  },
  colorLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#cccccc',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#ffffff',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  toggleOn: {
    backgroundColor: '#4cd964',
  },
  toggleOff: {
    backgroundColor: '#555555',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
  knobOff: {
    alignSelf: 'flex-start',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 60,
  },
  hintText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.15)',
  },
});
