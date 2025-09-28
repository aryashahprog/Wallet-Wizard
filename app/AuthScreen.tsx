import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import CreateUser from "../components/CreateUser";
import { generatePurchaseHistory } from "../scripts/nessieHelpers";

type User = {
	username: string; password: string; accountId?: string;
}

type authScreenProps = {
    onUserCreated: (user: User) => void;
}

export default function AuthScreen({
    onUserCreated,
}: authScreenProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);
    
    const loadingMessages = [
        "Creating your account...",
        "Setting up your magical wallet...",
        "Generating purchase history...",
        "Preparing your financial spells...",
        "Almost ready to cast some savings...",
    ];

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => 
                (prevIndex + 1) % loadingMessages.length
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [isLoading, loadingMessages.length]);

    const handleSignUp = async (user: User) => {
        try {
            setIsLoading(true);
            setMessageIndex(0);
            const accountId = await generatePurchaseHistory();
            const newUser : User = { ...user, accountId };
            
            if (onUserCreated && typeof onUserCreated === 'function') {
                onUserCreated(newUser);
            } else {
                console.error("onUserCreated prop is not provided or is not a function");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error during sign up:", error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator 
                    size="large" 
                    color="#8b5cf6" 
                    style={styles.spinner}
                />
                <Text style={styles.loadingText}>{loadingMessages[messageIndex]}</Text>
            </View>
        );
    }

    return <CreateUser signUp={handleSignUp} />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f0ff',
        paddingHorizontal: 20,
    },
    spinner: {
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#6b46c1',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});