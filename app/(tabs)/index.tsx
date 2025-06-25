import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, DollarSign, TrendingDown, CreditCard, UserCheck, TriangleAlert as AlertTriangle, TrendingUp, Calendar } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { attendance, salaries, losses, customerDebits, advances } = useData();

  const renderOwnerDashboard = () => {
    const todayAttendance = attendance.filter(a => a.date === new Date().toISOString().split('T')[0]);
    const totalDebits = customerDebits.reduce((sum, debit) => sum + debit.balance, 0);
    const totalLosses = losses.reduce((sum, loss) => sum + loss.amount, 0);
    const pendingAdvances = advances.filter(a => a.status === 'pending').length;

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>Owner Dashboard</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.statGradient}>
                <UserCheck size={24} color="#ffffff" />
                <Text style={styles.statValue}>{todayAttendance.length}</Text>
                <Text style={styles.statLabel}>Present Today</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#10b981', '#059669']} style={styles.statGradient}>
                <DollarSign size={24} color="#ffffff" />
                <Text style={styles.statValue}>₹{totalDebits.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Customer Debits</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.statGradient}>
                <TrendingDown size={24} color="#ffffff" />
                <Text style={styles.statValue}>₹{totalLosses.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Losses</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.statGradient}>
                <AlertTriangle size={24} color="#ffffff" />
                <Text style={styles.statValue}>{pendingAdvances}</Text>
                <Text style={styles.statLabel}>Pending Requests</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Activities</Text>
            
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <UserCheck size={20} color="#3b82f6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>David DSM checked in</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <CreditCard size={20} color="#10b981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New customer debit entry</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <TrendingDown size={20} color="#ef4444" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Loss reported: ₹50</Text>
                <Text style={styles.activityTime}>6 hours ago</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  const renderCustomerDashboard = () => {
    const customerDebits = useData().customerDebits.filter(d => d.customerId === user?.customerId);
    const totalBalance = customerDebits.reduce((sum, debit) => sum + debit.balance, 0);
    const recentTransactions = customerDebits.slice(0, 3);

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Welcome</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>Customer Account</Text>
          </View>

          <View style={styles.balanceCard}>
            <LinearGradient colors={['#1e3a8a', '#3b82f6']} style={styles.balanceGradient}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>₹{totalBalance.toLocaleString()}</Text>
              <Text style={styles.balanceSubText}>Outstanding Amount</Text>
            </LinearGradient>
          </View>

          <View style={styles.quickStatsContainer}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{customerDebits.length}</Text>
              <Text style={styles.quickStatLabel}>Total Transactions</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>
                {customerDebits.filter(d => new Date(d.date).getMonth() === new Date().getMonth()).length}
              </Text>
              <Text style={styles.quickStatLabel}>This Month</Text>
            </View>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {recentTransactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text style={styles.transactionAmount}>₹{transaction.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  const renderEmployeeDashboard = () => {
    const myAttendance = attendance.filter(a => a.employeeId === user?.employeeId);
    const mySalary = salaries.find(s => s.employeeId === user?.employeeId);
    const myAdvances = advances.filter(a => a.employeeId === user?.employeeId);

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.greeting}>Good Morning</Text>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRole}>{user?.role === 'supervisor' ? 'Supervisor' : 'DSM'} Dashboard</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#3b82f6', '#1d4ed8']} style={styles.statGradient}>
                <Calendar size={24} color="#ffffff" />
                <Text style={styles.statValue}>{mySalary?.presentDays || 0}</Text>
                <Text style={styles.statLabel}>Days Present</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#10b981', '#059669']} style={styles.statGradient}>
                <DollarSign size={24} color="#ffffff" />
                <Text style={styles.statValue}>₹{mySalary?.netPay?.toLocaleString() || '0'}</Text>
                <Text style={styles.statLabel}>Net Salary</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.statGradient}>
                <TrendingUp size={24} color="#ffffff" />
                <Text style={styles.statValue}>₹{myAdvances.reduce((sum, a) => sum + a.amount, 0)}</Text>
                <Text style={styles.statLabel}>Advances Taken</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Today's Status</Text>
            
            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Check In</Text>
                <Text style={styles.statusValue}>08:00 AM</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Check Out</Text>
                <Text style={styles.statusValue}>--:-- --</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Hours Worked</Text>
                <Text style={styles.statusValue}>6h 30m</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'owner':
        return renderOwnerDashboard();
      case 'customer':
        return renderCustomerDashboard();
      case 'supervisor':
      case 'dsm':
        return renderEmployeeDashboard();
      default:
        return <View><Text>Role not recognized</Text></View>;
    }
  };

  return renderDashboard();
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
  greeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#3b82f6',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
  },
  statGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
    textAlign: 'center',
  },
  balanceCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 20,
  },
  balanceGradient: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 8,
  },
  balanceSubText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickStat: {
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
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  recentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  activityCard: {
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
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
});