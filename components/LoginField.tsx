import { Text, TextInput, View } from "react-native";

interface Props {
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	error?: string;
	secureTextEntry?: boolean;
}

export default function LoginField({
	placeholder,
	value,
	onChangeText,
	error,
	secureTextEntry,
}: Props) {
	return(
		<View>
			<TextInput
				placeholder = {placeholder}
				value = {value}
				onChangeText = {onChangeText}
				autoComplete = "off"
				secureTextEntry = {secureTextEntry ? secureTextEntry : false}
                textContentType = "oneTimeCode"
			/>
			<Text>{error ? "*" + error: ""}</Text>
		</View>
	);
}