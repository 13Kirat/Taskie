import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Button, useWindowDimensions } from 'react-native';
import { FAB, ActivityIndicator, Text } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { AuthContext } from './context/AuthContext';
import { TaskContext } from './context/TaskContext';
import TaskItem from './(components)/TaskItem';
import { useRouter } from 'expo-router';

const HomeScreen = () => {
  const layout = useWindowDimensions();
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { tasks, loading, fetchTasks, fetchAllTasks, allTasks } = useContext(TaskContext);
  const navigation = useRouter();

  const [index, setIndex] = useState(0); // Current tab index
  const [routes] = useState(
    isAdmin
      ? [
        { key: 'yourTasks', title: 'Your Tasks' },
        { key: 'allTasks', title: 'All Tasks' },
      ]
      : [{ key: 'yourTasks', title: 'Your Tasks' }]
  );

  // Fetch tasks based on the selected tab
  useEffect(() => {
    if (index === 0) {
      fetchTasks(); // Fetch user's tasks
    } else if (isAdmin && index === 1) {
      fetchAllTasks(); // Fetch all tasks (admin only)
    }
  }, [index]);

  useEffect(() => { }, [tasks, allTasks])

  // Render task items in a FlatList
  const renderTaskList = (tasks) => (
    <FlatList
      data={tasks}
      renderItem={({ item }) => <TaskItem task={item} />}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.listContainer}
    />
  );

  // Define scenes for the tabs
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'yourTasks':
        return loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          renderTaskList(tasks)
        );
      case 'allTasks':
        return loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          renderTaskList(allTasks)
        );
      default:
        return null;
    }
  };


  const signout = () => {
    const out = logout();
    if (out) {
      navigation.replace('/');
    }
  }

  return (
    <View style={styles.container}>
      {isAdmin ? (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.indicator} />
          )}
        />
      ) : (
        loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks assigned yet</Text>
          </View>
        ) : (
          renderTaskList(tasks)
        )
      )}

      <View style={styles.fabContainer}>
        {isAdmin && (
          <FAB
            style={styles.fab}
            icon="plus"
            onPress={() => navigation.navigate('/AddTask')}
          />
        )}
        {isAdmin && (
          <FAB
            style={styles.users}
            icon="account-group"
            onPress={() => navigation.navigate('/UserManagementScreen')}
          />
        )}
        <FAB
          style={styles.logout}
          icon="logout"
          onPress={signout}
        />
      </View>
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
  tabBar: {
    backgroundColor: '#6200ee',
  },
  indicator: {
    backgroundColor: '#ffffff',
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
  fabContainer: {
    display: 'flex',
    justifyContent: "space-between",
    alignContent: 'center',
    flexDirection: "row",
    marginHorizontal: "5%",
    marginBottom: "5%"
  },
  fab: {
    width: 55
  },
  users: {
    width: 55
  },
  logout: {
    width: 55
  }

});

export default HomeScreen;
