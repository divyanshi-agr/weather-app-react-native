import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import WeatherInfo from "./components/WeatherInfo";

const WEATHER_API_KEY = "b11e164ebef76353eec59d517247f7e1";
const BASE_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?";

export default function App() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unitSystem, setUnitSystem] = useState("metric");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setErrorMsg("Please allow access to location");
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitSystem}&appid=${WEATHER_API_KEY}`;

      const response = await fetch(weatherUrl);

      const result = await response.json();

      console.log("Result : ", result);

      if (response.ok) {
        setCurrentWeather(result);
      } else {
        setErrorMsg(result.message);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  }

  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <WeatherInfo currentWeather={currentWeather} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  main: {
    justifyContent: "center",
    flex: 1,
  },
});
