import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { databaseService, Task } from '@/services/database';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function StatisticsScreen() {
  const [transactions, setTransactions] = useState<Task[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'6months' | '12months'>('6months');

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      await databaseService.initDatabase();
      const allTransactions = await databaseService.getAllTransactions();
      setTransactions(allTransactions);
      processMonthlyData(allTransactions);
    } catch (error) {
      console.error('Error loading statistics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (transactions: Task[]) => {
    const now = new Date();
    const months: MonthlyData[] = [];
    const period = selectedPeriod === '6months' ? 6 : 12;

    // Generate last N months
    for (let i = period - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('vi-VN', { month: 'short', year: '2-digit' });

      // Filter transactions for this month
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        return transactionMonth === monthKey;
      });

      // Calculate totals
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: monthName,
        income,
        expense,
        balance: income - expense
      });
    }

    setMonthlyData(months);
  };

  const getTotalStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length
    };
  };

  const getCategoryStats = () => {
    const categoryStats: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach(transaction => {
      if (!categoryStats[transaction.category]) {
        categoryStats[transaction.category] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        categoryStats[transaction.category].income += transaction.amount;
      } else {
        categoryStats[transaction.category].expense += transaction.amount;
      }
    });

    return Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        ...stats,
        total: stats.income + stats.expense
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Top 5 categories
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6366f1',
    },
  };

  const incomeExpenseChartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        data: monthlyData.map(data => data.income),
        color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`, // Green for income
        strokeWidth: 3,
      },
      {
        data: monthlyData.map(data => data.expense),
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`, // Red for expense
        strokeWidth: 3,
      }
    ],
    legend: ['Thu nhập', 'Chi tiêu']
  };

  const balanceChartData = {
    labels: monthlyData.map(data => data.month),
    datasets: [
      {
        data: monthlyData.map(data => data.balance),
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 3,
      }
    ]
  };

  const stats = getTotalStats();
  const categoryStats = getCategoryStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải thống kê...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống Kê</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <View style={styles.periodButtons}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === '6months' && styles.periodButtonActive
              ]}
              onPress={() => {
                setSelectedPeriod('6months');
                processMonthlyData(transactions);
              }}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === '6months' && styles.periodButtonTextActive
              ]}>
                6 tháng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.periodButton,
                selectedPeriod === '12months' && styles.periodButtonActive
              ]}
              onPress={() => {
                setSelectedPeriod('12months');
                processMonthlyData(transactions);
              }}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === '12months' && styles.periodButtonTextActive
              ]}>
                12 tháng
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Overall Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tổng quan</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="arrow-down" size={24} color="#16a34a" />
              <Text style={styles.statLabel}>Tổng thu nhập</Text>
              <Text style={[styles.statValue, { color: '#16a34a' }]}>
                +${stats.totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="arrow-up" size={24} color="#dc2626" />
              <Text style={styles.statLabel}>Tổng chi tiêu</Text>
              <Text style={[styles.statValue, { color: '#dc2626' }]}>
                -${stats.totalExpense.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="wallet" size={24} color="#6366f1" />
              <Text style={styles.statLabel}>Số dư</Text>
              <Text style={[
                styles.statValue,
                { color: stats.balance >= 0 ? '#16a34a' : '#dc2626' }
              ]}>
                ${stats.balance.toFixed(2)}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="list" size={24} color="#f59e0b" />
              <Text style={styles.statLabel}>Giao dịch</Text>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>
                {stats.transactionCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Income vs Expense Chart */}
        {monthlyData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thu nhập & Chi tiêu theo tháng</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={incomeExpenseChartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        )}

        {/* Balance Trend Chart */}
        {monthlyData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Xu hướng số dư</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={balanceChartData}
                width={screenWidth - 32}
                height={200}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        )}

        {/* Top Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục hàng đầu</Text>
          {categoryStats.map((category, index) => (
            <View key={category.category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <Text style={styles.categoryTotal}>
                  ${category.total.toFixed(2)}
                </Text>
              </View>
              <View style={styles.categoryBreakdown}>
                {category.income > 0 && (
                  <Text style={styles.categoryIncome}>
                    Thu: ${category.income.toFixed(2)}
                  </Text>
                )}
                {category.expense > 0 && (
                  <Text style={styles.categoryExpense}>
                    Chi: ${category.expense.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Monthly Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chi tiết theo tháng</Text>
          {monthlyData.map((month, index) => (
            <View key={index} style={styles.monthItem}>
              <Text style={styles.monthName}>{month.month}</Text>
              <View style={styles.monthStats}>
                <Text style={styles.monthIncome}>+${month.income.toFixed(2)}</Text>
                <Text style={styles.monthExpense}>-${month.expense.toFixed(2)}</Text>
                <Text style={[
                  styles.monthBalance,
                  { color: month.balance >= 0 ? '#16a34a' : '#dc2626' }
                ]}>
                  ${month.balance.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  periodSelector: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  periodButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  categoryTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6366f1',
  },
  categoryBreakdown: {
    flexDirection: 'row',
    gap: 16,
  },
  categoryIncome: {
    fontSize: 12,
    color: '#16a34a',
  },
  categoryExpense: {
    fontSize: 12,
    color: '#dc2626',
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  monthName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  monthStats: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  monthIncome: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'right',
  },
  monthExpense: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'right',
  },
  monthBalance: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'right',
  },
});
