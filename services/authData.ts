// Demo authentication data for the Village Health Monitor app

export const seedDemoAccounts = () => {
  try {
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

    // Get existing users
    let existingUsers = [];
    try {
      const stored = localStorage.getItem('village_health_users');
      existingUsers = stored ? JSON.parse(stored) : [];
    } catch (e) {
      existingUsers = [];
    }

    // Check if demo accounts already exist
    const demoEmails = demoUsers.map(u => u.email);
    const existingDemoUsers = existingUsers.filter((u: any) => demoEmails.includes(u.email));

    // Add missing demo accounts
    const missingDemoUsers = demoUsers.filter(demoUser => 
      !existingUsers.some((existingUser: any) => existingUser.email === demoUser.email)
    );

    if (missingDemoUsers.length > 0) {
      const updatedUsers = [...existingUsers, ...missingDemoUsers];
      localStorage.setItem('village_health_users', JSON.stringify(updatedUsers));
      console.log(`${missingDemoUsers.length} demo accounts seeded successfully`);
    } else {
      console.log('Demo accounts already exist');
    }

    // Always log available demo accounts for debugging
    console.log('Available demo accounts:', demoUsers.map(u => ({ email: u.email, password: u.password })));
  } catch (error) {
    console.error('Error seeding demo accounts:', error);
  }
};