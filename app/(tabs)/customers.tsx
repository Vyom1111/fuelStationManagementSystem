import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, 
  Plus, 
  Phone, 
  Calendar,
  Fuel,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function CustomersScreen() {
  const { user } = useAuth();
  const { customerDebits, addCustomerDebit } = useData();
  const [showAddDebit, setShowAddDebit] = useState(false);
  const [debitData, setDebitData] = useState({
    customerId: '',
    customerName: '',
    phone: '',
    fuelType: 'Petrol',
    quantity: '',
    rate: '',
    description: '',
  });

  const handleAddDebit = () => {
    if (!debitData.customerId || !debitData.customerName || !debitData.phone || 
        !debitData.quantity || !debitData.rate) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const quantity = parseFloat(debitData.quantity);
    const rate = parseFloat(debitData.rate);
    
    if (isNaN(quantity) || isNaN(rate) || quantity <= 0 || rate <= 0) {
      Alert.alert('Error', 'Please enter valid quantity and rate');
      return;
    }

    const amount = quantity * rate;

    addCustomerDebit({
      customerId: debitData.customerId,
      customerName: debitData.customerName,
      phone: debitData.phone,
      date: new Date().toISOString().split('T')[0],
      amount,
      description: debitData.description || `${debitData.fuelType} purchase`,
      fuelType: debitData.fuelType,
      quantity,
      rate,
      balance: amount, // For simplicity, assuming full amount is outstanding
    });

    setDebitData({
      customerId: '',
      customerName: '',
      phone: '',
      fuelType: 'Petrol',
      quantity: '',
      rate: '',
      description: '',
    });
    setShowAddDebit(false);
    Alert.alert('Success', 'Customer debit entry added successfully!');
  };

  // Group debits by customer
  const customerGroups = customerDebits.reduce((groups, debit) => {
    if (!groups[debit.customerId]) {
      groups[debit.customerId] = {
        customer: {
          id: debit.customerId,
          name: debit.customerName,
          phone: debit.phone,
        },
        debits: [],
        totalBalance: 0,
      };
    }
    groups[debit.customerId].debits.push(debit);
    groups[debit.customerId].totalBalance += debit.balance;
    return groups;
  }, {} as any);

  const customers = Object.values(customerGroups);
  const totalCustomers = customers.length;
  const totalOutstanding = customerDebits.reduce((sum, debit) => sum + debit.balance, 0);
  const avgDebitPerCustomer = totalCustomers > 0 ? totalOutstanding / totalCustomers : 0;

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Customer Management</Text>
          <Text style={styles.subtitle}>Manage customer debits and credits</Text>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Users size={24} color="#3b82f6" />
            <Text style={styles.summaryValue}>{totalCustomers}</Text>
            <Text style={styles.summaryLabel}>Total Customers</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <DollarSign size={24} color="#ef4444" />
            <Text style={styles.summaryValue}>₹{totalOutstanding.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Outstanding</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <TrendingUp size={24} color="#10b981" />
            <Text style={styles.summaryValue}>₹{avgDebitPerCustomer.toFixed(0)}</Text>
            <Text style={styles.summaryLabel}>Avg/Customer</Text>
          </View>
        </View>

        {(user?.role === 'owner' || user?.role === 'supervisor') && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddDebit(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Customer Debit</Text>
          </TouchableOpacity>
        )}

        <View style={styles.customersList}>
          <Text style={styles.sectionTitle}>Customer Accounts</Text>
          
          {customers.length === 0 ? (
            <View style={styles.emptyState}>
              <CreditCard size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>No customer records found</Text>
            </View>
          ) : (
            customers.map((customerGroup: any) => (
              <View key={customerGroup.customer.id} style={styles.customerCard}>
                <View style={styles.customerHeader}>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{customerGroup.customer.name}</Text>
                    <View style={styles.customerContact}>
                      <Phone size={14} color="#6b7280" />
                      <Text style={styles.customerPhone}>{customerGroup.customer.phone}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.balanceInfo}>
                    <Text style={styles.balanceAmount}>₹{customerGroup.totalBalance.toLocaleString()}</Text>
                    <Text style={styles.balanceLabel}>Outstanding</Text>
                  </View>
                </View>
                
                <View style={styles.customerStats}>
                  <Text style={styles.statsText}>
                    {customerGroup.debits.length} transactions • 
                    Last: {customerGroup.debits[customerGroup.debits.length - 1]?.date}
                  </Text>
                </View>
                
                <View style={styles.recentTransactions}>
                  <Text style={styles.transactionsTitle}>Recent Transactions</Text>
                  {customerGroup.debits.slice(-3).map((debit: any) => (
                    <View key={debit.id} style={styles.transactionRow}>
                      <View style={styles.transactionInfo}>
                        <View style={styles.transactionHeader}>
                          <Fuel size={14} color="#3b82f6" />
                          <Text style={styles.transactionType}>{debit.fuelType}</Text>
                          <Text style={styles.transactionQuantity}>{debit.quantity}L</Text>
                        </View>
                        <View style={styles.transactionDate}>
                          <Calendar size={12} color="#6b7280" />
                          <Text style={styles.transactionDateText}>{debit.date}</Text>
                        </View>
                      </View>
                      <Text style={styles.transactionAmount}>₹{debit.amount.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>

        <Modal
          visible={showAddDebit}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddDebit(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Customer Debit</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Customer ID"
                value={debitData.customerId}
                onChangeText={(text) => setDebitData(prev => ({ ...prev, customerId: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Customer Name"
                value={debitData.customerName}
                onChangeText={(text) => setDebitData(prev => ({ ...prev, customerName: text }))}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={debitData.phone}
                onChangeText={(text) => setDebitData(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />
              
              <View style={styles.fuelTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.fuelTypeButton,
                    debitData.fuelType === 'Petrol' && styles.fuelTypeButtonActive
                  ]}
                  onPress={() => setDebitData(prev => ({ ...prev, fuelType: 'Petrol' }))}
                >
                  <Text style={[
                    styles.fuelTypeText,
                    debitData.fuelType === 'Petrol' && styles.fuelTypeTextActive
                  ]}>
                    Petrol
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.fuelTypeButton,
                    debitData.fuelType === 'Diesel' && styles.fuelTypeButtonActive
                  ]}
                  onPress={() => setDebitData(prev => ({ ...prev, fuelType: 'Diesel' }))}
                >
                  <Text style={[
                    styles.fuelTypeText,
                    debitData.fuelType === 'Diesel' && styles.fuelTypeTextActive
                  ]}>
                    Diesel
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.quantityRateContainer}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Quantity (L)"
                  value={debitData.quantity}
                  onChangeText={(text) => setDebitData(prev => ({ ...prev, quantity: text }))}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Rate (₹/L)"
                  value={debitData.rate}
                  onChangeText={(text) => setDebitData(prev => ({ ...prev, rate: text }))}
                  keyboardType="numeric"
                />
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Description (Optional)"
                value={debitData.description}
                onChangeText={(text) => setDebitData(prev => ({ ...prev, description: text }))}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddDebit(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddDebit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    margin: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  customersList: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  customerCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  customerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  customerContact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  balanceInfo: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  customerStats: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  recentTransactions: {
    marginTop: 8,
  },
  transactionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  transactionType: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  transactionQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  transactionDateText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  fuelTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  fuelTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  fuelTypeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  fuelTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  fuelTypeTextActive: {
    color: '#ffffff',
  },
  quantityRateContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#1f2937',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});