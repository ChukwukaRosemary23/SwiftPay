import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './context/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import TransactionsScreen from './screens/TransactionsScreen';
import QRCodeScreen from './screens/QRCodeScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import PaymentConfirmScreen from './screens/PaymentConfirmScreen';
import PaystackPaymentScreen from './screens/PaystackPaymentScreen';
import ATMFinderScreen from './screens/ATMFinderScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import CardsScreen from './screens/CardsScreen';
import RestrictedTransferScreen from './screens/RestrictedTransferScreen';
import NotificationsScreen from './screens/NotificationsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Transactions" component={TransactionsScreen} />
          <Stack.Screen name="QRCode" component={QRCodeScreen} />
          <Stack.Screen name="QRScanner" component={QRScannerScreen} />
          <Stack.Screen name="PaymentConfirm" component={PaymentConfirmScreen} />
          <Stack.Screen name="PaystackPayment" component={PaystackPaymentScreen} />
          <Stack.Screen name="ATMFinder" component={ATMFinderScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="Cards" component={CardsScreen} />
          <Stack.Screen name="RestrictedTransfer" component={RestrictedTransferScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}