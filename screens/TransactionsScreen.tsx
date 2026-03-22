import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { transactions, categories } from '../data/mockData';

export default function TransactionsScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchByRecipient, setSearchByRecipient] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `₦${absAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by category
    const categoryMatch = selectedCategory === 'All' || transaction.category === selectedCategory;
    
    // Filter by search query (merchant or recipient)
    let searchMatch = true;
    if (searchQuery) {
      if (searchByRecipient) {
        searchMatch = transaction.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        searchMatch = transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase());
      }
    }
    
    return categoryMatch && searchMatch;
  });

  // Calculate total for filtered transactions
  const totalSent = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={searchByRecipient ? "Search by recipient..." : "Search transactions..."}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Toggle Search Mode */}
        <TouchableOpacity 
          style={[styles.toggleButton, searchByRecipient && styles.toggleButtonActive]}
          onPress={() => setSearchByRecipient(!searchByRecipient)}
        >
          <Ionicons 
            name={searchByRecipient ? "person" : "person-outline"} 
            size={20} 
            color={searchByRecipient ? "#FFFFFF" : "#4F46E5"} 
          />
          <Text style={[styles.toggleText, searchByRecipient && styles.toggleTextActive]}>
            By Recipient
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary Card */}
      {searchByRecipient && searchQuery && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Total sent to {searchQuery}:
          </Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalSent)}
          </Text>
          <Text style={styles.summaryCount}>
            {filteredTransactions.filter(t => t.amount < 0).length} transactions
          </Text>
        </View>
      )}

      {/* Transactions List */}
      <ScrollView 
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsCount}>
          {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
        </Text>

        {filteredTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionItem}
          >
            <View style={[
              styles.transactionIcon, 
              { backgroundColor: transaction.type === 'income' ? '#10B98120' : '#4F46E520' }
            ]}>
              <Ionicons 
                name={transaction.icon as any} 
                size={24} 
                color={transaction.type === 'income' ? '#10B981' : '#4F46E5'} 
              />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
              <Text style={styles.transactionDate}>
                {formatDate(transaction.date)} • {transaction.category}
              </Text>
              {searchByRecipient && (
                <Text style={styles.transactionRecipient}>
                  To: {transaction.recipient}
                </Text>
              )}
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'income' ? '#10B981' : '#111827' }
                ]}
              >
                {transaction.type === 'income' ? '+' : ''}
                {formatCurrency(transaction.amount)}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: transaction.status === 'completed' ? '#10B98120' : '#F59E0B20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: transaction.status === 'completed' ? '#10B981' : '#F59E0B' }
                ]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4F46E5',
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#4F46E5',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 24,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    marginHorizontal: 24,
    backgroundColor: '#4F46E5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
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
  transactionRecipient: {
    fontSize: 12,
    color: '#4F46E5',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});