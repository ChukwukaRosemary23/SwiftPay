import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { accounts, userData } from '../data/mockData';
import { PAYSTACK_PUBLIC_KEY } from '../config/paystack';

export default function PaystackPaymentScreen({ navigation }: any) {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState(userData.email);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [showWebView, setShowWebView] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const initializePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setShowWebView(true);
  };

  const handleWebViewMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.event === 'success') {
      setShowWebView(false);
      Alert.alert(
        'Payment Successful! 🎉',
        `${formatCurrency(parseFloat(amount))} has been added to your ${selectedAccount.type} account`,
        [
          {
            text: 'Done',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else if (data.event === 'cancelled') {
      setShowWebView(false);
      Alert.alert('Payment Cancelled', 'You cancelled the payment');
    }
  };

  if (showWebView) {
    const paymentAmount = parseFloat(amount) * 100; // Convert to kobo
    const reference = `SWIFT_${Date.now()}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <script src="https://js.paystack.co/v1/inline.js"></script>
        </head>
        <body style="margin: 0; padding: 0; background: #f9fafb;">
          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
            <div style="text-align: center; padding: 20px;">
              <div style="width: 60px; height: 60px; margin: 0 auto 20px; border: 4px solid #4F46E5; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              <h2 style="color: #111827; margin: 0 0 10px 0;">Initializing Payment...</h2>
              <p style="color: #6B7280; margin: 0;">Please wait while we connect to Paystack</p>
            </div>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
          <script>
            function payWithPaystack() {
              var handler = PaystackPop.setup({
                key: '${PAYSTACK_PUBLIC_KEY}',
                email: '${email}',
                amount: ${paymentAmount},
                currency: 'NGN',
                ref: '${reference}',
                onClose: function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    event: 'cancelled'
                  }));
                },
                callback: function(response) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    event: 'success',
                    reference: response.reference
                  }));
                }
              });
              handler.openIframe();
            }
            
            // Auto-open payment modal when page loads
            window.onload = function() {
              setTimeout(payWithPaystack, 500);
            };
          </script>
        </body>
      </html>
    `;

    return (
      <View style={styles.webViewContainer}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity
            onPress={() => setShowWebView(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>Paystack Payment</Text>
          <View style={{ width: 40 }} />
        </View>
        <WebView
          source={{ html: htmlContent }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          style={{ flex: 1 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="shield-checkmark" size={32} color="#10B981" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Secured by Paystack</Text>
          <Text style={styles.infoText}>
            Your payment is processed securely via Paystack
          </Text>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Amount Input */}
        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountInput}>
          <Text style={styles.currencySymbol}>₦</Text>
          <TextInput
            style={styles.amountTextInput}
            placeholder="0.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmounts}>
          {['1000', '5000', '10000', '50000'].map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => setAmount(quickAmount)}
            >
              <Text style={styles.quickAmountText}>₦{parseInt(quickAmount).toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.emailInput}>
          <Ionicons name="mail-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.emailTextInput}
            placeholder="your@email.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        {/* Account Selector */}
        <Text style={styles.label}>Add to Account</Text>
        <View style={styles.accountButtons}>
          {accounts.map((account) => (
            <TouchableOpacity
              key={account.id}
              style={[
                styles.accountButton,
                selectedAccount.id === account.id && styles.accountButtonActive,
                { borderColor: account.color }
              ]}
              onPress={() => setSelectedAccount(account)}
            >
              <View style={[styles.accountButtonDot, { backgroundColor: account.color }]} />
              <View style={styles.accountButtonInfo}>
                <Text style={[
                  styles.accountButtonType,
                  selectedAccount.id === account.id && styles.accountButtonTypeActive
                ]}>
                  {account.type}
                </Text>
                <Text style={styles.accountButtonBalance}>
                  {formatCurrency(account.balance)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Methods Info */}
        <View style={styles.paymentMethodsCard}>
          <Text style={styles.paymentMethodsTitle}>Accepted Payment Methods:</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentMethod}>
              <Ionicons name="card" size={20} color="#4F46E5" />
              <Text style={styles.paymentMethodText}>Card</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="business" size={20} color="#4F46E5" />
              <Text style={styles.paymentMethodText}>Bank</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="phone-portrait" size={20} color="#4F46E5" />
              <Text style={styles.paymentMethodText}>USSD</Text>
            </View>
            <View style={styles.paymentMethod}>
              <Ionicons name="qr-code" size={20} color="#4F46E5" />
              <Text style={styles.paymentMethodText}>QR</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={initializePayment}
        >
          <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
          <Text style={styles.continueButtonText}>
            Continue to Payment
          </Text>
        </TouchableOpacity>
        <Text style={styles.securityText}>
          🔒 Secured by Paystack • Your card details are safe
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#10B98120',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#059669',
  },
  form: {
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    paddingVertical: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  emailInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  emailTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  accountButtons: {
    gap: 12,
    marginBottom: 24,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  accountButtonActive: {
    backgroundColor: '#4F46E510',
  },
  accountButtonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  accountButtonInfo: {
    flex: 1,
  },
  accountButtonType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  accountButtonTypeActive: {
    color: '#4F46E5',
  },
  accountButtonBalance: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  paymentMethodsCard: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
  },
  paymentMethodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethod: {
    alignItems: 'center',
    gap: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  securityText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
});