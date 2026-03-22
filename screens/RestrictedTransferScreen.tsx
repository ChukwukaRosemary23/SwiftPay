import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { accounts, spendingRestrictions, merchantCategories } from '../data/mockData';

export default function RestrictedTransferScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedRestriction, setSelectedRestriction] = useState(spendingRestrictions[0]);
  const [note, setNote] = useState('');

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
  };

  const handleSend = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numericAmount = parseFloat(amount.replace(/,/g, ''));

    if (numericAmount > selectedAccount.balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds in this account');
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Send ₦${amount} to ${recipient}\n\nRestriction: ${selectedRestriction.name}\n\nThe recipient can only spend this money on ${selectedRestriction.description.toLowerCase()}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert(
              'Success! 🎉',
              `₦${amount} sent to ${recipient}\n\nRestriction: ${selectedRestriction.name}\n\nYou will be notified when they try to spend this money.`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Restricted Transfer</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" />
          <Text style={[styles.infoBannerText, { color: colors.text }]}>
            Send money with purpose-based restrictions. Recipient can only spend on approved categories.
          </Text>
        </View>

        {/* Select Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>From Account</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {accounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountOption,
                  { 
                    backgroundColor: selectedAccount.id === account.id ? account.color : colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setSelectedAccount(account)}
              >
                <Text style={[
                  styles.accountOptionType,
                  { color: selectedAccount.id === account.id ? '#FFFFFF' : colors.text }
                ]}>
                  {account.type}
                </Text>
                <Text style={[
                  styles.accountOptionBalance,
                  { color: selectedAccount.id === account.id ? '#FFFFFF' : colors.subtext }
                ]}>
                  ₦{account.balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recipient */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recipient</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter recipient name or account"
              placeholderTextColor={colors.subtext}
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amount</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>₦</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.subtext}
              keyboardType="numeric"
              value={amount}
              onChangeText={handleAmountChange}
            />
          </View>
        </View>

        {/* Spending Restrictions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Spending Restriction</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>
            Choose where this money can be spent
          </Text>
          
          <View style={styles.restrictionsGrid}>
            {spendingRestrictions.map((restriction) => (
              <TouchableOpacity
                key={restriction.id}
                style={[
                  styles.restrictionCard,
                  {
                    backgroundColor: selectedRestriction.id === restriction.id ? restriction.color : colors.card,
                    borderColor: selectedRestriction.id === restriction.id ? restriction.color : colors.border,
                  },
                ]}
                onPress={() => setSelectedRestriction(restriction)}
              >
                <Ionicons
                  name={restriction.icon as any}
                  size={32}
                  color={selectedRestriction.id === restriction.id ? '#FFFFFF' : restriction.color}
                />
                <Text
                  style={[
                    styles.restrictionName,
                    { color: selectedRestriction.id === restriction.id ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {restriction.name}
                </Text>
                <Text
                  style={[
                    styles.restrictionDescription,
                    { color: selectedRestriction.id === restriction.id ? '#FFFFFF' : colors.subtext },
                  ]}
                  numberOfLines={2}
                >
                  {restriction.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Restriction Info */}
        {selectedRestriction.id !== 'unrestricted' && (
          <View style={[styles.selectedRestrictionInfo, { backgroundColor: `${selectedRestriction.color}20` }]}>
            <Ionicons name="shield-checkmark" size={24} color={selectedRestriction.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.selectedRestrictionTitle, { color: selectedRestriction.color }]}>
                {selectedRestriction.name}
              </Text>
              <Text style={[styles.selectedRestrictionText, { color: colors.text }]}>
                This money can only be spent on: {selectedRestriction.description}
              </Text>
              <Text style={[styles.selectedRestrictionText, { color: colors.subtext, marginTop: 4 }]}>
                ✓ You'll be notified of all transactions
              </Text>
            </View>
          </View>
        )}

        {/* Note (Optional) */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Note (Optional)</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="text-outline" size={20} color={colors.subtext} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Add a note for the recipient"
              placeholderTextColor={colors.subtext}
              value={note}
              onChangeText={setNote}
              multiline
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Send Button */}
      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send Money</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  accountOption: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
  },
  accountOptionType: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountOptionBalance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  restrictionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  restrictionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  restrictionName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  restrictionDescription: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  selectedRestrictionInfo: {
    flexDirection: 'row',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },
  selectedRestrictionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedRestrictionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopWidth: 1,
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});