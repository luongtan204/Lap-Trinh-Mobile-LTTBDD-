import { Alert } from 'react-native';
import { databaseService, Task } from './database';

export interface ApiTransaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  createdAt: string;
  isDeleted: number;
  deletedAt?: string;
}

export class SyncService {
  private defaultApiUrl = 'https://67ff3c6458f18d7209f06c43.mockapi.io/chitieu';
  
  constructor(private apiUrl: string = '') {
    this.apiUrl = apiUrl || this.defaultApiUrl;
  }

  // Set custom API URL
  setApiUrl(url: string) {
    this.apiUrl = url;
  }

  // Get current API URL
  getApiUrl(): string {
    return this.apiUrl;
  }

  // Validate API URL format
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.isValidUrl(this.apiUrl)) {
        throw new Error('URL không hợp lệ');
      }

      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Get all data from API
  async getAllApiData(): Promise<ApiTransaction[]> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching API data:', error);
      throw new Error('Không thể lấy dữ liệu từ API');
    }
  }

  // Delete all data from API
  async clearAllApiData(): Promise<void> {
    try {
      // First, get all existing data
      const existingData = await this.getAllApiData();
      
      // Delete each item individually
      const deletePromises = existingData.map(async (item) => {
        if (item.id) {
          const deleteResponse = await fetch(`${this.apiUrl}/${item.id}`, {
            method: 'DELETE',
          });
          if (!deleteResponse.ok) {
            throw new Error(`Failed to delete item ${item.id}`);
          }
        }
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error clearing API data:', error);
      throw new Error('Không thể xóa dữ liệu API');
    }
  }

  // Upload single transaction to API
  async uploadTransaction(transaction: Task): Promise<ApiTransaction> {
    try {
      const apiTransaction: ApiTransaction = {
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        createdAt: transaction.createdAt,
        isDeleted: transaction.isDeleted,
        deletedAt: transaction.deletedAt,
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTransaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading transaction:', error);
      throw new Error('Không thể tải lên giao dịch');
    }
  }

  // Upload all local transactions to API
  async uploadAllTransactions(): Promise<void> {
    try {
      // Get all transactions from local database (both active and deleted)
      await databaseService.initDatabase();
      
      // Get all transactions including deleted ones
      const allTransactions = await this.getAllLocalTransactions();
      
      if (allTransactions.length === 0) {
        throw new Error('Không có dữ liệu để đồng bộ');
      }

      // Upload each transaction
      const uploadPromises = allTransactions.map(transaction => 
        this.uploadTransaction(transaction)
      );

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading all transactions:', error);
      throw error;
    }
  }

  // Get all local transactions (active + deleted)
  private async getAllLocalTransactions(): Promise<Task[]> {
    try {
      const db = (databaseService as any).db;
      if (!db) throw new Error('Database not initialized');

      const selectQuery = 'SELECT * FROM transactions ORDER BY createdAt DESC';
      const result = await db.getAllAsync(selectQuery);
      
      return result as Task[];
    } catch (error) {
      console.error('Error getting all local transactions:', error);
      throw new Error('Không thể lấy dữ liệu cục bộ');
    }
  }

  // Main sync function - Clear API and upload all local data
  async syncToApi(): Promise<{ success: boolean; uploaded: number; error?: string }> {
    try {
      // Test connection first
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Không thể kết nối tới API. Vui lòng kiểm tra URL và kết nối mạng.');
      }

      // Get local data count
      const localTransactions = await this.getAllLocalTransactions();
      const transactionCount = localTransactions.length;

      if (transactionCount === 0) {
        throw new Error('Không có dữ liệu để đồng bộ');
      }

      // Step 1: Clear all API data
      await this.clearAllApiData();

      // Step 2: Upload all local transactions
      await this.uploadAllTransactions();

      return {
        success: true,
        uploaded: transactionCount,
      };
    } catch (error) {
      console.error('Sync error:', error);
      return {
        success: false,
        uploaded: 0,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
    }
  }

  // Download data from API and replace local data
  async syncFromApi(): Promise<{ success: boolean; downloaded: number; error?: string }> {
    try {
      // Test connection first
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('Không thể kết nối tới API');
      }

      // Get data from API
      const apiData = await this.getAllApiData();

      if (apiData.length === 0) {
        throw new Error('API không có dữ liệu');
      }

      // Clear local database
      await this.clearLocalData();

      // Import API data to local database
      for (const apiTransaction of apiData) {
        await databaseService.addTransaction(
          apiTransaction.title,
          apiTransaction.amount,
          apiTransaction.category,
          apiTransaction.type
        );
      }

      return {
        success: true,
        downloaded: apiData.length,
      };
    } catch (error) {
      console.error('Download sync error:', error);
      return {
        success: false,
        downloaded: 0,
        error: error instanceof Error ? error.message : 'Lỗi không xác định',
      };
    }
  }

  // Clear all local data
  private async clearLocalData(): Promise<void> {
    try {
      const db = (databaseService as any).db;
      if (!db) throw new Error('Database not initialized');

      await db.execAsync('DELETE FROM transactions');
    } catch (error) {
      console.error('Error clearing local data:', error);
      throw new Error('Không thể xóa dữ liệu cục bộ');
    }
  }
}

// Export singleton instance
export const syncService = new SyncService();
