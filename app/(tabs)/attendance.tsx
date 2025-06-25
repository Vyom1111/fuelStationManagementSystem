import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, UserCheck, Plus, Calendar, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function AttendanceScreen() {
  const { user } = useAuth();
  const { attendance, addAttendance, updateAttendance } = useData();
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    employeeId: '',
    employeeName: '',
    date: '',
    checkIn: '',
    checkOut: '',
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for attendance');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setCurrentLocation({
        ...location.coords,
        address: address[0] ? `${address[0].street}, ${address[0].city}` : 'Unknown location'
      });
    } catch (error) {
      Alert.alert('Error', 'Could not get current location');
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Location not available. Please try again.');
      return;
    }

    setIsCheckingIn(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const existingRecord = attendance.find(
        a => a.employeeId === user?.employeeId && a.date === today
      );

      if (existingRecord && !existingRecord.checkOut) {
        // Check out
        updateAttendance(existingRecord.id, {
          checkOut: currentTime,
        });
        Alert.alert('Success', 'Checked out successfully!');
      } else if (!existingRecord) {
        // Check in
        addAttendance({
          employeeId: user?.employeeId || '',
          employeeName: user?.name || '',
          date: today,
          checkIn: currentTime,
          location: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            address: currentLocation.address,
          },
          status: 'present',
        });
        Alert.alert('Success', 'Checked in successfully!');
      } else {
        Alert.alert('Info', 'You have already completed your attendance for today.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record attendance');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualEntry.employeeId || !manualEntry.employeeName || !manualEntry.date || !manualEntry.checkIn) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    addAttendance({
      employeeId: manualEntry.employeeId,
      employeeName: manualEntry.employeeName,
      date: manualEntry.date,
      checkIn: manualEntry.checkIn,
      checkOut: manualEntry.checkOut || undefined,
      location: currentLocation || {
        latitude: 0,
        longitude: 0,
        address: 'Manual Entry'
      },
      status: 'present',
    });

    setManualEntry({
      employeeId: '',
      employeeName: '',
      date: '',
      checkIn: '',
      checkOut: '',
    });
    setShowManualEntry(false);
    Alert.alert('Success', 'Attendance entry added successfully!');
  };

  const renderDSMView = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendance.find(
      a => a.employeeId === user?.employeeId && a.date === today
    );

    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>My Duty</Text>
            <Text style={styles.subtitle}>Track your attendance</Text>
          </View>

          <View style={styles.locationCard}>
            <MapPin size={20} color="#3b82f6" />
            <View style={styles.locationText}>
              <Text style={styles.locationLabel}>Current Location</Text>
              <Text style={styles.locationAddress}>
                {currentLocation?.address || 'Getting location...'}
              </Text>
            </View>
          </View>

          <View style={styles.attendanceCard}>
            <Text style={styles.cardTitle}>Today's Status</Text>
            
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Clock size={24} color="#10b981" />
                <Text style={styles.statusLabel}>Check In</Text>
                <Text style={styles.statusTime}>
                  {todayRecord?.checkIn || '--:--'}
                </Text>
              </View>
              
              <View style={styles.statusItem}>
                <Clock size={24} color="#ef4444" />
                <Text style={styles.statusLabel}>Check Out</Text>
                <Text style={styles.statusTime}>
                  {todayRecord?.checkOut || '--:--'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.attendanceButton,
                todayRecord?.checkOut ? styles.attendanceButtonDisabled : {},
              ]}
              onPress={handleCheckIn}
              disabled={isCheckingIn || !!todayRecord?.checkOut}
            >
              <UserCheck size={20} color="#ffffff" />
              <Text style={styles.attendanceButtonText}>
                {isCheckingIn 
                  ? 'Processing...' 
                  : todayRecord?.checkIn && !todayRecord?.checkOut
                    ? 'Check Out'
                    : todayRecord?.checkOut
                      ? 'Completed'
                      : 'Check In'
                }
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Attendance</Text>
            {attendance
              .filter(a => a.employeeId === user?.employeeId)
              .slice(0, 5)
              .map(record => (
                <View key={record.id} style={styles.historyCard}>
                  <View style={styles.historyDate}>
                    <Calendar size={16} color="#6b7280" />
                    <Text style={styles.historyDateText}>{record.date}</Text>
                  </View>
                  <View style={styles.historyTimes}>
                    <Text style={styles.historyTime}>In: {record.checkIn}</Text>
                    <Text style={styles.historyTime}>
                      Out: {record.checkOut || 'Not recorded'}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    {record.status === 'present' ? (
                      <CheckCircle size={16} color="#10b981" />
                    ) : (
                      <XCircle size={16} color="#ef4444" />
                    )}
                  </View>
                </View>
              ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  const renderOwnerSupervisorView = () => {
    return (
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={styles.header}>
            <Text style={styles.title}>Attendance Management</Text>
            <Text style={styles.subtitle}>Monitor staff attendance</Text>
          </View>

          {user?.role === 'owner' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowManualEntry(true)}
            >
              <Plus size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Manual Entry</Text>
            </TouchableOpacity>
          )}

          <View style={styles.attendanceList}>
            <Text style={styles.sectionTitle}>Today's Attendance</Text>
            
            {attendance
              .filter(a => a.date === new Date().toISOString().split('T')[0])
              .map(record => (
                <View key={record.id} style={styles.attendanceRecord}>
                  <View style={styles.employeeInfo}>
                    <Text style={styles.employeeName}>{record.employeeName}</Text>
                    <Text style={styles.employeeId}>ID: {record.employeeId}</Text>
                  </View>
                  
                  <View style={styles.timeInfo}>
                    <Text style={styles.checkInTime}>In: {record.checkIn}</Text>
                    <Text style={styles.checkOutTime}>
                      Out: {record.checkOut || 'Working'}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    {record.status === 'present' ? (
                      <CheckCircle size={20} color="#10b981" />
                    ) : (
                      <XCircle size={20} color="#ef4444" />
                    )}
                  </View>
                </View>
              ))}
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Monthly Summary</Text>
            
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {attendance.filter(a => a.status === 'present').length}
                </Text>
                <Text style={styles.summaryLabel}>Present Days</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {attendance.filter(a => a.status === 'absent').length}
                </Text>
                <Text style={styles.summaryLabel}>Absent Days</Text>
              </View>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>
                  {attendance.filter(a => a.status === 'late').length}
                </Text>
                <Text style={styles.summaryLabel}>Late Days</Text>
              </View>
            </View>
          </View>

          <Modal
            visible={showManualEntry}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowManualEntry(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add Manual Attendance</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Employee ID"
                  value={manualEntry.employeeId}
                  onChangeText={(text) => setManualEntry(prev => ({ ...prev, employeeId: text }))}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Employee Name"
                  value={manualEntry.employeeName}
                  onChangeText={(text) => setManualEntry(prev => ({ ...prev, employeeName: text }))}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Date (YYYY-MM-DD)"
                  value={manualEntry.date}
                  onChangeText={(text) => setManualEntry(prev => ({ ...prev, date: text }))}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Check In Time (HH:MM)"
                  value={manualEntry.checkIn}
                  onChangeText={(text) => setManualEntry(prev => ({ ...prev, checkIn: text }))}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Check Out Time (HH:MM) - Optional"
                  value={manualEntry.checkOut}
                  onChangeText={(text) => setManualEntry(prev => ({ ...prev, checkOut: text }))}
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowManualEntry(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleManualEntry}
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
  };

  if (user?.role === 'dsm') {
    return renderDSMView();
  }

  return renderOwnerSupervisorView();
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  locationAddress: {
    fontSize: 14,
    color: '#1f2937',
    marginTop: 2,
  },
  attendanceCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
  statusTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  attendanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  attendanceButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  attendanceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
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
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  historyCard: {
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
  historyDate: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyDateText: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 8,
  },
  historyTimes: {
    flex: 2,
  },
  historyTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendanceList: {
    padding: 20,
    paddingTop: 0,
  },
  attendanceRecord: {
    flexDirection: 'row',
    alignItems: 'center',
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
  employeeInfo: {
    flex: 2,
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
  timeInfo: {
    flex: 2,
  },
  checkInTime: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '500',
  },
  checkOutTime: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
    marginTop: 2,
  },
  summarySection: {
    padding: 20,
    paddingTop: 0,
  },
  summaryGrid: {
    flexDirection: 'row',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
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