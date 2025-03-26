import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {
  List,
  Divider,
  ActivityIndicator,
  Text,
  Surface
} from 'react-native-paper';
import { api } from '../services/api';

const UserPicker = ({ selectedUser, onSelectUser, style }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/users/getAll");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      // console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchUsers}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.emptyText}>No users available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Surface style={styles.surface}>
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectUser(item)}>
              <List.Item
                title={item.email}
                description={item.isAdmin ? 'Admin' : 'User'}
                left={props => <List.Icon {...props} icon="account" />}
                right={props =>
                  selectedUser && selectedUser._id === item._id ? (
                    <List.Icon {...props} icon="check" color="#6200ee" />
                  ) : null
                }
                style={[
                  styles.userItem,
                  selectedUser && selectedUser._id === item._id && styles.selectedUser
                ]}
              />
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <Divider />}
          style={styles.list}
        />
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  surface: {
    elevation: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  list: {
    maxHeight: 200,
  },
  userItem: {
    backgroundColor: '#fff',
  },
  selectedUser: {
    backgroundColor: '#E3F2FD',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
  retryText: {
    color: '#6200ee',
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    marginVertical: 16,
  },
});

export default UserPicker;
