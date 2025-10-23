import React, { useRef, useState } from 'react';
import { Animated, Button, Easing, StyleSheet, View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

export default function Wheel({ students = [], onWinner }) {
  const rotation = useRef(new Animated.Value(0)).current;
  const [spinning, setSpinning] = useState(false);
  const wheelSize = 300;

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
    if (spinning) return;
    setSpinning(true);

    const randomSpin = 3600 + Math.random() * 360;
    Animated.timing(rotation, {
      toValue: randomSpin,
      duration: 4000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      const normalized = randomSpin % 360;
      const winnerIndex = Math.floor(((360 - normalized) / segmentAngle) % numSegments);
      const winner = segments[winnerIndex].label;
      setSpinning(false);
      onWinner?.(winner);
    });
  };

  const rotate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View>
        <Animated.View style={{ transform: [{ rotate }] }}>
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
                    fontSize="12"
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
        <View style={styles.pointer} />
      </View>

      <Button title={spinning ? 'Spinning...' : '🎯 Spin'} onPress={spinWheel} disabled={spinning} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  pointer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red',
  },
});
