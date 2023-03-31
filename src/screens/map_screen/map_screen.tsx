import React, { useEffect, useState, useRef, useCallback, ReactElement } from "react";
import { View, Text, Animated, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MapParamList } from "../../scripts/screen_params";
import { useFocusEffect } from "@react-navigation/native";

import { styles } from "./map_styles";
import { styles as globalStyles } from "../../../App_styles";

import { ICardProps } from "../../scripts/interfaces";

import MapIcon from "../../components/map_icon/map_icon";
import Card from "../../components/card/card";

import { useAppSelector, useAppDispatch } from "../../scripts/redux_hooks";
import { selectDarkMode, selectContainerContrast, selectTextContrast } from "../../slices/color/colorSlice";
import { selectIsLoggedIn } from "../../slices/account/accountSlice";
import { selectReadings, fetchAllReadings, emptyReadings } from "../../slices/readings/readingsSlice";

type Props = NativeStackScreenProps<MapParamList, "MapScreen">;

export default function MapScreen({ navigation } : Props) : ReactElement<Props> {
  const dispatch = useAppDispatch();

  const isDarkMode = useAppSelector(selectDarkMode);
  const containerContrast = useAppSelector(selectContainerContrast);
  const textContrast = useAppSelector(selectTextContrast);

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const readings = useAppSelector(selectReadings);

  const [activeMarkers, setActiveMarkers] = useState<boolean[]>([]);
  const [activeCard, setActiveCard] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardProps>({
    isIcon: false,
    highLight: false,
    title: "",
    subtitle1: "",
    subtitle2: "",
    description: "",
    onPress: () => navigation.navigate("ViewReadingScreen", { validNavigation: true })
  });


  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        console.log("Getting Markers...")
        if (!readings.length) dispatch(fetchAllReadings());
      } else {
        dispatch(emptyReadings());
      }
    }, [isLoggedIn])
  );

  useEffect(() => {
    if (readings) {
      setActiveMarkers(readings.map(() => false));
    } else {
      setActiveMarkers([]);
    }
  }, [readings])


  const screenWidth = Dimensions.get("window").width;
  const cardAnimation = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    Animated.timing(cardAnimation, {
      toValue: activeCard ? 0 : screenWidth,
      duration: 200,
      useNativeDriver: true
    }).start();
  }, [activeCard]);

  const handleMarkerPress = (index: number) => {
    const newActiveMarkers = activeMarkers.map((marker, i) => {
      if (i === index) {
        const cardData: ICardProps = {
          isIcon: false,
          highLight: readings[i].isSafe,
          title: `Reading ${readings[i].id}`,
          subtitle1: `${readings[i].location.latitude}, ${readings[i].location.longitude}`,
          subtitle2: `Date: ${readings[i].datetime.date}`,
          description: "Laboris in et ullamco magna excepteur aliquip mollit occaecat aliqua anim exercitation.",
          onPress: () => navigation.navigate("ViewReadingScreen", {
            validNavigation: true,
            readingId: readings[i].id
          })
        }
        setActiveCard(!marker);
        setCardData(cardData);
        return !marker;
      } else {
        return false;
      }
    });
    setActiveMarkers(newActiveMarkers);
  };



  return (
    <View style={styles.container}>
      <MapView
        style={{
          width: '100%',
          height: '100%',
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        zoomControlEnabled={false}
        toolbarEnabled={false}
        userInterfaceStyle={isDarkMode ? "dark" : "light"}
        showsMyLocationButton={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}>
          {
            readings.map((marker: any, index: number) => {
              return (
                <MapIcon
                  key={index}
                  index={index}
                  onActive={handleMarkerPress}
                  active={activeMarkers[index]}
                  latitude={marker.location.latitude}
                  longitude={marker.location.longitude}
                  isSafe={marker.isSafe}
                />
              );
            })
          }
      </MapView>
      {
        isLoggedIn ? (
          <Animated.View style={[
            styles.cardContainer,
            { transform: [
              { translateX: cardAnimation }
            ]}
          ]}>
            <Card {...cardData} />
          </Animated.View>
        ) : (
          <View
            style={[
              globalStyles.tile,
              styles.infoContainer,
              containerContrast,
            ]}
          >
            <Text style={[styles.infoText, textContrast]}>Please Login to use the map to find nearby clean water.</Text>
          </View>
        )
      }
    </View>
  );
}