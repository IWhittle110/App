import React, { ReactElement, useContext } from "react";
import { View, Text, useColorScheme } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeParamList } from "../../scripts/screen_params";

import { styles } from "./home_styles";
import { styles as globalStyles } from "../../../App_styles";

import { ColorContext } from "../../context/color_context";
import { color3, color3Light, hslToString } from "../../scripts/colors";

import HomeSvg from "../../assets/svgs/home.svg";
import Button from "../../components/button/button";

type Props = NativeStackScreenProps<HomeParamList, "HomeScreen">;

export default function HomeScreen({ navigation } : Props) : ReactElement<Props> {
  const { color, colorLight } = useContext(ColorContext);
  
  const isDarkMode = useColorScheme() === "dark";

  return (
    <View style={[globalStyles.page, styles.pageContainer, isDarkMode ? globalStyles.darkPage : globalStyles.lightPage]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: hslToString(color)}]}>Biodevices</Text>
        <Text style={[styles.headerPlain, isDarkMode ? globalStyles.darkText : globalStyles.lightText]}>Without</Text> 
        <Text style={[styles.headerText, { color: hslToString(color)}]}>Borders</Text>
      </View>
      <View style={styles.svgContainer}>
        <HomeSvg height="100%" width="100%" color={hslToString(colorLight)} style={styles.svg} />
      </View>
      <View style={[globalStyles.tile, styles.buttonPanel, isDarkMode ? globalStyles.darkContainer : globalStyles.lightContainer]}>
        <View style={styles.buttonContainer}>
          <Button onPress={() => navigation.navigate("LoadingScreen", { validNavigation: true })}>
            <Text style={styles.buttonText}>Take Readings</Text>
          </Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => navigation.navigate("HelpScreen", { validNavigation: true })}>
            <Text style={styles.buttonText}>Help</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}