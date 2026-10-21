import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AddExpensesView from './components/AddExpensesView';
import TimelineView from './components/TimelineView';
import NewDecisionView from './components/NewDecisionView';
import DecisionHistoryView from './components/DecisionHistoryView';
import ProfileView from './components/ProfileView';
import AuthModal from './components/AuthModal';

import { 
  getToken,
  setToken,
  getStoredUser,
  setStoredUser,
  fetchMe,
  fetchDashboard, 
  fetchProfile, 
  updateProfile, 
  fetchExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense, 
  evaluateDecision, 
  fetchDecisionHistory,
  creditSalary
} from './api';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [token, setTokenState] = useState(getToken());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    setToken(null);
    setStoredUser(null);
    setUser(null);
    setTokenState(null);
    setDashboardData(null);
    setUserProfile(null);
    setExpenses([]);
    setHistory([]);
  };

  const loadAllData = async () => {
    if (!getToken()) return;

    try {
      setLoading(true);
      setError(null);
      const [dash, prof, exp, hist] = await Promise.all([
        fetchDashboard(),
        fetchProfile(),
        fetchExpenses(),
        fetchDecisionHistory()
      ]);
      setDashboardData(dash);
      setUserProfile(prof);
      setExpenses(exp);
      setHistory(hist);
      if (prof?.user_code && (!user?.user_code || user.user_code !== prof.user_code)) {
        const updated = { ...(user || {}), user_id: prof.user_code, user_code: prof.user_code, name: prof.name || user?.name };
        setUser(updated);
        setStoredUser(updated);
      }
    } catch (err) {
      console.error(err);
      if (err.message === 'UNAUTHORIZED' || err.message === 'Session expired') {
        handleLogout();
      } else {
        setError(err.message || 'Failed to connect to Spendly API. Make sure backend is running on port 8000.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setTokenState(getToken());
  };

  // Handlers for real-time reactivity
  const handleAddExpense = async (payload) => {
    await addExpense(payload);
    await loadAllData();
  };

  const handleUpdateExpense = async (id, payload) => {
    await updateExpense(id, payload);
    await loadAllData();
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
    await loadAllData();
  };

  const handleUpdateProfile = async (payload) => {
    await updateProfile(payload);
    await loadAllData();
  };

  const handleEvaluateDecision = async (payload) => {
    const res = await evaluateDecision(payload);
    await loadAllData();
    return res;
  };

  const handleQuickTogglePaid = async (id, newStatus) => {
    await updateExpense(id, { payment_status: newStatus });
    await loadAllData();
  };

  const handleCreditSalary = async () => {
    try {
      await creditSalary();
      await loadAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  const upcomingCount = expenses.filter(e => e.payment_status === 'unpaid' && e.included_in_timeline).length;
  const upcomingEssentialsTotal = dashboardData?.current_picture?.upcoming_essentials || 0;

  // If not logged in, render the Auth Modal
  if (!token) {
    return <AuthModal onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userProfile={userProfile}
        user={user} 
        upcomingCount={upcomingCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', minHeight: '100vh' }}>
        
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '24px',
            color: '#fb7185',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button
              onClick={loadAllData}
              style={{
                background: '#fb7185',
                color: '#1e1e1e',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            dashboardData={dashboardData} 
            loading={loading} 
            onRefresh={loadAllData} 
            onQuickTogglePaid={handleQuickTogglePaid}
            onCreditSalary={handleCreditSalary}
            onNavigate={setActiveTab}
          />
        )}

        {/* Tab 2: Add Expenses */}
        {activeTab === 'expenses' && (
          <AddExpensesView 
            expenses={expenses} 
            onAddExpense={handleAddExpense} 
            onUpdateExpense={handleUpdateExpense} 
            onDeleteExpense={handleDeleteExpense} 
          />
        )}

        {/* Tab 3: Timeline */}
        {activeTab === 'timeline' && (
          <TimelineView 
            timelineItems={dashboardData?.next_few_weeks || []} 
            currentSavings={dashboardData?.current_picture?.current_savings || 0}
            onToggleInclude={(id, val) => handleUpdateExpense(id, { included_in_timeline: val })}
            onTogglePaid={handleQuickTogglePaid}
          />
        )}

        {/* Tab 4: New Decision */}
        {activeTab === 'decisions' && (
          <NewDecisionView 
            onEvaluateDecision={handleEvaluateDecision} 
            onDecisionCreated={loadAllData}
          />
        )}

        {/* Tab 5: Decision History */}
        {activeTab === 'history' && (
          <DecisionHistoryView 
            history={history} 
            onNewDecision={() => setActiveTab('decisions')}
          />
        )}

        {/* Tab 6: Profile & Balance */}
        {activeTab === 'profile' && (
          <ProfileView 
            userProfile={userProfile} 
            onUpdateProfile={handleUpdateProfile} 
            upcomingEssentialsTotal={upcomingEssentialsTotal}
          />
        )}
      </main>
    </div>
  );
}
