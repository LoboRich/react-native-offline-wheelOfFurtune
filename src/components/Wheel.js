import React, { useRef, useState } from 'react';
import { Animated, Button, Easing, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

export default function Wheel({ students = [], onWinner }) {
  const [winner, setWinner] = useState(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const { width } = useWindowDimensions();

  // ✅ Dynamic wheel size based on platform and screen size
  const wheelSize = Platform.OS === 'web'
    ? Math.min(width * 0.5, 500) // Up to 500px on large web screens
    : Math.min(width * 0.8, 320); // Fit smaller on mobile

  const numSegments = students.length || 6;
  const segmentAngle = 360 / numSegments;
  const colors = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#ffb703'];

  const segments = Array.from({ length: numSegments }).map((_, i) => {
    const startAngle = (i * segmentAngle * Math.PI) / 180;
    const endAngle = ((i + 1) * segmentAngle * Math.PI) / 180;
    const x1 = wheelSize / 2 + (wheelSize / 2) * Math.cos(startAngle);
    const y1 = wheelSize / 2 + (wheelSize / 2) * Math.sin(startAngle);
    const x2 = wheelSize / 2 + (wheelSize / 2) * Math.cos(endAngle);
    const y2 = wheelSize / 2 + (wheelSize / 2) * Math.sin(endAngle);
    const pathData = `
      M ${wheelSize / 2} ${wheelSize / 2}
      L ${x1} ${y1}
      A ${wheelSize / 2} ${wheelSize / 2} 0 0 1 ${x2} ${y2}
      Z
    `;
    return { pathData, color: colors[i % colors.length], label: students[i] || `Student ${i + 1}` };
  });

  const spinWheel = () => {
    if (spinning || students.length === 0) return;

    const randomIndex = Math.floor(Math.random() * numSegments);
    const selected = students[randomIndex];
    setSpinning(true);

    rotation.setValue(0);
    const baseRotation = 360 * 5;
    const offsetToCenter = segmentAngle / 2;
    const finalRotation = baseRotation + (360 - randomIndex * segmentAngle - offsetToCenter + 270);

    Animated.timing(rotation, {
      toValue: finalRotation,
      duration: 5000,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(() => {
      setSpinning(false);
      setWinner(selected);
      if (onWinner) onWinner(selected);
    });
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
            <G>
              {segments.map((seg, i) => (
                <Path key={i} d={seg.pathData} fill={seg.color} stroke="#fff" strokeWidth={2} />
              ))}
              {segments.map((seg, i) => {
                const angle = i * segmentAngle + segmentAngle / 2;
                const rad = (angle * Math.PI) / 180;
                const x = wheelSize / 2 + (wheelSize / 3) * Math.cos(rad);
                const y = wheelSize / 2 + (wheelSize / 3) * Math.sin(rad);
                return (
                  <SvgText
                    key={i}
                    x={x}
                    y={y}
                    fill="#000"
                    fontSize={Math.max(12, wheelSize * 0.04)}
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${angle}, ${x}, ${y})`}
                  >
                    {seg.label}
                  </SvgText>
                );
              })}
            </G>
          </Svg>
        </Animated.View>

        {/* Pointer */}
        <View style={[styles.pointer, { top: -wheelSize * 0.03, borderBottomWidth: wheelSize * 0.07 }]} />
      </View>

      <Button title={spinning ? 'Spinning...' : '🎯 Spin'} onPress={spinWheel} disabled={spinning} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  pointer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
    zIndex: 1,
  },
});
