import { StyleSheet, Text, TextInput, View } from "react-native";

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
		<View style={styles.container}>
			<TextInput
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				autoComplete="off"
				secureTextEntry={secureTextEntry ? secureTextEntry : false}
				textContentType="oneTimeCode"
				style={[styles.textInput, error ? styles.textInputError : null]}
				placeholderTextColor="#999999"
                autoCorrect={false}
			/>
			{error && <Text style={styles.errorText}>*{error}</Text>}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginBottom: 16,
	},
	textInput: {
		fontSize: 16,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: '#e0e0e0',
		borderRadius: 8,
		backgroundColor: '#ffffff',
		color: '#333333',
	},
	textInputError: {
		borderColor: '#dc3545',
		backgroundColor: '#fff5f5',
	},
	errorText: {
		fontSize: 14,
		color: '#dc3545',
		marginTop: 6,
		marginLeft: 4,
		fontWeight: '500',
	},
});