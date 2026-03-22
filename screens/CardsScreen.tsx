import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userCards } from '../data/mockData';

export default function CardsScreen({ navigation }: any) {
  const [cards, setCards] = useState(userCards);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatLastUsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toggleFreeze = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    const action = card?.isFrozen ? 'unfreeze' : 'freeze';

    Alert.alert(
      `${action === 'freeze' ? 'Freeze' : 'Unfreeze'} Card?`,
      `Are you sure you want to ${action} this card?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'freeze' ? 'Freeze Card' : 'Unfreeze Card',
          onPress: () => {
            setCards(cards.map(c =>
              c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c
            ));
            Alert.alert(
              'Success',
              `Card ${action === 'freeze' ? 'frozen' : 'unfrozen'} successfully!`
            );
          },
        },
      ]
    );
  };

  const reportLost = (cardId: string) => {
    Alert.alert(
      'Report Lost/Stolen Card',
      'This will permanently block your card and order a replacement. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report & Block',
          style: 'destructive',
          onPress: () => {
            setCards(cards.map(c =>
              c.id === cardId ? { ...c, status: 'blocked', isFrozen: true } : c
            ));
            Alert.alert(
              'Card Blocked',
              'Your card has been blocked. A replacement will be sent within 5-7 business days.'
            );
          },
        },
      ]
    );
  };

  const viewCardDetails = (card: any) => {
    setSelectedCard(card);
    setShowCardDetails(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cards</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cards List */}
        {cards.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            {/* Card Visual */}
            <TouchableOpacity
              style={[styles.card, { backgroundColor: card.cardColor }]}
              onPress={() => viewCardDetails(card)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{card.type}</Text>
                <Ionicons name="card" size={32} color="#FFFFFF" />
              </View>

              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>{card.cardNumberMasked}</Text>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardholderName}>{card.cardholderName}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardExpiry}>{card.expiryDate}</Text>
                </View>
              </View>

              {card.isFrozen && (
                <View style={styles.frozenOverlay}>
                  <Ionicons name="snow" size={32} color="#FFFFFF" />
                  <Text style={styles.frozenText}>FROZEN</Text>
                </View>
              )}

              {card.status === 'blocked' && (
                <View style={[styles.frozenOverlay, { backgroundColor: 'rgba(239, 68, 68, 0.95)' }]}>
                  <Ionicons name="ban" size={32} color="#FFFFFF" />
                  <Text style={styles.frozenText}>BLOCKED</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Card Info */}
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Linked Account</Text>
                <Text style={styles.infoValue}>{card.accountName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Last Used</Text>
                <Text style={styles.infoValue}>{formatLastUsed(card.lastUsed)}</Text>
              </View>
            </View>

            {/* Spending Limits */}
            <View style={styles.limitsCard}>
              <Text style={styles.limitsTitle}>Spending Limits</Text>
              
              <View style={styles.limitItem}>
                <View style={styles.limitHeader}>
                  <Text style={styles.limitLabel}>Daily Limit</Text>
                  <Text style={styles.limitAmount}>
                    {formatCurrency(card.currentDailySpent)} / {formatCurrency(card.dailyLimit)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(card.currentDailySpent / card.dailyLimit) * 100}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.limitItem}>
                <View style={styles.limitHeader}>
                  <Text style={styles.limitLabel}>Monthly Limit</Text>
                  <Text style={styles.limitAmount}>
                    {formatCurrency(card.currentMonthlySpent)} / {formatCurrency(card.monthlyLimit)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(card.currentMonthlySpent / card.monthlyLimit) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Card Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  card.isFrozen && styles.actionButtonUnfreeze,
                  card.status === 'blocked' && styles.actionButtonDisabled,
                ]}
                onPress={() => toggleFreeze(card.id)}
                disabled={card.status === 'blocked'}
              >
                <Ionicons
                  name={card.isFrozen ? 'snow' : 'snow-outline'}
                  size={20}
                  color={card.status === 'blocked' ? '#9CA3AF' : card.isFrozen ? '#FFFFFF' : '#4F46E5'}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    card.isFrozen && styles.actionButtonTextUnfreeze,
                    card.status === 'blocked' && styles.actionButtonTextDisabled,
                  ]}
                >
                  {card.isFrozen ? 'Unfreeze' : 'Freeze Card'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, card.status === 'blocked' && styles.actionButtonDisabled]}
                onPress={() => viewCardDetails(card)}
                disabled={card.status === 'blocked'}
              >
                <Ionicons name="eye-outline" size={20} color={card.status === 'blocked' ? '#9CA3AF' : '#4F46E5'} />
                <Text style={[styles.actionButtonText, card.status === 'blocked' && styles.actionButtonTextDisabled]}>
                  View Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonDanger, card.status === 'blocked' && styles.actionButtonDisabled]}
                onPress={() => reportLost(card.id)}
                disabled={card.status === 'blocked'}
              >
                <Ionicons name="alert-circle-outline" size={20} color={card.status === 'blocked' ? '#9CA3AF' : '#EF4444'} />
                <Text style={[styles.actionButtonText, styles.actionButtonTextDanger, card.status === 'blocked' && styles.actionButtonTextDisabled]}>
                  Report Lost
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Card Details Modal */}
      <Modal
        visible={showCardDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCardDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Card Details</Text>
              <TouchableOpacity onPress={() => setShowCardDetails(false)}>
                <Ionicons name="close" size={28} color="#111827" />
              </TouchableOpacity>
            </View>

            {selectedCard && (
              <View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Card Number</Text>
                  <Text style={styles.detailValue}>{selectedCard.cardNumber}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>CVV</Text>
                  <Text style={styles.detailValue}>{selectedCard.cvv}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Expiry Date</Text>
                  <Text style={styles.detailValue}>{selectedCard.expiryDate}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Cardholder Name</Text>
                  <Text style={styles.detailValue}>{selectedCard.cardholderName}</Text>
                </View>

                <View style={styles.warningBox}>
                  <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                  <Text style={styles.warningText}>
                    Keep your card details secure. Never share your CVV or full card number.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  cardContainer: {
    marginBottom: 24,
  },
  card: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 24,
    borderRadius: 20,
    height: 200,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cardNumber: {
    marginTop: 20,
  },
  cardNumberText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  cardholderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardExpiry: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  frozenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frozenText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  cardInfo: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  limitsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  limitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  limitItem: {
    marginBottom: 16,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  limitLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  limitAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonUnfreeze: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  actionButtonDanger: {
    borderColor: '#FEE2E2',
  },
  actionButtonDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  actionButtonTextUnfreeze: {
    color: '#FFFFFF',
  },
  actionButtonTextDanger: {
    color: '#EF4444',
  },
  actionButtonTextDisabled: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  detailItem: {
    marginBottom: 24,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#059669',
  },
});