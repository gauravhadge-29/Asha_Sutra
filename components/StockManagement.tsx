import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { MedicalStock, StockTransaction, StockAlert } from '../types';
import { ChevronLeftIcon } from './Icons';

interface StockManagementProps {
  setActiveScreen?: (screen: string) => void;
  onBack?: () => void;
}

const StockCard: React.FC<{ stock: MedicalStock; onUpdate: (stock: MedicalStock) => void; onDispense: (stock: MedicalStock) => void }> = ({ 
  stock, 
  onUpdate, 
  onDispense 
}) => {
  const isLowStock = stock.currentQuantity <= stock.minQuantity;
  const isExpiringSoon = stock.expiryDate && new Date(stock.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const isExpired = stock.expiryDate && new Date(stock.expiryDate) <= new Date();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Medicine': return 'M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z';
      case 'Equipment': return 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z';
      case 'Supplies': return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z';
      case 'Vaccine': return 'M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm7 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z';
      default: return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z';
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'from-red-500 to-red-600';
    if (isLowStock || isExpiringSoon) return 'from-amber-500 to-orange-600';
    return 'from-emerald-500 to-teal-600';
  };

  const getStockLevel = () => {
    const percentage = (stock.currentQuantity / stock.maxQuantity) * 100;
    if (percentage <= 20) return 'Critical';
    if (percentage <= 50) return 'Low';
    if (percentage <= 80) return 'Medium';
    return 'Good';
  };

  return (
    <div className="modern-card group">
      {/* Header with category and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getStatusColor()} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d={getCategoryIcon(stock.category)} />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{stock.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{stock.category}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            getStockLevel() === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
            getStockLevel() === 'Low' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
            getStockLevel() === 'Medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
          }`}>
            {getStockLevel()}
          </span>
        </div>
      </div>

      {/* Stock quantity and progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Current Stock</span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {stock.currentQuantity} {stock.unit}
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full bg-gradient-to-r ${getStatusColor()} transition-all duration-300`}
            style={{ width: `${Math.min((stock.currentQuantity / stock.maxQuantity) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
          <span>Min: {stock.minQuantity}</span>
          <span>Max: {stock.maxQuantity}</span>
        </div>
      </div>

      {/* Expiry information */}
      {stock.expiryDate && (
        <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Expiry Date:</span>
            <span className={`font-semibold ${
              isExpired ? 'text-red-600 dark:text-red-400' :
              isExpiringSoon ? 'text-amber-600 dark:text-amber-400' :
              'text-slate-900 dark:text-white'
            }`}>
              {new Date(stock.expiryDate).toLocaleDateString()}
            </span>
          </div>
          {stock.batchNumber && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-600 dark:text-slate-300">Batch:</span>
              <span className="font-mono text-slate-900 dark:text-white">{stock.batchNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex space-x-2">
        <button 
          onClick={() => onDispense(stock)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          disabled={stock.currentQuantity === 0}
        >
          Dispense
        </button>
        <button 
          onClick={() => onUpdate(stock)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
        >
          Update
        </button>
      </div>

      {/* Warning indicators */}
      {(isLowStock || isExpiringSoon || isExpired) && (
        <div className="mt-3 space-y-1">
          {isExpired && (
            <div className="flex items-center text-red-600 dark:text-red-400 text-xs">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Expired - Do not use
            </div>
          )}
          {isExpiringSoon && !isExpired && (
            <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Expires within 30 days
            </div>
          )}
          {isLowStock && (
            <div className="flex items-center text-amber-600 dark:text-amber-400 text-xs">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Low stock - Reorder needed
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StockManagement: React.FC<StockManagementProps> = ({ setActiveScreen, onBack }) => {
  const [stocks, setStocks] = useLocalStorage<MedicalStock[]>('medicalStocks', []);
  const [transactions, setTransactions] = useLocalStorage<StockTransaction[]>('stockTransactions', []);
  const [alerts, setAlerts] = useLocalStorage<StockAlert[]>('stockAlerts', []);
  const [activeTab, setActiveTab] = useState<'inventory' | 'alerts' | 'transactions'>('inventory');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDispenseForm, setShowDispenseForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState<MedicalStock | null>(null);

  // Generate alerts based on stock levels and expiry dates
  useEffect(() => {
    const newAlerts: StockAlert[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    stocks.forEach(stock => {
      // Low stock alerts
      if (stock.currentQuantity <= stock.minQuantity) {
        const severity = stock.currentQuantity === 0 ? 'CRITICAL' : 
                        stock.currentQuantity <= stock.minQuantity * 0.5 ? 'HIGH' : 'MEDIUM';
        
        newAlerts.push({
          id: `low-stock-${stock.id}`,
          stockId: stock.id,
          type: 'LOW_STOCK',
          severity,
          message: `${stock.name} is ${stock.currentQuantity === 0 ? 'out of stock' : 'running low'} (${stock.currentQuantity} ${stock.unit} remaining)`,
          threshold: stock.minQuantity,
          acknowledged: false,
          timestamp: new Date().toISOString()
        });
      }

      // Expiry alerts
      if (stock.expiryDate) {
        const expiryDate = new Date(stock.expiryDate);
        if (expiryDate <= now) {
          newAlerts.push({
            id: `expired-${stock.id}`,
            stockId: stock.id,
            type: 'EXPIRED',
            severity: 'CRITICAL',
            message: `${stock.name} has expired (Batch: ${stock.batchNumber || 'N/A'})`,
            acknowledged: false,
            timestamp: new Date().toISOString()
          });
        } else if (expiryDate <= thirtyDaysFromNow) {
          newAlerts.push({
            id: `expiring-${stock.id}`,
            stockId: stock.id,
            type: 'EXPIRING_SOON',
            severity: 'MEDIUM',
            message: `${stock.name} expires on ${expiryDate.toLocaleDateString()} (Batch: ${stock.batchNumber || 'N/A'})`,
            acknowledged: false,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    // Update alerts, keeping acknowledged status for existing alerts
    const existingAlertIds = new Set(alerts.map(a => a.id));
    const updatedAlerts = newAlerts.map(newAlert => {
      const existingAlert = alerts.find(a => a.id === newAlert.id);
      return existingAlert ? { ...newAlert, acknowledged: existingAlert.acknowledged } : newAlert;
    });

    setAlerts(updatedAlerts);
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => 
      selectedCategory === 'All' || stock.category === selectedCategory
    );
  }, [stocks, selectedCategory]);

  const criticalAlerts = useMemo(() => {
    return alerts.filter(alert => !alert.acknowledged && alert.severity === 'CRITICAL');
  }, [alerts]);

  const handleAddStock = (stockData: Omit<MedicalStock, 'id' | 'lastUpdated' | 'synced'>) => {
    const newStock: MedicalStock = {
      ...stockData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
      synced: false
    };
    setStocks([...stocks, newStock]);
    setShowAddForm(false);
  };

  const handleDispenseStock = (stockId: string, quantity: number, patientId?: string, familyId?: string, notes?: string) => {
    const stock = stocks.find(s => s.id === stockId);
    if (!stock || stock.currentQuantity < quantity) return;

    // Create transaction record
    const transaction: StockTransaction = {
      id: Date.now().toString(),
      stockId,
      type: 'OUT',
      quantity,
      reason: 'Dispensed to patient',
      patientId,
      familyId,
      notes,
      timestamp: new Date().toISOString(),
      performedBy: 'ASHA Worker', // In a real app, this would be the logged-in user
      synced: false
    };

    // Update stock quantity
    const updatedStocks = stocks.map(s => 
      s.id === stockId 
        ? { ...s, currentQuantity: s.currentQuantity - quantity, lastUpdated: new Date().toISOString(), synced: false }
        : s
    );

    setStocks(updatedStocks);
    setTransactions([...transactions, transaction]);
    setShowDispenseForm(false);
    setSelectedStock(null);
  };

  const handleUpdateStock = (stockData: Omit<MedicalStock, 'id' | 'lastUpdated' | 'synced'>) => {
    if (selectedStock) {
      const updatedStocks = stocks.map(s => 
        s.id === selectedStock.id 
          ? { ...s, ...stockData, lastUpdated: new Date().toISOString(), synced: false }
          : s
      );
      setStocks(updatedStocks);
    }
    setShowAddForm(false);
    setSelectedStock(null);
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  // Initialize with sample data if empty
  useEffect(() => {
    if (stocks.length === 0) {
      const sampleStocks: MedicalStock[] = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          category: 'Medicine',
          currentQuantity: 15,
          minQuantity: 50,
          maxQuantity: 200,
          unit: 'tablets',
          expiryDate: '2025-06-15',
          batchNumber: 'PAR2024001',
          supplier: 'MedSupply Ltd',
          cost: 0.05,
          lastUpdated: new Date().toISOString(),
          synced: false
        },
        {
          id: '2',
          name: 'Digital Thermometer',
          category: 'Equipment',
          currentQuantity: 3,
          minQuantity: 2,
          maxQuantity: 10,
          unit: 'pieces',
          supplier: 'MedTech Solutions',
          cost: 25.00,
          lastUpdated: new Date().toISOString(),
          synced: false
        },
        {
          id: '3',
          name: 'ORS Packets',
          category: 'Medicine',
          currentQuantity: 80,
          minQuantity: 30,
          maxQuantity: 150,
          unit: 'packets',
          expiryDate: '2026-03-20',
          batchNumber: 'ORS2024B15',
          supplier: 'Health Solutions Inc',
          cost: 0.20,
          lastUpdated: new Date().toISOString(),
          synced: false
        },
        {
          id: '4',
          name: 'COVID-19 Vaccine',
          category: 'Vaccine',
          currentQuantity: 5,
          minQuantity: 10,
          maxQuantity: 50,
          unit: 'vials',
          expiryDate: '2025-01-15',
          batchNumber: 'COV2024V03',
          supplier: 'VaxPharma',
          cost: 15.00,
          lastUpdated: new Date().toISOString(),
          synced: false
        }
      ];
      setStocks(sampleStocks);
    }
  }, []);

  return (
    <div>
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeftIcon className="w-5 h-5 text-white" />
              </button>
            )}
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Stock Management</h1>
              <p className="text-emerald-100 text-sm sm:text-base">Medical inventory & supply tracking</p>
            </div>
          </div>
          
          {criticalAlerts.length > 0 && (
            <div className="px-3 sm:px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-xs sm:text-sm">
                  {criticalAlerts.length} Critical Alert{criticalAlerts.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">

      {/* Tab Navigation */}
      <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {[
          { key: 'inventory', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
          { key: 'alerts', label: 'Alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z' },
          { key: 'transactions', label: 'History', icon: 'M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Category filter and add button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {['All', 'Medicine', 'Equipment', 'Supplies', 'Vaccine'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Add Stock
            </button>
          </div>

          {/* Stock grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStocks.map(stock => (
              <StockCard
                key={stock.id}
                stock={stock}
                onUpdate={(stock) => {
                  setSelectedStock(stock);
                  setShowAddForm(true);
                }}
                onDispense={(stock) => {
                  setSelectedStock(stock);
                  setShowDispenseForm(true);
                }}
              />
            ))}
          </div>

          {filteredStocks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No stock items found</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {selectedCategory === 'All' 
                  ? 'Start by adding your first stock item'
                  : `No items in ${selectedCategory} category`
                }
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Add Stock Item
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.filter(alert => !alert.acknowledged).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-200 to-emerald-300 dark:from-emerald-700 dark:to-emerald-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">All good!</h3>
              <p className="text-slate-600 dark:text-slate-300">No active alerts at the moment</p>
            </div>
          ) : (
            alerts
              .filter(alert => !alert.acknowledged)
              .sort((a, b) => {
                const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
                return severityOrder[a.severity] - severityOrder[b.severity];
              })
              .map(alert => {
                const stock = stocks.find(s => s.id === alert.stockId);
                return (
                  <div
                    key={alert.id}
                    className={`modern-card border-l-4 ${
                      alert.severity === 'CRITICAL' ? 'border-red-500' :
                      alert.severity === 'HIGH' ? 'border-orange-500' :
                      alert.severity === 'MEDIUM' ? 'border-amber-500' :
                      'border-blue-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            alert.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {stock?.name || 'Unknown Item'}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          {alert.message}
                        </p>
                      </div>
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No transaction history</h3>
              <p className="text-slate-600 dark:text-slate-300">Stock transactions will appear here</p>
            </div>
          ) : (
            transactions
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(transaction => {
                const stock = stocks.find(s => s.id === transaction.stockId);
                return (
                  <div key={transaction.id} className="modern-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === 'OUT' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                            transaction.type === 'IN' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {transaction.type === 'OUT' ? 'Dispensed' : transaction.type === 'IN' ? 'Received' : 'Adjusted'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {stock?.name || 'Unknown Item'}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-1">
                          Quantity: {transaction.quantity} {stock?.unit || 'units'}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                          Reason: {transaction.reason}
                        </p>
                        {transaction.notes && (
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Notes: {transaction.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          By: {transaction.performedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* Add/Edit Stock Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modern-card max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedStock ? 'Update Stock' : 'Add New Stock'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedStock(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <StockForm
              stock={selectedStock}
              onSubmit={selectedStock ? handleUpdateStock : handleAddStock}
              onCancel={() => {
                setShowAddForm(false);
                setSelectedStock(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Dispense Stock Modal */}
      {showDispenseForm && selectedStock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modern-card max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Dispense {selectedStock.name}
              </h2>
              <button
                onClick={() => {
                  setShowDispenseForm(false);
                  setSelectedStock(null);
                }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DispenseForm
              stock={selectedStock}
              onSubmit={(quantity, patientId, familyId, notes) => 
                handleDispenseStock(selectedStock.id, quantity, patientId, familyId, notes)
              }
              onCancel={() => {
                setShowDispenseForm(false);
                setSelectedStock(null);
              }}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

// Stock Form Component
const StockForm: React.FC<{
  stock?: MedicalStock | null;
  onSubmit: (data: Omit<MedicalStock, 'id' | 'lastUpdated' | 'synced'>) => void;
  onCancel: () => void;
}> = ({ stock, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: stock?.name || '',
    category: stock?.category || 'Medicine' as MedicalStock['category'],
    currentQuantity: stock?.currentQuantity || 0,
    minQuantity: stock?.minQuantity || 10,
    maxQuantity: stock?.maxQuantity || 100,
    unit: stock?.unit || 'tablets',
    expiryDate: stock?.expiryDate || '',
    batchNumber: stock?.batchNumber || '',
    supplier: stock?.supplier || '',
    cost: stock?.cost || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Item Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as MedicalStock['category'] })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="Medicine">Medicine</option>
            <option value="Equipment">Equipment</option>
            <option value="Supplies">Supplies</option>
            <option value="Vaccine">Vaccine</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Unit *
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., tablets, bottles, pieces"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Current Qty *
          </label>
          <input
            type="number"
            value={formData.currentQuantity}
            onChange={(e) => setFormData({ ...formData, currentQuantity: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Min Qty *
          </label>
          <input
            type="number"
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Max Qty *
          </label>
          <input
            type="number"
            value={formData.maxQuantity}
            onChange={(e) => setFormData({ ...formData, maxQuantity: parseInt(e.target.value) || 0 })}
            min="1"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Batch Number
          </label>
          <input
            type="text"
            value={formData.batchNumber}
            onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Supplier
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Cost per Unit
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            min="0"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
        >
          {stock ? 'Update Stock' : 'Add Stock'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Dispense Form Component
const DispenseForm: React.FC<{
  stock: MedicalStock;
  onSubmit: (quantity: number, patientId?: string, familyId?: string, notes?: string) => void;
  onCancel: () => void;
}> = ({ stock, onSubmit, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const [patientId, setPatientId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > 0 && quantity <= stock.currentQuantity) {
      onSubmit(quantity, patientId || undefined, familyId || undefined, notes || undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Available: <span className="font-semibold text-slate-900 dark:text-white">{stock.currentQuantity} {stock.unit}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Quantity to Dispense *
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          min="1"
          max={stock.currentQuantity}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Patient ID (Optional)
        </label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter patient ID if dispensing to specific patient"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Family ID (Optional)
        </label>
        <input
          type="text"
          value={familyId}
          onChange={(e) => setFamilyId(e.target.value)}
          placeholder="Enter family ID if relevant"
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes about dispensing..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          disabled={quantity <= 0 || quantity > stock.currentQuantity}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Dispense {quantity} {stock.unit}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StockManagement;