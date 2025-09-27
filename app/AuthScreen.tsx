import { useState } from "react";
import { Text, View } from "react-native";
import { generatePurchaseHistory } from "../scripts/nessieHelpers";
import CreateUser from "./CreateUser";

type User = {
	username: string; password: string;
}

type authScreenProps = {
    onUserCreated: (user: User) => void;
}

export default function AuthScreen({
    onUserCreated,
}: authScreenProps) {
    const [isLoading, setIsLoading] = useState(false);
    const loadingMessage = "Creating your account...";

    const handleSignUp = async (user: User) => {
        try {
            setIsLoading(true);

            await generatePurchaseHistory();
            
            onUserCreated(user);
        } catch (error) {
            console.error("Error during sign up:", error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return(
            <View style={{ flex: 1, justifyContent: 'center', }}>
                <Text>{loadingMessage}</Text>
            </View>
        );
    }

    return <CreateUser signUp={handleSignUp} />;
}