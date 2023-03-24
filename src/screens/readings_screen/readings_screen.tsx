import React, { ReactElement } from "react";
import { View, Text, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ReadingsParamList } from "../../scripts/screen_params";

import { styles } from "./readings_styles";

import Card from "../../components/card/card";

import readingsData from "./readings_data.temp.json";

type Props = NativeStackScreenProps<ReadingsParamList, "ReadingsScreen">;

export default function ReadingsScreen({ navigation } : Props) : ReactElement<Props> {
  const cards = readingsData.cards;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: 90,
        }}>
        <Text style={styles.title}>Readings</Text>
        {
          cards.map((card, index) => {
            return (
              <Card
                key={index}
                isIcon={false}
                highLight={card.highlight}
                title={card.title}
                subtitle1={card.location}
                subtitle2={card.date} 
                description={card.description}
                onPress={() => navigation.navigate("ViewReadingScreen", { validNavigation: true })}
              />
            );
          })
        }
      </ScrollView>
    </View>
  );
}