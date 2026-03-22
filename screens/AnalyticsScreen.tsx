import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { spendingByCategory, monthlySpending, financialInsights } from '../data/mockData';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen({ navigation }: any) {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Prepare pie chart data
  const pieChartData = spendingByCategory.map((item) => ({
    name: item.category,
    population: item.amount,
    color: item.color,
    legendFontColor: '#6B7280',
    legendFontSize: 12,
  }));

  // Chart config
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['This Week', 'This Month', 'This Year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Financial Health Score */}
        <View style={styles.healthScoreCard}>
          <View style={styles.healthScoreHeader}>
            <Text style={styles.healthScoreTitle}>Financial Health Score</Text>
            <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          </View>
          <View style={styles.healthScoreContent}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{financialInsights.financialHealthScore}</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <View style={styles.scoreDetails}>
              <View style={styles.scoreItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.scoreItemText}>Excellent Savings Rate</Text>
              </View>
              <View style={styles.scoreItem}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.scoreItemText}>Budget On Track</Text>
              </View>
              <View style={styles.scoreItem}>
                <Ionicons name="information-circle" size={20} color="#F59E0B" />
                <Text style={styles.scoreItemText}>High Shopping Spend</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={[styles.summaryCard, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <Text style={styles.summaryAmount}>{formatCurrency(financialInsights.totalIncome)}</Text>
            <Text style={styles.summaryLabel}>Total Income</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="trending-down" size={24} color="#EF4444" />
            <Text style={styles.summaryAmount}>{formatCurrency(financialInsights.totalExpenses)}</Text>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="wallet" size={24} color="#4F46E5" />
            <Text style={styles.summaryAmount}>{formatCurrency(financialInsights.savings)}</Text>
            <Text style={styles.summaryLabel}>Savings</Text>
          </View>
        </View>

        {/* Spending by Category - Pie Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending by Category</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 0]}
            absolute
          />
        </View>

        {/* Category Breakdown */}
        <View style={styles.categoryCard}>
          <Text style={styles.chartTitle}>Category Breakdown</Text>
          {spendingByCategory.map((item, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                <Text style={styles.categoryName}>{item.category}</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categoryAmount}>{formatCurrency(item.amount)}</Text>
                <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Trend - Bar Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Spending Trend</Text>
          <BarChart
            data={{
              labels: monthlySpending.map(m => m.month),
              datasets: [{ data: monthlySpending.map(m => m.amount) }],
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel="₦"
            yAxisSuffix="k"
            fromZero
            showBarTops={false}
          />
        </View>

        {/* Monthly Trend - Line Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Spending Pattern</Text>
          <LineChart
            data={{
              labels: monthlySpending.map(m => m.month),
              datasets: [{ data: monthlySpending.map(m => m.amount) }],
            }}
            width={screenWidth - 48}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
            }}
            bezier
            style={styles.chart}
            yAxisLabel="₦"
            yAxisSuffix="k"
          />
        </View>

        {/* Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.chartTitle}>Smart Insights</Text>
          <View style={styles.insightItem}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Top Spending Category</Text>
              <Text style={styles.insightDescription}>
                You spent the most on {financialInsights.topSpendingCategory} this month
              </Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Savings Rate</Text>
              <Text style={styles.insightDescription}>
                You're saving {financialInsights.savingsRate}% of your income - Excellent!
              </Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="calendar" size={24} color="#4F46E5" />
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Daily Average</Text>
              <Text style={styles.insightDescription}>
                Your average daily spending is {formatCurrency(financialInsights.averageDailySpending)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  periodSelector: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  healthScoreCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  healthScoreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  healthScoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E510',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#4F46E5',
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  scoreOutOf: {
    fontSize: 14,
    color: '#6B7280',
  },
  scoreDetails: {
    flex: 1,
    gap: 8,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreItemText: {
    fontSize: 14,
    color: '#111827',
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  insightsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  insightItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});