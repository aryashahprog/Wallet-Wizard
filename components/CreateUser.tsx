import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
    validatePassword,
    validateUsername,
} from "../scripts/validation";
import LoginField from "./LoginField";

type createUserProps = {
	signUp: (user: { username: string; password: string; }) => void;
}

export default function CreateUser({
	signUp,
}: createUserProps) {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	function validate(): boolean {
		const errors: { [key: string]: string } = {};
	
		const valid =
			validateUsername(formData.username, errors) &&
			validatePassword(formData.password, formData.confirmPassword, errors);
		
		setErrors(errors);
		if (!valid) setFormData({ ...formData, password: "", confirmPassword: "" });
	
		return valid;
	}

	function handleChange(field: string, value: string) {
		const { [field]: _, ...rest } = errors;
		setErrors(rest);
		setFormData({ ...formData, [field]: value });
	}

	function handleSubmit() {
		if (!validate()) return;
		
		const newUser = {
			username: formData.username,
			password: formData.password,
		};
		
		signUp(newUser);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.appName}>Wallet Wizard</Text>
				<Text style={styles.subtitle}>Start your journey</Text>
			</View>

			<View style={styles.form}>
				<LoginField
					placeholder="Username"
					value={formData.username}
					onChangeText={(text) => handleChange("username", text)}
					error={errors.username}
				/>
				<LoginField
					placeholder="Password"
					value={formData.password}
					onChangeText={(text) => handleChange("password", text)}
					error={errors.password}
					secureTextEntry={true}
				/>
				<LoginField
					placeholder="Confirm Password"
					value={formData.confirmPassword}
					onChangeText={(text) => handleChange("confirmPassword", text)}
					error={errors.confirmPassword}
					secureTextEntry={true}
				/>
				
				<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
					<Text style={styles.submitButtonText}>Create Account</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f3f0ff',
		paddingHorizontal: 20,
		justifyContent: 'center',
	},
	header: {
		alignItems: 'center',
		marginBottom: 40,
	},
	appName: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#8b5cf6',
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 18,
		color: '#6b46c1',
		textAlign: 'center',
		fontWeight: '500',
	},
	form: {
		width: '100%',
	},
	submitButton: {
		backgroundColor: '#8b5cf6',
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginTop: 20,
		alignItems: 'center',
		shadowColor: '#8b5cf6',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 3,
	},
	submitButtonText: {
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '600',
		letterSpacing: 0.5,
	},
});