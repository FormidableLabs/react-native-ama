import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Image } from "react-native";
import { Intro } from "../components/Intro";
import { Spacer } from "../components/Spacer";
import { TestCase } from "../components/TestCase";
import { theme } from "../theme";

export const ImagesScreen = () => {
    return (
        <SafeAreaView style={theme.safeAreaView}>
            <StatusBar style="light" />
            <ScrollView style={styles.list}>
                <Spacer height="big" />
                <Intro element="Images" />
                <Spacer height="big" />

                {/*
         * Issue: IMAGE_MISSING_ALT_TEXT
         * This accessible image has no ariaLabel, so it should trigger the missing-alt-text violation
         */}
                <TestCase title="Test case 1: Missing alt text (unlabeled)">
                    <View
                        style={styles.imageContainer}
                        accessible={true}
                        accessibilityRole="image"
                    >
                        <Image
                            source={{
                                uri: 'https://reactnative.dev/img/tiny_logo.png'
                            }}
                            style={styles.image}
                        />
                    </View>
                </TestCase>

                {/*
         * No violation: Image has meaningful accessibility label
         * This accessible image has an ariaLabel, so it should NOT trigger any violation
         */}
                <TestCase title="Test case 2: Labeled accessible image">
                    <View
                        style={styles.imageContainer}
                    >
                        <Image
                            source={{
                                uri: 'https://reactnative.dev/img/tiny_logo.png'
                            }}
                            style={styles.image}
                            accessibilityLabel="Product photo showing a blue widget"
                        />
                    </View>
                </TestCase>

                {/*
         * No violation: Decorative/non-accessible image
         * This image is marked as not accessible (decorative), so it should NOT trigger any violation
         */}
                <TestCase title="Test case 3: Decorative (non-accessible) image">
                    <View
                        style={styles.imageContainer}
                    >
                        <Image
                            source={{
                                uri: 'https://reactnative.dev/img/tiny_logo.png'
                            }}
                            style={styles.image}
                            accessible={false}
                            accessibilityElementsHidden
                            importantForAccessibility="no-hide-descendants"
                        />
                    </View>
                </TestCase>

                <Spacer height="big" />
                <Spacer height="big" />
                <Spacer height="big" />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: theme.padding.big,
    },
    imageContainer: {
        width: "100%",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#E8E8E8",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'contain'
    },
});
