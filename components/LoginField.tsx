import { Text, TextInput, View } from "react-native";

interface Props {
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	error?: string;
}

export default function LoginField({
	placeholder,
	value,
	onChangeText,
	error,
}: Props) {
	return(
		<View>
			<TextInput
				placeholder = {placeholder}
				value = {value}
				onChangeText = {onChangeText}
				autoComplete="off"
			/>
			<Text>{error ? "*" + error: ""}</Text>
		</View>
	);
}