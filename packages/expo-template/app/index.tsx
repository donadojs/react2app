import { View } from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

const FALLBACK_URL = "https://react2app.com";

export default function Home() {
  const insets = useSafeAreaInsets();

  const onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === "vibrate") {
      Haptics.impactAsync();
    }
  };

  const injectedJavaScript = `
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'vibrate' }));
      true; 
    `;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top - 8,
          paddingBottom: insets.bottom - 8,
          backgroundColor: "white",
        }}
      >
        <WebView
          source={{
            uri: process.env.EXPO_PUBLIC_WEBVIEW_URL || FALLBACK_URL,
          }}
          onMessage={onMessage}
          injectedJavaScript={injectedJavaScript}
          javaScriptEnabled={true}
          allowsBackForwardNavigationGestures
          decelerationRate={1.1}
        />
      </View>
    </View>
  );
}
