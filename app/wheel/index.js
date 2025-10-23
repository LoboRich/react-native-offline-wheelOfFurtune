import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Wheel from '../../src/components/Wheel';
import { loadStudents, saveStudents } from '../../src/storage/storage';

export default function WheelScreen() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    (async () => {
      const saved = await loadStudents();
      setStudents(saved);
    })();
  }, []);

  const addStudent = async () => {
    if (!name.trim()) return;
    const updated = [...students, { name }];
    setStudents(updated);
    setName('');
    await saveStudents(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎡 Wheel of Fortune</Text>

      <Wheel students={students.map(s => s.name)} onWinner={setWinner} />

      <View style={styles.form}>
        <TextInput
          placeholder="Enter student name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Button title="Add" onPress={addStudent} />
      </View>

      <FlatList
        data={students}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => <Text style={styles.item}>🎓 {item.name}</Text>}
      />

      {winner && <Text style={styles.winner}>🏆 Winner: {winner}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  form: { flexDirection: 'row', marginVertical: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    width: 180,
    marginRight: 8,
  },
  item: { fontSize: 16, color: '#333' },
  winner: { marginTop: 15, fontSize: 18, fontWeight: 'bold', color: '#e63946' },
});
