import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Wheel from '../../src/components/Wheel';

export default function WheelScreen() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [winner, setWinner] = useState(null);

  const { width } = useWindowDimensions();
  const isWeb = width >= 768;
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

  // Save to storage
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

  const handlePaste = (text) => {
    // Split by newlines or commas (for Excel-style paste)
    const list = text.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
    setStudents((prev) => [...prev, ...list]);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          isWeb && styles.webLayout,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* LEFT SIDE (Wheel) */}
        <View style={[styles.leftPanel, isWeb && styles.webLeft]}>
          <Text style={styles.title}>🎡 Wheel of Fortune</Text>
          <Wheel students={students} onWinner={setWinner} />
          {winner && <Text style={styles.winner}>🎉 Winner: {winner}!</Text>}
        </View>

        {/* RIGHT SIDE (Input + List) */}
        <View style={[styles.rightPanel, isWeb && styles.webRight]}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter or paste student names"
              value={name}
              onChangeText={(text) => {
                if (text.includes('\n') || text.includes(',')) {
                  const names = text
                    .split(/[\n,]+/)
                    .map((n) => n.trim())
                    .filter((n) => n !== '');
                  if (names.length > 0) {
                    setStudents((prev) => [...prev, ...names]);
                  }
                  setName('');
                } else {
                  setName(text);
                }
              }}
              multiline
            />
            <TouchableOpacity onPress={addStudent} style={styles.addBtn}>
              <Text style={styles.addText}>➕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={students}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.empty}>No students yet. Add one!</Text>
            }
            renderItem={({ item, index }) => (
              <View style={styles.studentRow}>
                <Text style={styles.studentName}>
                  {index + 1}. {item}
                </Text>
                <TouchableOpacity
                  onPress={() => deleteStudent(index)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />

          {students.length > 0 && (
            <View style={styles.buttonRow}>
              <Button title="🧹 Delete All" color="#d62828" onPress={deleteAll} />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  webLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 30,
  },
  leftPanel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  webLeft: {
    flex: 1,
  },
  rightPanel: {
    marginTop: 30,
  },
  webRight: {
    flex: 1,
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  winner: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#0077b6',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  addBtn: {
    marginLeft: 10,
    backgroundColor: '#0077b6',
    padding: 10,
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontSize: 20,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 8,
  },
  studentName: {
    fontSize: 16,
  },
  deleteBtn: {
    paddingHorizontal: 10,
  },
  deleteText: {
    fontSize: 18,
    color: '#d62828',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
  buttonRow: {
    marginTop: 20,
  },
});
