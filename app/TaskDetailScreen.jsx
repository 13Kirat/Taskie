import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Chip,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { api } from './services/api'; // Fix import (remove destructuring)
import { useLocalSearchParams, useRouter } from 'expo-router';
import authStorage from './services/authStorage';

const TaskDetailScreen = () => {
  // const { tasks,setTasks } = useContext(TaskContext);
  const navigation = useRouter();
  const { taskId } = useLocalSearchParams();
  const [task, setTask] = useState(null);
  const [note, setNote] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch task details on component mount
  useEffect(() => {
    async function fetchTask() {
      try {
        setLoading(true);
        const response = await api.get(`/api/tasks/${taskId}`);
        const currentTask = response.data; // Extract task data from response
        if (currentTask) {
          setTask(currentTask);
          setNote(currentTask.note || '');
        }
      } catch (error) {
        // console.error('Error fetching task:', error);
        Alert.alert('Error', 'Failed to fetch task details');
      } finally {
        setLoading(false);
      }
    }
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const handleCompleteTask = async () => {
    if (task.status === 'completed') {
      Alert.alert('Task already completed');
      return;
    }

    setLoading(true);
    try {
      const result = await completeTask(taskId, note, images);
      if (result.success) {
        Alert.alert('Success', 'Task completed successfully!');
        navigation.back();
      } else {
        Alert.alert('Error', result.message || 'Failed to complete task');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId, note, images) => {
    try {
      const token = await authStorage.getToken();
      const formData = new FormData();
      if (note) formData.append('note', note);

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', {
            uri: image.uri,
            type: 'image/jpeg',
            name: `image_${index}.jpg`,
          });
        });
      }

      const res = await api.put(`/api/tasks/${taskId}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });

      // setTasks(
      //   tasks.map((task) =>
      //     task._id === taskId ? res.data : task
      //   )
      // );

      return { success: true, data: res.data };
    } catch (error) {
      // console.error('Error completing task', error);
      return {
        success: false,
        message: error.response?.data?.msg || 'Failed to complete task',
      };
    }
  };


  if (!task && loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!task && !loading) {
    return (
      <View style={styles.emptyContainer}>
        <Paragraph style={styles.emptyText}>Task not found</Paragraph>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{task.title}</Title>

          <View style={styles.infoRow}>
            <Paragraph style={styles.label}>Status:</Paragraph>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                task.status === 'completed' ? styles.completedChip : styles.pendingChip
              ]}
            >
              <Text style={{ color: '#000' }}>
                {task.status}
              </Text>
            </Chip>
          </View>

          <View style={styles.infoRow}>
            <Paragraph style={styles.label}>Assigned Date:</Paragraph>
            <Paragraph style={{ color: '#000' }}>{formatDate(task.assignDate)}</Paragraph>
          </View>

          {task.status === 'completed' && (
            <>
              <Paragraph style={{ color: '#000', fontSize: 20 }}>Completion Notes:</Paragraph>
              <Paragraph style={{ color: '#000' }}>{task.note || 'No notes provided'}</Paragraph>
            </>
          )}
        </Card.Content>
      </Card>

      {task.images && task.images.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph style={{ color: '#000' }}>Task Images:</Paragraph>
            <ScrollView horizontal style={styles.imageScrollView}>
              {task.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.taskImage}
                // onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
                />
              ))}
            </ScrollView>
          </Card.Content>
        </Card>
      )}

      {task.status === 'pending' && (
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph style={{ color: '#000' }}>Complete Task:</Paragraph>

            <TextInput
              label="Add completion note (optional)"
              value={note}
              onChangeText={setNote}
              mode="outlined"
              multiline
              numberOfLines={4}
              contentStyle={{ color: "#000" }}
              style={{ backgroundColor: '#fff', borderBlockColor: '#000' }}
            />
            <View style={styles.spacer}></View>

            <Button
              mode="contained"
              onPress={pickImages}
              style={styles.button}
              icon="camera"
            >
              Add Images
            </Button>

            {images.length > 0 && (
              <>
                <Paragraph style={styles.imagesTitle}>Selected Images:</Paragraph>
                <ScrollView horizontal style={styles.imageScrollView}>
                  {images.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);
                      }}
                    >
                      <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <View style={styles.spacer}></View>

            <Button
              mode="contained"
              onPress={handleCompleteTask}
              style={[styles.button, styles.completeButton]}
              loading={loading}
              disabled={loading}
            >
              Complete Task
            </Button>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    color: "#000"
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
    color: "#000"
  },
  statusChip: {
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingChip: {
    backgroundColor: '#FFF9C4',
    borderColor: '#FBC02D',
  },
  completedChip: {
    backgroundColor: '#C8E6C9',
    borderColor: '#4CAF50',
  },
  spacer: {
    height: 16,
  }
});

export default TaskDetailScreen;
