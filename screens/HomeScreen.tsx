import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userData, accounts, transactions } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }: any) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const { theme, toggleTheme, colors } = useTheme();
  
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  // Show either 5 or all transactions
  const displayedTransactions = showAllTransactions ? transactions : transactions.slice(0, 5);

  // Format currency
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `₦${absAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.subtext }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: colors.card }]}>
              <Ionicons 
                name={theme === 'dark' ? 'sunny' : 'moon'} 
                size={24} 
                color={colors.text} 
              />
            </TouchableOpacity>


            {/* <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.card }]}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity> */}

            <TouchableOpacity 
  style={[styles.notificationButton, { backgroundColor: colors.card }]}
  onPress={() => navigation.navigate('Notifications')}
>
  <Ionicons name="notifications-outline" size={24} color={colors.text} />
  <View style={styles.notificationBadge}>
    <Text style={styles.notificationBadgeText}>3</Text>
  </View>
</TouchableOpacity>


          </View>
        </View>

        {/* Account Cards */}
        <View style={styles.accountCardsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            contentContainerStyle={styles.accountCardsScroll}
          >
            {accounts.map((account) => (
              <View 
                key={account.id}
                style={[styles.accountCard, { backgroundColor: account.color }]}
              >
                <View style={styles.accountCardHeader}>
                  <Text style={styles.accountType}>{account.type}</Text>
                  <Ionicons name="card-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.balanceRow}>
                  <Text style={styles.accountBalance}>
                    {balanceVisible ? formatCurrency(account.balance) : '₦ • • • • • •'}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setBalanceVisible(!balanceVisible)}
                    style={styles.eyeButton}
                  >
                    <Ionicons 
                      name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.accountNumber}>{account.accountNumber}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Total Balance */}
        <View style={[styles.totalBalanceCard, { backgroundColor: colors.card }]}>
          <View style={styles.totalBalanceHeader}>
            <Text style={[styles.totalBalanceLabel, { color: colors.subtext }]}>Total Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              <Ionicons 
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'} 
                size={20} 
                color={colors.subtext} 
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.totalBalanceAmount, { color: colors.text }]}>
            {balanceVisible ? formatCurrency(totalBalance) : '₦ • • • • • •'}
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>

          {/* <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => console.log('Transfer clicked')}
          > */}
          <TouchableOpacity 
  style={[styles.actionButton, { backgroundColor: colors.card }]}
  onPress={() => navigation.navigate('RestrictedTransfer')}
>
            <View style={[styles.actionIcon, { backgroundColor: '#4F46E520' }]}>
              <Ionicons name="send" size={24} color="#4F46E5" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('QRCode')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#10B98120' }]}>
              <Ionicons name="qr-code" size={24} color="#10B981" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>QR Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('Cards')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="card" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Cards</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => navigation.navigate('ATMFinder')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="location" size={24} color="#EF4444" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>ATMs</Text>
          </TouchableOpacity>
        </View>

        {/* Analytics Banner */}
        <TouchableOpacity 
          style={[styles.analyticsBanner, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate('Analytics')}
        >
          <View style={styles.analyticsBannerLeft}>
            <View style={styles.analyticsBannerIcon}>
              <Ionicons name="bar-chart" size={32} color="#4F46E5" />
            </View>
            <View>
              <Text style={[styles.analyticsBannerTitle, { color: colors.text }]}>Spending Analytics</Text>
              <Text style={[styles.analyticsBannerSubtitle, { color: colors.subtext }]}>
                View insights & trends
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.subtext} />
        </TouchableOpacity>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {displayedTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={[styles.transactionItem, { backgroundColor: colors.card }]}
            >
              <View style={[styles.transactionIcon, { backgroundColor: '#4F46E520' }]}>
                <Ionicons name={transaction.icon as any} size={24} color="#4F46E5" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionMerchant, { color: colors.text }]}>{transaction.merchant}</Text>
                <Text style={[styles.transactionDate, { color: colors.subtext }]}>
                  {formatDate(transaction.date)} • {transaction.category}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? '#10B981' : colors.text }
                ]}
              >
                {transaction.type === 'income' ? '+' : ''}
                {formatCurrency(transaction.amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Money Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('PaystackPayment')}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  accountCardsContainer: {
    marginBottom: 20,
  },
  accountCardsScroll: {
    paddingHorizontal: 24,
  },
  accountCard: {
    width: 320,
    height: 200,
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  accountCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountType: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.9,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountBalance: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  eyeButton: {
    padding: 8,
  },
  accountNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 0.8,
  },
  totalBalanceCard: {
    marginHorizontal: 24,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  totalBalanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalBalanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  transactionsSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  analyticsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#4F46E520',
  },
  analyticsBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  analyticsBannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E510',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsBannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  analyticsBannerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
});