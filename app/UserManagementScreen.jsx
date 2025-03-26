import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  List,
  Checkbox,
  Divider,
  ActivityIndicator,
  Card,
  Paragraph
} from 'react-native-paper';
import { AuthContext } from './context/AuthContext';
import api from './services/api';

const UserManagementScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { registerUser } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      const res = await api.get('/api/users/getAll');
      setUsers(res.data);
    } catch (error) {
      // console.error('Error fetching users', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setFetchingUsers(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser({ email, password, isAdmin });
      if (result.success) {
        Alert.alert('Success', 'User registered successfully!');
        setEmail('');
        setPassword('');
        setIsAdmin(false);
        fetchUsers();
      } else {
        Alert.alert('Error', result.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      // console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Register New User</Title>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={isAdmin ? 'checked' : 'unchecked'}
              onPress={() => setIsAdmin(!isAdmin)}
            />
            <Paragraph style={styles.checkboxLabel}>Admin User</Paragraph>
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.registerButton}
            loading={loading}
            disabled={loading}
          >
            Register User
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>User List</Title>

          {fetchingUsers && !refreshing ? (
            <ActivityIndicator style={styles.loader} />
          ) : users.length === 0 ? (
            <Paragraph style={styles.noUsers}>No users found</Paragraph>
          ) : (
            <View style={styles.userList}>
              {users.map((user, index) => (
                <React.Fragment key={user._id}>
                  <List.Item
                    title={user.email}
                    description={user.isAdmin ? 'Admin' : 'Regular User'}
                    left={props => <List.Icon {...props} icon="account" />}
                    right={props =>
                      user.isAdmin ? (
                        <List.Icon {...props} icon="shield-account" color="#6200ee" />
                      ) : null
                    }
                  />
                  {index < users.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  registerButton: {
    marginTop: 8,
  },
  userList: {
    marginTop: 8,
  },
  noUsers: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default UserManagementScreen;
