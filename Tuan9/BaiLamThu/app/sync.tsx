import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { syncService } from '@/services/syncService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SyncScreen() {
  const [apiUrl, setApiUrl] = useState('');
  const [isLoading, setSyncing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('sync_api_url');
      const savedLastSync = await AsyncStorage.getItem('last_sync_time');
      
      if (savedUrl) {
        setApiUrl(savedUrl);
        syncService.setApiUrl(savedUrl);
      } else {
        // Use default URL
        setApiUrl(syncService.getApiUrl());
      }
      
      if (savedLastSync) {
        setLastSyncTime(savedLastSync);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('sync_api_url', apiUrl);
      syncService.setApiUrl(apiUrl);
      Alert.alert('Thành công', 'Đã lưu cài đặt API URL');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Lỗi', 'Không thể lưu cài đặt');
    }
  };

  const testConnection = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL API');
      return;
    }

    setSyncing(true);
    try {
      syncService.setApiUrl(apiUrl.trim());
      const isConnected = await syncService.testConnection();
      
      if (isConnected) {
        setConnectionStatus('connected');
        Alert.alert('Thành công', 'Kết nối API thành công!');
        await AsyncStorage.setItem('sync_api_url', apiUrl.trim());
      } else {
        setConnectionStatus('disconnected');
        Alert.alert('Lỗi', 'Không thể kết nối tới API. Vui lòng kiểm tra URL và thử lại.');
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      Alert.alert('Lỗi', 'Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Không xác định'));
    } finally {
      setSyncing(false);
    }
  };

  const performSync = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập và kiểm tra URL API trước');
      return;
    }

    Alert.alert(
      'Xác nhận đồng bộ',
      'Thao tác này sẽ xóa toàn bộ dữ liệu trên API và tải lên tất cả giao dịch từ thiết bị. Bạn có chắc chắn muốn tiếp tục?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng bộ',
          onPress: async () => {
            setSyncing(true);
            try {
              syncService.setApiUrl(apiUrl.trim());
              const result = await syncService.syncToApi();

              if (result.success) {
                const now = new Date().toLocaleString('vi-VN');
                setLastSyncTime(now);
                await AsyncStorage.setItem('last_sync_time', now);
                
                Alert.alert(
                  'Đồng bộ thành công!',
                  `Đã tải lên ${result.uploaded} giao dịch lên API.\n\nThời gian: ${now}`
                );
              } else {
                Alert.alert('Đồng bộ thất bại', result.error || 'Lỗi không xác định');
              }
            } catch (error) {
              Alert.alert('Lỗi đồng bộ', error instanceof Error ? error.message : 'Lỗi không xác định');
            } finally {
              setSyncing(false);
            }
          }
        }
      ]
    );
  };

  const downloadFromApi = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập và kiểm tra URL API trước');
      return;
    }

    Alert.alert(
      'Xác nhận tải xuống',
      'Thao tác này sẽ xóa toàn bộ dữ liệu cục bộ và thay thế bằng dữ liệu từ API. Bạn có chắc chắn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Tải xuống',
          style: 'destructive',
          onPress: async () => {
            setSyncing(true);
            try {
              syncService.setApiUrl(apiUrl.trim());
              const result = await syncService.syncFromApi();

              if (result.success) {
                const now = new Date().toLocaleString('vi-VN');
                setLastSyncTime(now);
                await AsyncStorage.setItem('last_sync_time', now);
                
                Alert.alert(
                  'Tải xuống thành công!',
                  `Đã tải xuống ${result.downloaded} giao dịch từ API.\n\nThời gian: ${now}`
                );
              } else {
                Alert.alert('Tải xuống thất bại', result.error || 'Lỗi không xác định');
              }
            } catch (error) {
              Alert.alert('Lỗi tải xuống', error instanceof Error ? error.message : 'Lỗi không xác định');
            } finally {
              setSyncing(false);
            }
          }
        }
      ]
    );
  };

  const resetToDefault = () => {
    const defaultUrl = 'https://67ff3c6458f18d7209f06c43.mockapi.io/chitieu';
    setApiUrl(defaultUrl);
    syncService.setApiUrl(defaultUrl);
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Ionicons name="checkmark-circle" size={20} color="#10b981" />;
      case 'disconnected':
        return <Ionicons name="close-circle" size={20} color="#ef4444" />;
      default:
        return <Ionicons name="help-circle" size={20} color="#6b7280" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Đã kết nối';
      case 'disconnected':
        return 'Không kết nối';
      default:
        return 'Chưa kiểm tra';
    }
  };

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
        <Text style={styles.headerTitle}>Đồng Bộ Dữ Liệu</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* API URL Configuration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cấu Hình API</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>URL API MockAPI.io</Text>
            <TextInput
              style={styles.input}
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="https://your-mockapi-url.mockapi.io/chitieu"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={resetToDefault}
              disabled={isLoading}
            >
              <Ionicons name="refresh" size={16} color="#6366f1" />
              <Text style={styles.secondaryButtonText}>Mặc định</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={saveSettings}
              disabled={isLoading}
            >
              <Ionicons name="save" size={16} color="#6366f1" />
              <Text style={styles.secondaryButtonText}>Lưu</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.testButton}
            onPress={testConnection}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="wifi" size={20} color="white" />
            )}
            <Text style={styles.testButtonText}>Kiểm Tra Kết Nối</Text>
          </TouchableOpacity>

          {/* Connection Status */}
          <View style={styles.statusContainer}>
            {getConnectionStatusIcon()}
            <Text style={styles.statusText}>{getConnectionStatusText()}</Text>
          </View>
        </View>

        {/* Sync Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thao Tác Đồng Bộ</Text>

          <TouchableOpacity
            style={styles.syncButton}
            onPress={performSync}
            disabled={isLoading || connectionStatus !== 'connected'}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="cloud-upload" size={24} color="white" />
            )}
            <Text style={styles.syncButtonText}>Đồng Bộ Lên API</Text>
          </TouchableOpacity>

          <Text style={styles.syncDescription}>
            Xóa toàn bộ dữ liệu trên API và tải lên tất cả giao dịch từ thiết bị
          </Text>

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={downloadFromApi}
            disabled={isLoading || connectionStatus !== 'connected'}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="cloud-download" size={24} color="white" />
            )}
            <Text style={styles.downloadButtonText}>Tải Từ API</Text>
          </TouchableOpacity>

          <Text style={styles.syncDescription}>
            Xóa dữ liệu cục bộ và thay thế bằng dữ liệu từ API
          </Text>
        </View>

        {/* Sync Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng Thái</Text>
          
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Ionicons name="time" size={16} color="#6b7280" />
              <Text style={styles.statusLabel}>Lần đồng bộ cuối:</Text>
            </View>
            <Text style={styles.statusValue}>
              {lastSyncTime || 'Chưa đồng bộ'}
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hướng Dẫn</Text>
          
          <View style={styles.instructionCard}>
            <Text style={styles.instructionTitle}>Cách tạo API MockAPI.io:</Text>
            <Text style={styles.instructionText}>
              1. Truy cập mockapi.io{'\n'}
              2. Tạo project mới{'\n'}
              3. Tạo resource với tên "chitieu"{'\n'}
              4. Sao chép URL và dán vào ô trên{'\n'}
              5. Nhấn "Kiểm Tra Kết Nối"{'\n'}
              6. Nhấn "Đồng Bộ Lên API" để upload dữ liệu
            </Text>
          </View>
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
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
    backgroundColor: 'white',
    color: '#1e293b',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
    marginLeft: 6,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    marginBottom: 12,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    marginBottom: 8,
  },
  syncButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    marginBottom: 8,
    marginTop: 12,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  syncDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  instructionCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});
