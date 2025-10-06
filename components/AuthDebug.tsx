import React, { useState } from 'react';

const AuthDebug: React.FC = () => {
  const [result, setResult] = useState<string>('');

  const testDemoLogin = async (email: string, password: string) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('village_health_users') || '[]');
      console.log('All users:', users);
      
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      console.log('Found user:', foundUser);
      
      if (foundUser) {
        setResult(`✅ SUCCESS: Found user ${foundUser.name} (${foundUser.email})`);
      } else {
        setResult(`❌ FAILED: No user found with email ${email} and password ${password}`);
      }
    } catch (error) {
      setResult(`❌ ERROR: ${error}`);
    }
  };

  const clearData = () => {
    localStorage.removeItem('village_health_users');
    localStorage.removeItem('village_health_user');
    setResult('🗑️ All auth data cleared');
  };

  const seedAccounts = () => {
    const demoUsers = [
      {
        id: 'user_demo_asha',
        name: 'Sunita Devi',
        email: 'asha@demo.com',
        password: 'demo123',
        role: 'asha',
        phone: '+91 9876543210',
        village: 'Rampur',
        joinedAt: '2024-01-15T00:00:00.000Z',
      },
      {
        id: 'user_demo_supervisor',
        name: 'Dr. Rajesh Kumar',
        email: 'supervisor@demo.com',
        password: 'demo123',
        role: 'supervisor',
        phone: '+91 9876543211',
        village: 'District Hospital',
        joinedAt: '2023-08-10T00:00:00.000Z',
      },
      {
        id: 'user_demo_admin',
        name: 'Administrator',
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin',
        phone: '+91 9876543212',
        village: 'State Health Office',
        joinedAt: '2023-01-01T00:00:00.000Z',
      },
    ];

    localStorage.setItem('village_health_users', JSON.stringify(demoUsers));
    setResult('✅ Demo accounts seeded successfully');
  };

  const checkStorage = () => {
    const users = localStorage.getItem('village_health_users');
    const currentUser = localStorage.getItem('village_health_user');
    
    setResult(`
📊 STORAGE STATUS:
Users: ${users ? JSON.parse(users).length + ' accounts found' : 'No users found'}
Current User: ${currentUser ? 'Logged in' : 'Not logged in'}
    `);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug Panel</h1>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => testDemoLogin('asha@demo.com', 'demo123')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Test ASHA Login
            </button>
            <button onClick={() => testDemoLogin('supervisor@demo.com', 'demo123')} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Test Supervisor Login
            </button>
            <button onClick={() => testDemoLogin('admin@demo.com', 'demo123')} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Test Admin Login
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button onClick={seedAccounts} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Seed Demo Accounts
            </button>
            <button onClick={checkStorage} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Check Storage
            </button>
            <button onClick={clearData} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Clear All Data
            </button>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result || 'Click a button to test...'}</pre>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;