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
import { TrendingDown, Plus, TriangleAlert as AlertTriangle, Calendar, DollarSign, User, CircleCheck as CheckCircle, Circle as XCircle, Clock } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function LossesScreen() {
  const { user } = useAuth();
  const { losses, addLoss } = useData();
  const [showAddLoss, setShowAddLoss] = useState(false);
  const [lossData, setLossData] = useState({
    amount: '',
    reason: '',
    responsibleEmployee: '',
  });

  const handleAddLoss = () => {
    if (!lossData.amount || !lossData.reason) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const amount = parseFloat(lossData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addLoss({
      date: new Date().toISOString().split('T')[0],
      amount,
      reason: lossData.reason,
      responsibleEmployee: lossData.responsibleEmployee || undefined,
      approvedBy: user?.employeeId || user?.id || '',
      status: user?.role === 'owner' ? 'approved' : 'pending',
    });

    setLossData({
      amount: '',
      reason: '',
      responsibleEmployee: '',
    });
    setShowAddLoss(false);
    Alert.alert('Success', 'Loss entry added successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'rejected':
        return <XCircle size={16} color="#ef4444" />;
      default:
        return <Clock size={16} color="#f59e0b" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return styles.approvedStatus;
      case 'rejected':
        return styles.rejectedStatus;
      default:
        return styles.pendingStatus;
    }
  };

  const totalLosses = losses.reduce((sum, loss) => sum + loss.amount, 0);
  const approvedLosses = losses.filter(l => l.status === 'approved').reduce((sum, loss) => sum + loss.amount, 0);
  const pendingLosses = losses.filter(l => l.status === 'pending').length;

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Loss Management</Text>
          <Text style={styles.subtitle}>Track fuel and cash losses</Text>
        </View>

        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <TrendingDown size={24} color="#ef4444" />
            <Text style={styles.summaryValue}>₹{totalLosses.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Losses</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <CheckCircle size={24} color="#10b981" />
            <Text style={styles.summaryValue}>₹{approvedLosses.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>
          
          <View style={styles.summaryCard}>
            <Clock size={24} color="#f59e0b" />
            <Text style={styles.summaryValue}>{pendingLosses}</Text>
            <Text style={styles.summaryLabel}>Pending</Text>
          </View>
        </View>

        {(user?.role === 'owner' || user?.role === 'supervisor') && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddLoss(true)}
          >
            <Plus size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Loss Entry</Text>
          </TouchableOpacity>
        )}

        <View style={styles.lossList}>
          <Text style={styles.sectionTitle}>Loss Records</Text>
          
          {losses.length === 0 ? (
            <View style={styles.emptyState}>
              <AlertTriangle size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>No losses recorded</Text>
            </View>
          ) : (
            losses.map(loss => (
              <View key={loss.id} style={styles.lossCard}>
                <View style={styles.lossHeader}>
                  <View style={styles.lossInfo}>
                    <Text style={styles.lossAmount}>₹{loss.amount.toLocaleString()}</Text>
                    <View style={styles.lossDate}>
                      <Calendar size={14} color="#6b7280" />
                      <Text style={styles.lossDateText}>{loss.date}</Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, getStatusColor(loss.status)]}>
                    {getStatusIcon(loss.status)}
                    <Text style={[styles.statusText, getStatusColor(loss.status)]}>
                      {loss.status.charAt(0).toUpperCase() + loss.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.lossReason}>{loss.reason}</Text>
                
                {loss.responsibleEmployee && (
                  <View style={styles.responsibleEmployee}>
                    <User size={14} color="#6b7280" />
                    <Text style={styles.responsibleEmployeeText}>
                      Responsible: {loss.responsibleEmployee}
                    </Text>
                  </View>
                )}
                
                <Text style={styles.approvedBy}>
                  Approved by: {loss.approvedBy}
                </Text>
              </View>
            ))
          )}
        </View>

        <Modal
          visible={showAddLoss}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddLoss(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Loss Entry</Text>
              
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  value={lossData.amount}
                  onChangeText={(text) => setLossData(prev => ({ ...prev, amount: text }))}
                  keyboardType="numeric"
                />
              </View>
              
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Reason for loss"
                value={lossData.reason}
                onChangeText={(text) => setLossData(prev => ({ ...prev, reason: text }))}
                multiline
                numberOfLines={4}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Responsible Employee (Optional)"
                value={lossData.responsibleEmployee}
                onChangeText={(text) => setLossData(prev => ({ ...prev, responsibleEmployee: text }))}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddLoss(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddLoss}
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
    backgroundColor: '#ef4444',
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
  lossList: {
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
  lossCard: {
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
  lossHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lossInfo: {
    flex: 1,
  },
  lossAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  lossDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lossDateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  approvedStatus: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  rejectedStatus: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
  },
  pendingStatus: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  lossReason: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  responsibleEmployee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  responsibleEmployeeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  approvedBy: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
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
    backgroundColor: '#ef4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});