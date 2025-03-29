import { useRouter } from 'expo-router';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';

const TaskItem = ({ task, onPress }) => {
  const navigation = useRouter();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity onPress={() => navigation.navigate(`/TaskDetailScreen?taskId=${task._id}`)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={{ color: "#000" }}>{task.title}</Title>
          <View style={styles.dateContainer}>
            <Paragraph style={{ color: "#000" }}>Assigned: {formatDate(task.assignDate)}</Paragraph>
          </View>
          <View style={styles.statusContainer}>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                task.status === 'completed' ? styles.completedChip : styles.pendingChip
              ]}
            >
              <Text style={{ color: '#000' }}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</Text>
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#fff',
  },
  dateContainer: {
    marginTop: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 12,
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
});

export default TaskItem;
