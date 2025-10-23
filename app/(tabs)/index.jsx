import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Wheel from '../../src/components/Wheel';

export default function WheelScreen() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [winner, setWinner] = useState(null);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedStudents = await AsyncStorage.getItem('students');
        const storedWinner = await AsyncStorage.getItem('winner');
        if (storedStudents) setStudents(JSON.parse(storedStudents));
        if (storedWinner) setWinner(storedWinner);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // Save students and winner whenever they change
  useEffect(() => {
    AsyncStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (winner) AsyncStorage.setItem('winner', winner);
  }, [winner]);

  const addStudent = () => {
    if (name.trim() === '') return;
    setStudents((prev) => [...prev, name.trim()]);
    setName('');
  };

  const deleteStudent = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  const deleteAll = async () => {
    setStudents([]);
    setWinner(null);
    await AsyncStorage.multiRemove(['students', 'winner']);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎡 Wheel of Fortune</Text>

      <Wheel students={students} onWinner={setWinner} />

      {winner && <Text style={styles.winner}>🎉 Winner: {winner}!</Text>}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter student name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Add" onPress={addStudent} />
      </View>

      <FlatList
        data={students}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No students yet. Add one!</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.studentRow}>
            <Text style={styles.studentName}>{index + 1}. {item}</Text>
            <TouchableOpacity onPress={() => deleteStudent(index)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {students.length > 0 && (
        <View style={styles.buttonRow}>
          <Button title="🧹 Delete All" color="#d62828" onPress={deleteAll} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20 },
  inputRow: { flexDirection: 'row', marginVertical: 10, width: '100%' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    width: '100%',
  },
  studentName: { fontSize: 16 },
  deleteBtn: { paddingHorizontal: 10 },
  deleteText: { fontSize: 18 },
  empty: { color: '#aaa', marginTop: 10 },
  winner: { fontSize: 18, fontWeight: 'bold', color: '#007bff', marginVertical: 10 },
  buttonRow: { marginTop: 10 },
});
