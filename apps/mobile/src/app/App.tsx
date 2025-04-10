import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../components/home';
import Queuing from '../components/queueing';
// import Parking from '../components/parking';
// import ParkingSpot from '../components/parkingSpot';
// import SignIn from '../components/signin';
// import ShopDetails from '../components/shop';
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
// import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';

if (SplashScreen.preventAutoHideAsync) {
  SplashScreen.preventAutoHideAsync();
}
if (SplashScreen.hideAsync) {
  SplashScreen.hideAsync();
}

const Stack = createNativeStackNavigator();

export const App = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Queuing" component={Queuing} />
        {/* {<Stack.Screen name="Parking Helper" component={Parking} />} */}
        {/* <Stack.Screen name="ParkingSpot" component={ParkingSpot} /> */}
        {/* <Stack.Screen name="SignIn" component={SignIn} /> */}
        {/* <Stack.Screen name="Shop" component={ShopDetails} />  */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
