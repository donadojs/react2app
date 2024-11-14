import { View, Text } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FALLBACK_URL = "https://react2app.com";

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "white",
      }}
    >
      <WebView
        source={{
          uri: process.env.EXPO_PUBLIC_WEBVIEW_URL || FALLBACK_URL,
        }}
      />
    </View>
  );
}
