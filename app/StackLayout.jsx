import { Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function StackLayout() {
	const { isAdmin } = useContext(AuthContext);
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen
				name="HomeScreen"
				options={{ title: "Home" }}
			/>
			<Stack.Screen
				name="TaskDetailScreen"
				options={{ title: "Task Details" }}
			/>
			{isAdmin && <Stack.Screen
				name="UserManagementScreen"
				options={{ title: "User Management" }}
			/>}
		</Stack>
	);
}
