import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { notifications as mockNotifications } from '../data/mockData';

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useTheme();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount);
    return `₦${absAmount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
              {unreadCount} unread
            </Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: colors.card }]}>

        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
        <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingRight: 24 }}
>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'all' && styles.filterTabActive,
              filter === 'all' && { backgroundColor: '#4F46E520' },
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: filter === 'all' ? '#4F46E5' : colors.subtext },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'transaction' && styles.filterTabActive,
              filter === 'transaction' && { backgroundColor: '#10B98120' },
            ]}
            onPress={() => setFilter('transaction')}
          >
            <Ionicons
              name="swap-horizontal"
              size={16}
              color={filter === 'transaction' ? '#10B981' : colors.subtext}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: filter === 'transaction' ? '#10B981' : colors.subtext },
              ]}
            >
              Transactions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'service' && styles.filterTabActive,
              filter === 'service' && { backgroundColor: '#F59E0B20' },
            ]}
            onPress={() => setFilter('service')}
          >
            <Ionicons
              name="settings"
              size={16}
              color={filter === 'service' ? '#F59E0B' : colors.subtext}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: filter === 'service' ? '#F59E0B' : colors.subtext },
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterTab,
              filter === 'activity' && styles.filterTabActive,
              filter === 'activity' && { backgroundColor: '#8B5CF620' },
            ]}
            onPress={() => setFilter('activity')}
          >
            <Ionicons
              name="pulse"
              size={16}
              color={filter === 'activity' ? '#8B5CF6' : colors.subtext}
            />
            <Text
              style={[
                styles.filterTabText,
                { color: filter === 'activity' ? '#8B5CF6' : colors.subtext },
              ]}
            >
              Activities
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color={colors.subtext} />
            <Text style={[styles.emptyStateText, { color: colors.subtext }]}>
              No notifications in this category
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                {
                  backgroundColor: notification.read ? colors.background : colors.card,
                  borderLeftColor: notification.iconColor,
                },
              ]}
            >
              <View
                style={[
                  styles.notificationIcon,
                  { backgroundColor: `${notification.iconColor}20` },
                ]}
              >
                <Ionicons
                  name={notification.icon as any}
                  size={24}
                  color={notification.iconColor}
                />
              </View>

              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[styles.notificationTitle, { color: colors.text }]}>
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={[styles.notificationMessage, { color: colors.subtext }]}>
                  {notification.message}
                </Text>
                <View style={styles.notificationFooter}>
                  <Text style={[styles.notificationDate, { color: colors.subtext }]}>
                    {formatDate(notification.date)}
                  </Text>
                  {notification.amount && (
                    <Text
                      style={[
                        styles.notificationAmount,
                        {
                          color:
                            notification.amount > 0
                              ? '#10B981'
                              : '#EF4444',
                        },
                      ]}
                    >
                      {notification.amount > 0 ? '+' : ''}
                      {formatAmount(notification.amount)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
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
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  filterTabActive: {
    // Background color set dynamically
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationDate: {
    fontSize: 12,
  },
  notificationAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
});