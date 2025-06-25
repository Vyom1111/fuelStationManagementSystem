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
  DollarSign, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  User,
  CreditCard,
  FileText
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function SalaryScreen() {
  const { user } = useAuth();
  const { salaries, advances, addAdvance } = useData();
  const [showAdvanceRequest, setShowAdvanceRequest] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('');

  const handleAdvanceRequest = () => {
    if (!advanceAmount || !advanceReason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const amount = parseFloat(advanceAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addAdvance({
      employeeId: user?.employeeId || '',
      employeeName: user?.name || '',
      date: new Date().toISOString().split('T')[0],
      amount,
      reason: advanceReason,
      status: 'pending',
    });

    setAdvanceAmount('');
    setAdvanceReason('');
    setShowAdvanceRequest(false);
    Alert.alert('Success', 'Advance request submitted successfully!');
  };

  const renderDSMView = () => {
    const mySalary = salaries.find(s => s.employeeId === user?.employeeId);
    const myAdvances = advances.filter(a => a.employeeId === user?.employeeId);
    const totalAdvances = myAdvances.reduce((sum, a) => sum + a.amount, 0);

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>My Salary</Text>
            <Text style={styles.subtitle}>View your earnings and advances</Text>
          </View>

          {mySalary && (
            <View style={styles.salaryCard}>
              <View style={styles.salaryHeader}>
                <DollarSign size={24} color="#ffffff" />
                <Text style={styles.salaryMonth}>{mySalary.month}</Text>
              </View>
              
              <View style={styles.salaryDetails}>
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>Daily Wage</Text>
                  <Text style={styles.salaryValue}>₹{mySalary.dailyWage}</Text>
                </View>
                
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>Present Days</Text>
                  <Text style={styles.salaryValue}>{mySalary.presentDays}</Text>
                </View>
                
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>Total Earnings</Text>
                  <Text style={styles.salaryValue}>₹{mySalary.totalEarnings}</Text>
                </View>
                
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>Advances</Text>
                  <Text style={[styles.salaryValue, styles.negativeValue]}>-₹{mySalary.advances}</Text>
                </View>
                
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryLabel}>Losses</Text>
                  <Text style={[styles.salaryValue, styles.negativeValue]}>-₹{mySalary.losses}</Text>
                </View>
                
                <View style={[styles.salaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Net Pay</Text>
                  <Text style={styles.totalValue}>₹{mySalary.netPay}</Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => setShowAdvanceRequest(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.requestButtonText}>Request Advance</Text>
          </TouchableOpacity>

          <View style={styles.advancesSection}>
            <Text style={styles.sectionTitle}>My Advances</Text>
            
            {myAdvances.length === 0 ? (
              <View style={styles.emptyState}>
                <CreditCard size={48} color="#9ca3af" />
                <Text style={styles.emptyStateText}>No advances taken</Text>
              </View>
            ) : (
              myAdvances.map(advance => (
                <View key={advance.id} style={styles.advanceCard}>
                  <View style={styles.advanceInfo}>
                    <Text style={styles.advanceAmount}>₹{advance.amount}</Text>
                    <Text style={styles.advanceDate}>{advance.date}</Text>
                  </View>
                  <View style={styles.advanceDetails}>
                    <Text style={styles.advanceReason}>{advance.reason}</Text>
                    <View style={[
                      styles.statusBadge,
                      advance.status === 'approved' ? styles.approvedBadge :
                      advance.status === 'rejected' ? styles.rejectedBadge :
                      styles.pendingBadge
                    ]}>
                      <Text style={[
                        styles.statusText,
                        advance.status === 'approved' ? styles.approvedText :
                        advance.status === 'rejected' ? styles.rejectedText :
                        styles.pendingText
                      ]}>
                        {advance.status.charAt(0).toUpperCase() + advance.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <Modal
            visible={showAdvanceRequest}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAdvanceRequest(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Request Advance</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  value={advanceAmount}
                  onChangeText={setAdvanceAmount}
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Reason for advance"
                  value={advanceReason}
                  onChangeText={setAdvanceReason}
                  multiline
                  numberOfLines={4}
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAdvanceRequest(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAdvanceRequest}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    );
  };

  const renderOwnerView = () => {
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>Salary Management</Text>
            <Text style={styles.subtitle}>Manage employee salaries</Text>
          </View>

          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <TrendingUp size={24} color="#10b981" />
              <Text style={styles.summaryValue}>
                ₹{salaries.reduce((sum, s) => sum + s.totalEarnings, 0).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Total Earnings</Text>
            </View>
            
            <View style={styles.summaryCard}>
              <TrendingDown size={24} color="#ef4444" />
              <Text style={styles.summaryValue}>
                ₹{salaries.reduce((sum, s) => sum + s.advances + s.losses, 0).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Deductions</Text>
            </View>
          </View>

          <View style={styles.employeeList}>
            <Text style={styles.sectionTitle}>Employee Salaries</Text>
            
            {salaries.map(salary => (
              <View key={salary.id} style={styles.employeeCard}>
                <View style={styles.employeeHeader}>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{salary.employeeName}</Text>
                    <Text style={styles.employeeId}>ID: {salary.employeeId}</Text>
                  </View>
                  <View style={styles.salaryAmount}>
                    <Text style={styles.netPay}>₹{salary.netPay}</Text>
                    <Text style={styles.netPayLabel}>Net Pay</Text>
                  </View>
                </View>
                
                <View style={styles.salaryBreakdown}>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>Days: {salary.presentDays}</Text>
                    <Text style={styles.breakdownLabel}>Rate: ₹{salary.dailyWage}</Text>
                    <Text style={styles.breakdownLabel}>Gross: ₹{salary.totalEarnings}</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Text style={styles.deductionLabel}>Advances: ₹{salary.advances}</Text>
                    <Text style={styles.deductionLabel}>Losses: ₹{salary.losses}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.pendingAdvances}>
            <Text style={styles.sectionTitle}>Pending Advance Requests</Text>
            
            {advances.filter(a => a.status === 'pending').map(advance => (
              <View key={advance.id} style={styles.advanceRequestCard}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestEmployee}>{advance.employeeName}</Text>
                  <Text style={styles.requestAmount}>₹{advance.amount}</Text>
                </View>
                <Text style={styles.requestReason}>{advance.reason}</Text>
                <Text style={styles.requestDate}>{advance.date}</Text>
                
                <View style={styles.requestActions}>
                  <TouchableOpacity style={styles.approveButton}>
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton}>
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  if (user?.role === 'dsm') {
    return renderDSMView();
  }

  return renderOwnerView();
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
  salaryCard: {
    backgroundColor: '#3b82f6',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  salaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  salaryMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  salaryDetails: {
    padding: 20,
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  salaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  negativeValue: {
    color: '#fecaca',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    margin: 20,
    marginTop: 0,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 20,
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
  advancesSection: {
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
  advanceCard: {
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
  advanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  advanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  advanceDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  advanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advanceReason: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  approvedBadge: {
    backgroundColor: '#dcfce7',
  },
  rejectedBadge: {
    backgroundColor: '#fee2e2',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  approvedText: {
    color: '#16a34a',
  },
  rejectedText: {
    color: '#dc2626',
  },
  pendingText: {
    color: '#d97706',
  },
  employeeList: {
    padding: 20,
    paddingTop: 0,
  },
  employeeCard: {
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
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  employeeId: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  salaryAmount: {
    alignItems: 'flex-end',
  },
  netPay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  netPayLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  salaryBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  deductionLabel: {
    fontSize: 12,
    color: '#ef4444',
  },
  pendingAdvances: {
    padding: 20,
    paddingTop: 0,
  },
  advanceRequestCard: {
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
  requestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestEmployee: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  requestAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  requestReason: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  requestDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#ffffff',
    fontWeight: '600',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  submitButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});