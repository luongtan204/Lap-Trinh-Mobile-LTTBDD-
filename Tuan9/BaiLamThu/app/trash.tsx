import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { databaseService, Task } from '@/services/database';

interface DeletedTransaction extends Task {
  deletedAt?: string;
}

export default function TrashScreen() {  const [deletedTransactions, setDeletedTransactions] = useState<DeletedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedTransaction, setSelectedTransaction] = useState<DeletedTransaction | null>(null);

  useEffect(() => {
    loadDeletedTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDeletedTransactions();
    }, [])
  );  const loadDeletedTransactions = async () => {
    try {
      await databaseService.initDatabase();
      const deleted = await databaseService.getDeletedTransactions();
      
      // Ensure deleted is an array
      const deletedArray = Array.isArray(deleted) ? deleted : [];
      
      // Filter and validate deleted transactions
      const validDeletedTransactions = deletedArray
        .filter(item => item && typeof item === 'object' && item.isDeleted === 1 && typeof item.id !== 'undefined')
        .map(item => ({
          ...item,
          title: String(item.title || 'Untitled Transaction'),
          amount: typeof item.amount === 'number' ? item.amount : 0,
          category: String(item.category || 'Others'),
          type: (item.type === 'income' || item.type === 'expense') ? item.type : 'expense',
          createdAt: item.createdAt || new Date().toISOString(),
          deletedAt: item.deletedAt || new Date().toISOString()
        })) as DeletedTransaction[];
        
      setDeletedTransactions(validDeletedTransactions);
    } catch (error) {
      console.error('Error loading deleted transactions:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách giao dịch đã xóa');
      setDeletedTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    loadDeletedTransactions();
  };
  // Lọc deleted transactions theo tìm kiếm với error handling
  const filteredDeletedTransactions = deletedTransactions.filter(transaction => {
    try {
      if (!transaction || typeof transaction !== 'object') return false;
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const title = String(transaction.title || '').toLowerCase();
      const category = String(transaction.category || '').toLowerCase();
      const amount = String(transaction.amount || '0');
      const type = transaction.type === 'income' ? 'thu' : 'chi';
      
      return (
        title.includes(query) ||
        category.includes(query) ||
        amount.includes(query) ||
        type.includes(query)
      );
    } catch (error) {
      console.error('Error filtering transaction:', error);
      return false;
    }
  });

  const restoreTransaction = (id: number) => {
    Alert.alert(
      'Khôi phục Giao Dịch',
      'Bạn có muốn khôi phục giao dịch này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục',
          onPress: async () => {
            try {
              await databaseService.restoreTransaction(id);
              await loadDeletedTransactions();
              Alert.alert('Thành công', 'Giao dịch đã được khôi phục');
            } catch (error) {
              console.error('Error restoring transaction:', error);
              Alert.alert('Lỗi', 'Không thể khôi phục giao dịch');
            }
          },
        },
      ]
    );
  };

  const permanentDeleteTransaction = (id: number, title: string) => {
    Alert.alert(
      'Xóa Vĩnh Viễn',
      `Bạn có chắc chắn muốn xóa vĩnh viễn giao dịch "${title}"? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa Vĩnh Viễn',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.permanentDeleteTransaction(id);
              await loadDeletedTransactions();
              Alert.alert('Thành công', 'Giao dịch đã được xóa vĩnh viễn');
            } catch (error) {
              console.error('Error permanently deleting transaction:', error);
              Alert.alert('Lỗi', 'Không thể xóa vĩnh viễn giao dịch');
            }
          },
        },
      ]
    );
  };
  const clearAllTrash = () => {
    Alert.alert(
      'Xóa Tất Cả',
      `Bạn có chắc chắn muốn xóa vĩnh viễn tất cả ${deletedTransactions.length} giao dịch trong thùng rác? Hành động này không thể hoàn tác.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa Tất Cả',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const transaction of deletedTransactions) {
                await databaseService.permanentDeleteTransaction(transaction.id);
              }
              await loadDeletedTransactions();
              Alert.alert('Thành công', 'Đã xóa vĩnh viễn tất cả giao dịch');
            } catch (error) {
              console.error('Error clearing all trash:', error);
              Alert.alert('Lỗi', 'Không thể xóa tất cả giao dịch');
            }
          },
        },
      ]
    );
  };

  // Context menu functions for long press
  const showContextMenu = (transaction: DeletedTransaction, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const menuWidth = 150;
    
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

  const handleRestoreFromMenu = () => {
    if (selectedTransaction) {
      restoreTransaction(selectedTransaction.id);
      hideContextMenu();
    }
  };

  const handlePermanentDeleteFromMenu = () => {
    if (selectedTransaction) {
      permanentDeleteTransaction(selectedTransaction.id, selectedTransaction.title);
      hideContextMenu();
    }
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
  };  const renderDeletedItem = ({ item }: { item: DeletedTransaction }) => {
    // Ensure all required fields have valid values
    if (!item || typeof item.id === 'undefined') {
      return null;
    }

    const safeTitle = item.title || 'Untitled Transaction';
    const safeCategory = item.category || 'Others';
    const safeAmount = typeof item.amount === 'number' ? item.amount : 0;
    const safeType = item.type === 'income' ? 'income' : 'expense';
    const safeCreatedAt = item.createdAt || new Date().toISOString();
    const safeDeletedAt = item.deletedAt || new Date().toISOString();

    return (
      <Pressable 
        style={styles.deletedItem}
        onLongPress={(event) => showContextMenu(item, event)}
        android_ripple={{ color: '#f1f5f9' }}
      >
        <View style={styles.deletedItemContent}>
          <View style={[styles.transactionIcon, { backgroundColor: safeType === 'income' ? '#dcfce7' : '#fee2e2', opacity: 0.7 }]}>
            <Ionicons 
              name={safeType === 'income' ? 'arrow-down' : 'arrow-up'} 
              size={20} 
              color={safeType === 'income' ? '#16a34a' : '#dc2626'} 
            />
          </View>
          <View style={styles.deletedItemDetails}>
            <Text style={styles.deletedItemTitle}>{safeTitle}</Text>
            <Text style={styles.deletedItemInfo}>
              {safeCategory} • {new Date(safeCreatedAt).toLocaleDateString('vi-VN')} • {safeType === 'income' ? 'Thu' : 'Chi'}
            </Text>
            <Text style={styles.deletedDate}>
              Đã xóa: {new Date(safeDeletedAt).toLocaleDateString('vi-VN')} lúc {new Date(safeDeletedAt).toLocaleTimeString('vi-VN')}
            </Text>
          </View>
          <Text style={[
            styles.deletedItemAmount, 
            { color: safeType === 'income' ? '#16a34a' : '#dc2626' }
          ]}>
            {safeType === 'income' ? '+' : '-'}${safeAmount.toFixed(2)}
          </Text>        </View>
        
        <View style={styles.deletedItemActions}>
          <TouchableOpacity 
            style={styles.restoreButton}
            onPress={() => restoreTransaction(item.id)}
          >
            <Ionicons name="refresh" size={16} color="#10b981" />
            <Text style={styles.restoreButtonText}>Khôi phục</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.permanentDeleteButton}
            onPress={() => permanentDeleteTransaction(item.id, safeTitle)}
          >
            <Ionicons name="trash" size={16} color="#ef4444" />
            <Text style={styles.permanentDeleteButtonText}>Xóa vĩnh viễn</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>      {/* Header */}
      <View style={styles.header}>
        {!isSearchActive ? (
          <>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Thùng Rác</Text>
            <View style={styles.headerActions}>
              {deletedTransactions.length > 0 && (
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => setIsSearchActive(true)}
                >
                  <Ionicons name="search" size={24} color="#6366f1" />
                </TouchableOpacity>
              )}
              {deletedTransactions.length > 0 && (
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={clearAllTrash}
                >
                  <Ionicons name="trash" size={20} color="#ef4444" />
                </TouchableOpacity>
              )}
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
              placeholder="Tìm kiếm trong thùng rác..."
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
      </View>      {/* Content */}
      <View style={styles.content}>
        {deletedTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trash-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Thùng rác trống</Text>
            <Text style={styles.emptySubtext}>
              Các giao dịch đã xóa sẽ xuất hiện ở đây
            </Text>
          </View>
        ) : filteredDeletedTransactions.length === 0 && isSearchActive && searchQuery.trim() ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptySubtext}>
              Thử tìm kiếm với từ khóa khác trong thùng rác
            </Text>
          </View>
        ) : (
          <>            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={styles.infoText}>
                {isSearchActive && searchQuery.trim() 
                  ? `${filteredDeletedTransactions.length}/${deletedTransactions.length} giao dịch phù hợp`
                  : `${deletedTransactions.length} giao dịch đã xóa`
                }. Bạn có thể khôi phục hoặc xóa vĩnh viễn.
              </Text>
            </View>
              {/* Search Results Info */}
            {isSearchActive && searchQuery.trim() && (
              <View style={styles.searchResultsInfo}>
                <Text style={styles.searchResultsText}>
                  {filteredDeletedTransactions.length === 0 
                    ? 'Không tìm thấy kết quả nào'
                    : `Tìm thấy ${filteredDeletedTransactions.length} kết quả`
                  }
                </Text>
              </View>
            )}
            
            <FlatList
              data={filteredDeletedTransactions}
              renderItem={renderDeletedItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#6366f1']}
                />
              }
              ListEmptyComponent={
                isSearchActive && searchQuery.trim() ? (
                  <View style={styles.noResultsContainer}>
                    <Ionicons name="search-outline" size={48} color="#d1d5db" />
                    <Text style={styles.noResultsText}>Không tìm thấy kết quả</Text>
                    <Text style={styles.noResultsSubtext}>
                      Thử tìm kiếm với từ khóa khác
                    </Text>
                  </View>
                ) : null
              }
            />          </>
        )}
      </View>

      {/* Context Menu Modal for Long Press */}
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
                top: contextMenuPosition.y - 120 
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.contextMenuItem}
              onPress={handleRestoreFromMenu}
            >
              <Ionicons name="refresh" size={20} color="#10b981" />
              <Text style={styles.contextMenuText}>Khôi phục</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contextMenuItem, styles.contextMenuItemDanger]}
              onPress={handlePermanentDeleteFromMenu}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
              <Text style={[styles.contextMenuText, styles.contextMenuTextDanger]}>Xóa vĩnh viễn</Text>
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
    marginHorizontal: 16,
  },
  clearAllButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 12,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  deletedItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  deletedItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deletedItemDetails: {
    flex: 1,
  },
  deletedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  deletedItemInfo: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  deletedDate: {
    fontSize: 11,
    color: '#ef4444',
    fontStyle: 'italic',
  },
  deletedItemAmount: {
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.7,
  },
  deletedItemActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  restoreButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
    marginLeft: 6,
  },
  permanentDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },  permanentDeleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: 8,
  },
  backSearchButton: {
    padding: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1e293b',
    paddingHorizontal: 8,
  },
  clearSearchButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchResultsInfo: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
  },
  searchResultsText: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
  },  noResultsSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
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
    minWidth: 150,
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
});
