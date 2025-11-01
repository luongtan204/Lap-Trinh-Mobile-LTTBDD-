import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Alert,
  Modal,
  Pressable,
  Dimensions,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { databaseService, Task } from '@/services/database';
import { syncService } from '@/services/syncService';

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
  const [category, setCategory] = useState('Food');  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [refreshing, setRefreshing] = useState(false);  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

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
  };  const loadTransactions = async () => {
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
    } finally {
      setRefreshing(false);
    }
  };
  // Pull to refresh function
  const onRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  // Quick sync function
  const quickSync = async () => {
    Alert.alert(
      'Đồng bộ nhanh',
      'Tải lên tất cả giao dịch lên API với URL mặc định?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng bộ',
          onPress: async () => {
            setRefreshing(true);
            try {
              const result = await syncService.syncToApi();
              if (result.success) {
                Alert.alert('Thành công', `Đã đồng bộ ${result.uploaded} giao dịch lên API`);
              } else {
                Alert.alert('Lỗi đồng bộ', result.error || 'Không thể đồng bộ. Vui lòng kiểm tra cài đặt đồng bộ.');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đồng bộ. Vui lòng kiểm tra cài đặt đồng bộ.');
            } finally {
              setRefreshing(false);
            }
          }
        }
      ]
    );
  };
  // Lọc transactions theo tìm kiếm và loại
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by type
    if (filterType === 'income' && transaction.type !== 'income') return false;
    if (filterType === 'expense' && transaction.type !== 'expense') return false;
    
    // Filter by search query
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      transaction.title.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query) ||
      (transaction.type === 'income' ? 'thu' : 'chi').includes(query)
    );
  });

  // Reload data when screen comes into focus - cập nhật lại danh sách theo yêu cầu câu c
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

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
  };  // Hiển thị context menu khi long press theo yêu cầu câu a
  const showContextMenu = (transaction: Transaction, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const menuWidth = 120;
    
    // Adjust position to keep menu within screen bounds
    let x = pageX;
    if (x + menuWidth > screenWidth) {
      x = screenWidth - menuWidth - 10;
    }
    
    setSelectedTransaction(transaction);
    setContextMenuPosition({ x, y: pageY });
    setContextMenuVisible(true);
  };

  const hideContextMenu = () => {
    setContextMenuVisible(false);
    setSelectedTransaction(null);
  };

  // Xác nhận xóa theo yêu cầu câu b
  const confirmDeleteTransaction = () => {
    if (!selectedTransaction) return;
    
    Alert.alert(
      'Xóa Giao Dịch',
      'Bạn có chắc chắn muốn xóa giao dịch này? Giao dịch sẽ được chuyển vào thùng rác.',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.deleteTransaction(selectedTransaction.id);
              await loadTransactions();
              hideContextMenu();
              Alert.alert('Thành công', 'Giao dịch đã được chuyển vào thùng rác');
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Lỗi', 'Không thể xóa giao dịch');
            }
          }
        }
      ]
    );
  };

  const deleteTransaction = (id: number) => {
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
    <Pressable 
      style={styles.transactionItem}
      onPress={() => router.push({
        pathname: '/edit-transaction/[id]',
        params: { id: item.id }
      })} // Điều hướng đến Edit Screen theo yêu cầu câu a
      onLongPress={(event) => showContextMenu(item, event)} // Long press để hiển thị menu xóa theo yêu cầu câu a
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
    </Pressable>
  );

  return (    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!isSearchActive ? (
          <>
            <Text style={styles.title}>EXPENSE TRACKER</Text>            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => setIsSearchActive(true)}
              >
                <Ionicons name="search" size={24} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.syncButton}
                onPress={() => router.push('./../../sync' as any)}
              >
                <Ionicons name="cloud" size={24} color="#6366f1" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.trashButton}
                onPress={() => router.push('./../../trash' as any)}
              >
                <Ionicons name="trash-outline" size={24} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.backSearchButton}
              onPress={() => {
                setIsSearchActive(false);
                setSearchQuery('');
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#6366f1" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm theo tên, danh mục, số tiền..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View><View style={styles.summaryCard}>
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
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Hiển thị:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text style={[
              styles.filterButtonText,
              filterType === 'all' && styles.filterButtonTextActive
            ]}>
              Tất cả
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.filterButtonIncome,
              filterType === 'income' && styles.filterButtonIncomeActive
            ]}
            onPress={() => setFilterType('income')}
          >
            <Ionicons 
              name="arrow-down" 
              size={16} 
              color={filterType === 'income' ? 'white' : '#16a34a'} 
            />
            <Text style={[
              styles.filterButtonText,
              styles.filterButtonTextIncome,
              filterType === 'income' && styles.filterButtonTextIncomeActive
            ]}>
              Thu
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.filterButtonExpense,
              filterType === 'expense' && styles.filterButtonExpenseActive
            ]}
            onPress={() => setFilterType('expense')}
          >
            <Ionicons 
              name="arrow-up" 
              size={16} 
              color={filterType === 'expense' ? 'white' : '#dc2626'} 
            />
            <Text style={[
              styles.filterButtonText,
              styles.filterButtonTextExpense,
              filterType === 'expense' && styles.filterButtonTextExpenseActive
            ]}>
              Chi
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {/* Nút Add theo yêu cầu câu b */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-transaction')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
        
        {/* Quick sync button */}
        <TouchableOpacity 
          style={styles.quickSyncButton}
          onPress={quickSync}
        >
          <Ionicons name="cloud-upload" size={20} color="#10b981" />
          <Text style={styles.quickSyncText}>Sync</Text>
        </TouchableOpacity>
        
        {/* Quick add modal (giữ lại để có thể thêm nhanh) */}
        <TouchableOpacity 
          style={styles.quickAddButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="flash" size={20} color="#6366f1" />
          <Text style={styles.quickAddText}>Nhanh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isSearchActive && searchQuery ? `Kết quả tìm kiếm (${filteredTransactions.length})` : 'Giao dịch gần đây'}
          </Text>
          {searchQuery && (
            <Text style={styles.searchResultText}>
              Tìm kiếm: "{searchQuery}"
            </Text>
          )}
        </View>
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Chưa có giao dịch nào</Text>
            <Text style={styles.emptySubtext}>Thêm giao dịch đầu tiên để bắt đầu</Text>
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptySubtext}>Thử tìm kiếm với từ khóa khác</Text>
          </View>        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6366f1']}
                tintColor="#6366f1"
              />
            }
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
            </TouchableOpacity>          </View>
        </View>
      </Modal>

      {/* Context Menu Modal cho Long Press */}
      <Modal
        transparent={true}
        visible={contextMenuVisible}
        animationType="none"
        onRequestClose={hideContextMenu}
      >
        <TouchableOpacity 
          style={styles.contextMenuOverlay}
          activeOpacity={1}
          onPress={hideContextMenu}
        >
          <View 
            style={[
              styles.contextMenu,
              { 
                left: contextMenuPosition.x, 
                top: contextMenuPosition.y - 100 
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.contextMenuItem}
              onPress={() => {
                hideContextMenu();
                if (selectedTransaction) {
                  router.push({
                    pathname: '/edit-transaction/[id]',
                    params: { id: selectedTransaction.id }
                  });
                }
              }}
            >
              <Ionicons name="create-outline" size={20} color="#6366f1" />
              <Text style={styles.contextMenuText}>Sửa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contextMenuItem, styles.contextMenuItemDanger]}
              onPress={confirmDeleteTransaction}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text style={[styles.contextMenuText, styles.contextMenuTextDanger]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },  trashButton: {
    padding: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  syncButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backSearchButton: {
    padding: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 8,
    marginLeft: 8,
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
  },  addButton: {
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
    marginHorizontal: 4,
  },
  quickAddButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6366f1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 4,
  },quickAddText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quickSyncButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 4,
  },
  quickSyncText: {
    color: '#10b981',
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
  },  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  searchResultText: {
    fontSize: 14,
    color: '#6366f1',
    fontStyle: 'italic',
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
  },  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Context Menu Styles
  contextMenuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contextMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 12,
    minWidth: 120,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  contextMenuItemDanger: {
    borderBottomWidth: 0,
  },
  contextMenuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 12,
  },
  contextMenuTextDanger: {
    color: '#ef4444',
  },
  // Filter Section Styles
  filterContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  filterButtonActive: {
    backgroundColor: '#f3f4f6',
    borderColor: '#6b7280',
  },
  filterButtonIncome: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  filterButtonIncomeActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  filterButtonExpense: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  filterButtonExpenseActive: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: '#1f2937',
    fontWeight: '600',
  },
  filterButtonTextIncome: {
    color: '#16a34a',
  },
  filterButtonTextIncomeActive: {
    color: 'white',
  },
  filterButtonTextExpense: {
    color: '#dc2626',
  },
  filterButtonTextExpenseActive: {
    color: 'white',
  },
});
