import React, { createContext, useContext, useState } from 'react';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'present' | 'absent' | 'late';
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  dailyWage: number;
  presentDays: number;
  totalEarnings: number;
  advances: number;
  losses: number;
  netPay: number;
}

export interface LossRecord {
  id: string;
  date: string;
  amount: number;
  reason: string;
  responsibleEmployee?: string;
  approvedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CustomerDebit {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  date: string;
  amount: number;
  description: string;
  fuelType: string;
  quantity: number;
  rate: number;
  balance: number;
}

export interface AdvanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

interface DataContextType {
  attendance: AttendanceRecord[];
  salaries: SalaryRecord[];
  losses: LossRecord[];
  customerDebits: CustomerDebit[];
  advances: AdvanceRecord[];
  addAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
  addLoss: (record: Omit<LossRecord, 'id'>) => void;
  addCustomerDebit: (record: Omit<CustomerDebit, 'id'>) => void;
  addAdvance: (record: Omit<AdvanceRecord, 'id'>) => void;
  approveAdvance: (id: string, approvedBy: string) => void;
  getTotalCustomerBalance: (customerId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: 'EMP002',
      employeeName: 'Mike Supervisor',
      date: '2025-01-27',
      checkIn: '08:00',
      checkOut: '20:00',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'Petrol Pump Station, Main Street'
      },
      status: 'present'
    },
    {
      id: '2',
      employeeId: 'EMP003',
      employeeName: 'David DSM',
      date: '2025-01-27',
      checkIn: '06:00',
      checkOut: '18:00',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'Petrol Pump Station, Main Street'
      },
      status: 'present'
    }
  ]);

  const [salaries, setSalaries] = useState<SalaryRecord[]>([
    {
      id: '1',
      employeeId: 'EMP002',
      employeeName: 'Mike Supervisor',
      month: '2025-01',
      dailyWage: 150,
      presentDays: 26,
      totalEarnings: 3900,
      advances: 500,
      losses: 0,
      netPay: 3400
    },
    {
      id: '2',
      employeeId: 'EMP003',
      employeeName: 'David DSM',
      month: '2025-01',
      dailyWage: 120,
      presentDays: 27,
      totalEarnings: 3240,
      advances: 300,
      losses: 100,
      netPay: 2840
    }
  ]);

  const [losses, setLosses] = useState<LossRecord[]>([
    {
      id: '1',
      date: '2025-01-25',
      amount: 100,
      reason: 'Fuel spillage during delivery',
      responsibleEmployee: 'EMP003',
      approvedBy: 'EMP001',
      status: 'approved'
    },
    {
      id: '2',
      date: '2025-01-26',
      amount: 50,
      reason: 'Cash shortage at end of shift',
      responsibleEmployee: 'EMP003',
      approvedBy: 'EMP002',
      status: 'pending'
    }
  ]);

  const [customerDebits, setCustomerDebits] = useState<CustomerDebit[]>([
    {
      id: '1',
      customerId: 'CUST001',
      customerName: 'Sarah Customer',
      phone: '+1234567893',
      date: '2025-01-20',
      amount: 2500,
      description: 'Petrol purchase',
      fuelType: 'Petrol',
      quantity: 50,
      rate: 50,
      balance: 2500
    },
    {
      id: '2',
      customerId: 'CUST002',
      customerName: 'Robert Wilson',
      phone: '+1234567894',
      date: '2025-01-22',
      amount: 1800,
      description: 'Diesel purchase',
      fuelType: 'Diesel',
      quantity: 40,
      rate: 45,
      balance: 1800
    }
  ]);

  const [advances, setAdvances] = useState<AdvanceRecord[]>([
    {
      id: '1',
      employeeId: 'EMP003',
      employeeName: 'David DSM',
      date: '2025-01-15',
      amount: 300,
      reason: 'Medical emergency',
      status: 'approved',
      approvedBy: 'EMP001'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Mike Supervisor',
      date: '2025-01-20',
      amount: 500,
      reason: 'Family function',
      status: 'approved',
      approvedBy: 'EMP001'
    }
  ]);

  const addAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setAttendance(prev => [...prev, newRecord]);
  };

  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ));
  };

  const addLoss = (record: Omit<LossRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setLosses(prev => [...prev, newRecord]);
  };

  const addCustomerDebit = (record: Omit<CustomerDebit, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setCustomerDebits(prev => [...prev, newRecord]);
  };

  const addAdvance = (record: Omit<AdvanceRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: Date.now().toString()
    };
    setAdvances(prev => [...prev, newRecord]);
  };

  const approveAdvance = (id: string, approvedBy: string) => {
    setAdvances(prev => prev.map(advance =>
      advance.id === id 
        ? { ...advance, status: 'approved' as const, approvedBy }
        : advance
    ));
  };

  const getTotalCustomerBalance = (customerId: string) => {
    return customerDebits
      .filter(debit => debit.customerId === customerId)
      .reduce((total, debit) => total + debit.balance, 0);
  };

  return (
    <DataContext.Provider value={{
      attendance,
      salaries,
      losses,
      customerDebits,
      advances,
      addAttendance,
      updateAttendance,
      addLoss,
      addCustomerDebit,
      addAdvance,
      approveAdvance,
      getTotalCustomerBalance
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};