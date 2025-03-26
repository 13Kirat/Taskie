import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList, Button } from 'react-native';
import { FAB, ActivityIndicator, Text } from 'react-native-paper';
import { AuthContext } from './context/AuthContext';
import { TaskContext } from './context/TaskContext';
import TaskItem from './(components)/TaskItem';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { tasks, loading, fetchTasks } = useContext(TaskContext);
  const navigation = useRouter();
  // useEffect(() => {
  //   router.setOptions({
  //     headerRight: () => (
  //       <Text
  //         style={styles.logoutText}
  //         onPress={logout}
  //       >
  //         Logout
  //       </Text>
  //     ),
  //   });
  // }, [navigation]);

  const renderItem = ({ item }) => (
    <TaskItem
      task={item}
    />
  );

const signout = () =>{
  const out = logout();
  if(out){
    navigation.push('/LoginScreen');
  }
}

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks assigned yet</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchTasks}
        />
      )}

      {isAdmin && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('/AddTask')}
        />
      )}

      <FAB
        style={styles.logout}
        icon="logout"
        onPress={signout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  loader: {
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
    fontSize: 18,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#aaa',
  },
  logout: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: '#aaa',
  },
  addButton: {
    // position: 'absolute',
    marginHorizontal: 50,
    marginVertical: 25,
    left: 0,
    top: 0,
    backgroundColor: '#6200ee',
  }
});

export default HomeScreen;
