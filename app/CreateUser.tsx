import { useState } from "react";
import { Button, View } from "react-native";
import LoginField from "../components/LoginField";
import {
    validatePassword,
    validateUsername,
} from "../scripts/validation";

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
		<View style = {{ flex: 1, justifyContent: 'center', }}>
			<LoginField
				placeholder = "username"
				value = {formData.username}
				onChangeText = {(text) => handleChange("username", text)}
                error = {errors.username}
			/>
			<LoginField
				placeholder = "password"
				value = {formData.password}
				onChangeText = {(text) => handleChange("password", text)}
                error = {errors.password}
				secureTextEntry = {true}
			/>
			<LoginField
				placeholder="confirmPassword"
				value = {formData.confirmPassword}
				onChangeText = {(text) => handleChange("confirmPassword", text)}
                error = {errors.confirmPassword}
				secureTextEntry = {true}
			/>
			<Button
				title = "Submit"
                onPress = {handleSubmit}
			/>
		</View>
	);
}