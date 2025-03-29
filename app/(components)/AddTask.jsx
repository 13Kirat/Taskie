import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Card
} from 'react-native-paper';
import { TaskContext } from '../context/TaskContext';
import ImagePicker from './ImagePicker';
import UserPicker from './UserPicker';
import { useRouter } from 'expo-router';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useRouter();
  const { createTask } = useContext(TaskContext);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!selectedUser) {
      Alert.alert('Error', 'Please select a user to assign the task');
      return;
    }

    setLoading(true);
    try {
      const result = await createTask(
        { title, assignedTo: selectedUser._id },
      );
      
      if (result.success) {
        Alert.alert('Success', 'Task created successfully!');
        setTitle('');
        setSelectedUser(null);
        navigation.back();
      } else {
        Alert.alert('Error', result.message || 'Failed to create task');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Assign New Task</Title>

            <TextInput
              label="Task Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
              placeholder="Enter task title"
            />

            <Paragraph style={styles.sectionTitle}>Select User:</Paragraph>
            <UserPicker
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
              style={styles.userPicker}
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
            >
              Create Task
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userPicker: {
    marginBottom: 16,
  },
  imagePicker: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
    backgroundColor: '#6200ee',
  },
});

export default AddTask;
