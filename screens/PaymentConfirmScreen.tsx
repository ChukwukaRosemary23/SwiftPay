import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { accounts } from '../data/mockData';

export default function PaymentConfirmScreen({ navigation, route }: any) {
  const { paymentData } = route.params;
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handlePay = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const paymentAmount = parseFloat(amount);

    if (paymentAmount > selectedAccount.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds in this account');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      Alert.alert(
        'Payment Successful! 🎉',
        `${formatCurrency(paymentAmount)} sent to ${paymentData.accountName}`,
        [
          {
            text: 'Done',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Recipient Info */}
      <View style={styles.recipientCard}>
        <View style={styles.recipientIcon}>
          <Ionicons name="person" size={32} color="#4F46E5" />
        </View>
        <Text style={styles.recipientName}>{paymentData.accountName}</Text>
        <Text style={styles.recipientAccount}>{paymentData.accountNumber}</Text>
        <View style={styles.bankBadge}>
          <Text style={styles.bankBadgeText}>{paymentData.bankCode}</Text>
        </View>
      </View>

      {/* Amount Input */}
      <View style={styles.form}>
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

        {/* Note Input */}
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a note..."
          placeholderTextColor="#9CA3AF"
          value={note}
          onChangeText={setNote}
          multiline
        />

        {/* Account Selector */}
        <Text style={styles.label}>Pay from</Text>
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
      </View>

      {/* Pay Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.payButtonText}>
                Pay {amount ? formatCurrency(parseFloat(amount)) : '₦0.00'}
              </Text>
            </>
          )}
        </TouchableOpacity>
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
  recipientCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  recipientIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E520',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  recipientAccount: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  bankBadge: {
    backgroundColor: '#4F46E520',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  bankBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
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
    marginBottom: 24,
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
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 24,
    minHeight: 80,
    textAlignVertical: 'top',
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#F9FAFB',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});