import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { userData, accounts } from '../data/mockData';

export default function QRCodeScreen({ navigation }: any) {
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  // Generate QR data
  const qrData = JSON.stringify({
    accountNumber: selectedAccount.accountNumber,
    accountName: userData.name,
    bankCode: 'SWIFTPAY',
    amount: null, // Receiver can specify amount
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Pay me via SwiftPay!\nAccount: ${selectedAccount.accountNumber}\nName: ${userData.name}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share QR code');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Receive Payment</Text>
          <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" />
          <Text style={styles.instructionsText}>
            Show this QR code to receive payments instantly
          </Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={qrData}
              size={240}
              backgroundColor="white"
              color="#4F46E5"
            />
          </View>
          
          {/* Account Info */}
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{userData.name}</Text>
            <Text style={styles.accountNumber}>{selectedAccount.accountNumber}</Text>
            <View style={styles.accountTypeBadge}>
              <Text style={styles.accountTypeText}>{selectedAccount.type} Account</Text>
            </View>
          </View>
        </View>

        {/* Account Selector */}
        <View style={styles.accountSelector}>
          <Text style={styles.selectorLabel}>Select Account</Text>
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
                <Text style={[
                  styles.accountButtonText,
                  selectedAccount.id === account.id && styles.accountButtonTextActive
                ]}>
                  {account.type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="scan" size={24} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan to Pay</Text>
          </TouchableOpacity>
        </View>

        {/* Extra Bottom Space */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 20,
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
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  accountInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  accountTypeBadge: {
    backgroundColor: '#4F46E520',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  accountTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  accountSelector: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  accountButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  accountButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  accountButtonActive: {
    backgroundColor: '#4F46E510',
  },
  accountButtonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  accountButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  accountButtonTextActive: {
    color: '#4F46E5',
  },
  actionButtons: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});