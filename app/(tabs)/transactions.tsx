import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  FileText, 
  Calendar,
  Fuel,
  DollarSign,
  Download,
  Filter
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function TransactionsScreen() {
  const { user } = useAuth();
  const { customerDebits, getTotalCustomerBalance } = useData();

  // Filter transactions for current customer
  const myTransactions = customerDebits.filter(d => d.customerId === user?.customerId);
  const totalBalance = getTotalCustomerBalance(user?.customerId || '');

  // Group transactions by month
  const transactionsByMonth = myTransactions.reduce((groups, transaction) => {
    const month = transaction.date.slice(0, 7); // YYYY-MM
    if (!groups[month]) {
      groups[month] = [];
    }
    groups[month].push(transaction);
    return groups;
  }, {} as any);

  const months = Object.keys(transactionsByMonth).sort().reverse();

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Transaction History</Text>
          <Text style={styles.subtitle}>Your fuel purchase records</Text>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Current Outstanding</Text>
            <Text style={styles.balanceAmount}>₹{totalBalance.toLocaleString()}</Text>
          </View>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Download size={16} color="#3b82f6" />
            <Text style={styles.downloadButtonText}>Download Statement</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <FileText size={20} color="#3b82f6" />
            <Text style={styles.summaryValue}>{myTransactions.length}</Text>
            <Text style={styles.summaryLabel}>Total Transactions</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <DollarSign size={20} color="#10b981" />
            <Text style={styles.summaryValue}>
              ₹{myTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Total Amount</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Fuel size={20} color="#f59e0b" />
            <Text style={styles.summaryValue}>
              {myTransactions.reduce((sum, t) => sum + t.quantity, 0).toFixed(1)}L
            </Text>
            <Text style={styles.summaryLabel}>Total Fuel</Text>
          </View>
        </View>

        <View style={styles.filterSection}>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#6b7280" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsSection}>
          {months.length === 0 ? (
            <View style={styles.emptyState}>
              <FileText size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                Your fuel purchase history will appear here
              </Text>
            </View>
          ) : (
            months.map(month => (
              <View key={month} style={styles.monthSection}>
                <View style={styles.monthHeader}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.monthTitle}>
                    {new Date(month + '-01').toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </Text>
                  <Text style={styles.monthTotal}>
                    ₹{transactionsByMonth[month].reduce((sum: number, t: any) => sum + t.amount, 0).toLocaleString()}
                  </Text>
                </View>
                
                {transactionsByMonth[month].map((transaction: any) => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <View style={styles.fuelInfo}>
                        <Fuel size={16} color="#3b82f6" />
                        <Text style={styles.fuelType}>{transaction.fuelType}</Text>
                        <Text style={styles.fuelQuantity}>{transaction.quantity}L</Text>
                      </View>
                      
                      <Text style={styles.transactionAmount}>
                        ₹{transaction.amount.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    
                    <View style={styles.transactionFooter}>
                      <Text style={styles.rateInfo}>
                        Rate: ₹{transaction.rate}/L
                      </Text>
                      <Text style={styles.balanceInfo}>
                        Balance: ₹{transaction.balance.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  balanceCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  downloadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  transactionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9ca3af',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  monthSection: {
    marginBottom: 24,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  monthTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  transactionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fuelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fuelType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  fuelQuantity: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  transactionDetails: {
    marginBottom: 8,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  rateInfo: {
    fontSize: 12,
    color: '#6b7280',
  },
  balanceInfo: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
});