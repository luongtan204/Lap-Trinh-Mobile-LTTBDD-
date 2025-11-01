import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Alert,
  Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { databaseService, Task } from '@/services/database';
import { useCallback } from 'react';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: 'income' | 'expense';
}

export default function ExpenseTrackerScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [refreshing, setRefreshing] = useState(false);

  // Initialize database và load transactions
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await databaseService.initDatabase();
      await loadTransactions();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const dbTransactions = await databaseService.getAllTransactions();
      // Convert Task to Transaction format
      const convertedTransactions: Transaction[] = dbTransactions.map(task => ({
        id: task.id,
        title: task.title,
        amount: task.amount,
        category: task.category,
        createdAt: task.createdAt,
        type: task.type
      }));
      setTransactions(convertedTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Others'];  const addTransaction = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await databaseService.addTransaction(
        title.trim(),
        parseFloat(amount),
        category,
        transactionType
      );
      
      // Reload transactions from database
      await loadTransactions();
      
      setTitle('');
      setAmount('');
      setModalVisible(false);
      
      Alert.alert('Thành công', 'Giao dịch đã được thêm vào cơ sở dữ liệu');
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Lỗi', 'Không thể thêm giao dịch');
    }
  };  const deleteTransaction = (id: number) => {
    Alert.alert(
      'Xóa Giao Dịch',
      'Bạn có chắc chắn muốn xóa giao dịch này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteTransaction(id);
              await loadTransactions();
              Alert.alert('Thành công', 'Giao dịch đã được xóa');
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Lỗi', 'Không thể xóa giao dịch');
            }
          }
        }
      ]
    );
  };
  const getTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      Food: 'restaurant',
      Transport: 'car',
      Shopping: 'bag',
      Entertainment: 'game-controller',
      Bills: 'receipt',
      Others: 'ellipsis-horizontal'
    };
    return icons[category] || 'ellipsis-horizontal';
  };  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => router.push('/add-transaction')} // Điều hướng khi nhấn vào item theo yêu cầu câu a
    >
      <View style={[styles.transactionIcon, { backgroundColor: item.type === 'income' ? '#dcfce7' : '#fee2e2' }]}>
        <Ionicons 
          name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} 
          size={24} 
          color={item.type === 'income' ? '#16a34a' : '#dc2626'} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>
          {item.category} • {new Date(item.createdAt).toLocaleDateString('vi-VN')} • {item.type === 'income' ? 'Thu' : 'Chi'}
        </Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText, 
          { color: item.type === 'income' ? '#16a34a' : '#dc2626' }
        ]}>
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation(); // Prevent item press
            deleteTransaction(item.id);
          }}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>EXPENSE TRACKER</Text>
      </View>      <View style={styles.summaryCard}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Thu nhập</Text>
            <Text style={[styles.balanceAmount, { color: '#16a34a' }]}>+${getTotalIncome().toFixed(2)}</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Chi tiêu</Text>
            <Text style={[styles.balanceAmount, { color: '#dc2626' }]}>-${getTotalExpense().toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.totalBalance}>
          <Text style={styles.totalLabel}>Số dư</Text>
          <Text style={[styles.totalAmount, { color: getTotalBalance() >= 0 ? '#16a34a' : '#dc2626' }]}>
            ${getTotalBalance().toFixed(2)}
          </Text>
        </View>
      </View>      <View style={styles.actionContainer}>
        {/* Nút Add theo yêu cầu câu b */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-transaction')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        
        {/* Quick add modal (giữ lại để có thể thêm nhanh) */}
        <TouchableOpacity 
          style={styles.quickAddButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="flash" size={20} color="#6366f1" />
          <Text style={styles.quickAddText}>Thêm nhanh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            <Text style={styles.emptySubtext}>Thêm giao dịch đầu tiên để bắt đầu</Text>
          </View>
        ) : (          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Thêm {transactionType === 'income' ? 'Thu nhập' : 'Chi tiêu'} nhanh
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Loại giao dịch</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity 
                  style={[styles.typeButton, transactionType === 'income' && styles.typeButtonActive]}
                  onPress={() => setTransactionType('income')}
                >
                  <Text style={[styles.typeButtonText, transactionType === 'income' && styles.typeButtonTextActive]}>
                    Thu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.typeButton, transactionType === 'expense' && styles.typeButtonActive]}
                  onPress={() => setTransactionType('expense')}
                >
                  <Text style={[styles.typeButtonText, transactionType === 'expense' && styles.typeButtonTextActive]}>
                    Chi
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tiêu đề</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề giao dịch"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Amount ($)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      category === cat && styles.categoryChipSelected
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Ionicons 
                      name={getCategoryIcon(cat)} 
                      size={16} 
                      color={category === cat ? 'white' : '#6366f1'} 
                    />
                    <Text style={[
                      styles.categoryText,
                      category === cat && styles.categoryTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>            <TouchableOpacity style={styles.saveButton} onPress={addTransaction}>
              <Text style={styles.saveButtonText}>
                Thêm {transactionType === 'income' ? 'Thu nhập' : 'Chi tiêu'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    letterSpacing: 1,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 14,
    color: '#94a3b8',
  },  actionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },addButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  quickAddButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickAddText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  balanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalBalance: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 16,
    width: '100%',
  },
  totalLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  typeSelector: {
    flexDirection: 'row',
    marginTop: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  typeButtonTextActive: {
    color: '#1e293b',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#64748b',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
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
    color: '#1e293b',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366f1',
    backgroundColor: 'white',
  },
  categoryChipSelected: {
    backgroundColor: '#6366f1',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
