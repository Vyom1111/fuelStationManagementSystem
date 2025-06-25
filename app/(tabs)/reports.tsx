import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, Download, Calendar, Users, DollarSign, TrendingDown, FileText, ChartPie as PieChart, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function ReportsScreen() {
  const { user } = useAuth();
  const { attendance, salaries, losses, customerDebits, advances } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const generateReport = (reportType: string) => {
    Alert.alert(
      'Generate Report',
      `${reportType} report will be generated and downloaded.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Generate', onPress: () => console.log(`Generating ${reportType} report`) }
      ]
    );
  };

  // Calculate statistics
  const totalEmployees = [...new Set(attendance.map(a => a.employeeId))].length;
  const totalCustomers = [...new Set(customerDebits.map(d => d.customerId))].length;
  const totalSalaryPaid = salaries.reduce((sum, s) => sum + s.netPay, 0);
  const totalLosses = losses.reduce((sum, l) => sum + l.amount, 0);
  const totalDebits = customerDebits.reduce((sum, d) => sum + d.balance, 0);
  const totalAdvances = advances.reduce((sum, a) => sum + a.amount, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyAttendance = attendance.filter(a => a.date.startsWith(currentMonth));
  const monthlyLosses = losses.filter(l => l.date.startsWith(currentMonth));
  const monthlyDebits = customerDebits.filter(d => d.date.startsWith(currentMonth));

  const reportCards = [
    {
      title: 'Attendance Report',
      description: 'Employee attendance summary',
      icon: Users,
      color: '#3b82f6',
      stats: `${monthlyAttendance.length} records this month`,
      onGenerate: () => generateReport('Attendance'),
    },
    {
      title: 'Salary Report',
      description: 'Employee salary breakdown',
      icon: DollarSign,
      color: '#10b981',
      stats: `₹${totalSalaryPaid.toLocaleString()} total paid`,
      onGenerate: () => generateReport('Salary'),
    },
    {
      title: 'Loss Report',
      description: 'Fuel and cash losses',
      icon: TrendingDown,
      color: '#ef4444',
      stats: `₹${totalLosses.toLocaleString()} total losses`,
      onGenerate: () => generateReport('Loss'),
    },
    {
      title: 'Customer Debit Report',
      description: 'Outstanding customer balances',
      icon: FileText,
      color: '#f59e0b',
      stats: `₹${totalDebits.toLocaleString()} outstanding`,
      onGenerate: () => generateReport('Customer Debit'),
    },
    {
      title: 'Advance Report',
      description: 'Employee advance summary',
      icon: TrendingUp,
      color: '#8b5cf6',
      stats: `₹${totalAdvances.toLocaleString()} total advances`,
      onGenerate: () => generateReport('Advance'),
    },
    {
      title: 'Daily Summary',
      description: 'Complete daily operations',
      icon: PieChart,
      color: '#06b6d4',
      stats: 'All activities included',
      onGenerate: () => generateReport('Daily Summary'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <Text style={styles.subtitle}>Generate and export reports</Text>
        </View>

        <View style={styles.periodSelector}>
          <Text style={styles.periodLabel}>Report Period:</Text>
          <View style={styles.periodButtons}>
            {['daily', 'weekly', 'monthly', 'yearly'].map(period => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Quick Overview</Text>
          
          <View style={styles.overviewGrid}>
            <View style={styles.overviewCard}>
              <Users size={24} color="#3b82f6" />
              <Text style={styles.overviewValue}>{totalEmployees}</Text>
              <Text style={styles.overviewLabel}>Employees</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <FileText size={24} color="#10b981" />
              <Text style={styles.overviewValue}>{totalCustomers}</Text>
              <Text style={styles.overviewLabel}>Customers</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <DollarSign size={24} color="#ef4444" />
              <Text style={styles.overviewValue}>₹{totalDebits.toLocaleString()}</Text>
              <Text style={styles.overviewLabel}>Outstanding</Text>
            </View>
            
            <View style={styles.overviewCard}>
              <TrendingDown size={24} color="#f59e0b" />
              <Text style={styles.overviewValue}>₹{totalLosses.toLocaleString()}</Text>
              <Text style={styles.overviewLabel}>Losses</Text>
            </View>
          </View>
        </View>

        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          
          {reportCards.map((report, index) => (
            <View key={index} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={[styles.reportIcon, { backgroundColor: `${report.color}20` }]}>
                  <report.icon size={24} color={report.color} />
                </View>
                
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportDescription}>{report.description}</Text>
                  <Text style={styles.reportStats}>{report.stats}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: report.color }]}
                onPress={report.onGenerate}
              >
                <Download size={16} color="#ffffff" />
                <Text style={styles.generateButtonText}>Generate</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export Options</Text>
          
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => Alert.alert('Export', 'Exporting all data as PDF...')}
            >
              <FileText size={20} color="#ef4444" />
              <Text style={styles.exportButtonText}>Export as PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => Alert.alert('Export', 'Exporting all data as Excel...')}
            >
              <BarChart3 size={20} color="#10b981" />
              <Text style={styles.exportButtonText}>Export as Excel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Scheduled Reports</Text>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleInfo}>
              <Calendar size={20} color="#3b82f6" />
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleTitle}>Daily Summary</Text>
                <Text style={styles.scheduleDescription}>
                  Automatically generated every day at 11:59 PM
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.scheduleToggle}>
              <Text style={styles.scheduleToggleText}>Enabled</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleInfo}>
              <Calendar size={20} color="#10b981" />
              <View style={styles.scheduleText}>
                <Text style={styles.scheduleTitle}>Monthly Report</Text>
                <Text style={styles.scheduleDescription}>
                  Comprehensive monthly summary on 1st of each month
                </Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.scheduleToggle}>
              <Text style={styles.scheduleToggleText}>Enabled</Text>
            </TouchableOpacity>
          </View>
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
  periodSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  summarySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  overviewCard: {
    width: '48%',
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
  overviewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  reportsSection: {
    padding: 20,
    paddingTop: 0,
  },
  reportCard: {
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
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  reportDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  reportStats: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  exportSection: {
    padding: 20,
    paddingTop: 0,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  scheduleSection: {
    padding: 20,
    paddingTop: 0,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleText: {
    marginLeft: 12,
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  scheduleDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  scheduleToggle: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scheduleToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
});