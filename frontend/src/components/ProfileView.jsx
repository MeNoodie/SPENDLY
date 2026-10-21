import React, { useState, useEffect } from 'react';
import { 
  UserCircle2, 
  ShieldCheck, 
  Wallet, 
  Banknote, 
  Calendar, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function ProfileView({ userProfile, onUpdateProfile, upcomingEssentialsTotal }) {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [salaryDay, setSalaryDay] = useState(1);
  const [currentSavings, setCurrentSavings] = useState('');
  const [secureSavings, setSecureSavings] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setSalary(userProfile.salary !== undefined && userProfile.salary !== null ? userProfile.salary.toString() : '0');
      setSalaryDay(userProfile.salary_day || 1);
      setCurrentSavings(userProfile.current_savings !== undefined && userProfile.current_savings !== null ? userProfile.current_savings.toString() : '0');
      setSecureSavings(userProfile.secure_savings !== undefined && userProfile.secure_savings !== null ? userProfile.secure_savings.toString() : '0');
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onUpdateProfile({
        name,
        salary: parseFloat(salary),
        salary_day: parseInt(salaryDay),
        current_savings: parseFloat(currentSavings),
        secure_savings: parseFloat(secureSavings)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const parsedCurrent = parseFloat(currentSavings) || 0;
  const parsedSecure = parseFloat(secureSavings) || 0;
  const essentials = upcomingEssentialsTotal || 0;
  const previewSafeToSpend = parsedCurrent - essentials - parsedSecure;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '850px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
          Profile & Financial Parameters
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Configure your baseline financial facts: Monthly Salary, Total Available Savings, and your Minimum Protected Safety Reserve.
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} />
          <span>Profile updated! Dashboard live numbers refreshed.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* User ID Badge Card */}
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#a5b4fc', fontWeight: '700' }}>
              User ID (Personal Data Scope)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: '800',
                color: '#ffffff',
                background: 'rgba(0,0,0,0.4)',
                padding: '2px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {userProfile?.user_code || userProfile?.user_id || 'userSP01'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {userProfile?.email || ''}
              </span>
            </div>
          </div>
          <div style={{
            fontSize: '11px',
            color: '#34d399',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={13} />
            <span>Isolated Financial Scope Active</span>
          </div>
        </div>

        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Full Name / Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          {/* Monthly Salary */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Banknote size={15} color="var(--accent-emerald)" />
              <span>Monthly Salary (₹)</span>
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              min="0"
              required
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Net take-home credited each month
            </span>
          </div>

          {/* Salary Credit Day */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Calendar size={15} color="var(--accent-cyan)" />
              <span>Salary Credit Day</span>
            </label>
            <input
              type="number"
              value={salaryDay}
              onChange={(e) => setSalaryDay(e.target.value)}
              min="1"
              max="31"
              required
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              e.g., 1st or 30th of the month
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
          {/* Current Savings (Total Available) */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <Wallet size={15} color="var(--accent-cyan)" />
              <span>Current Savings / Balance (₹)</span>
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              min="0"
              required
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Your bank savings + liquid balance
            </span>
          </div>

          {/* Secure Savings (Preferred Minimum Safety Balance) */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <ShieldCheck size={15} color="#34d399" />
              <span>Secure Savings (Safety Reserve) (₹)</span>
            </label>
            <input
              type="number"
              value={secureSavings}
              onChange={(e) => setSecureSavings(e.target.value)}
              min="0"
              required
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Emergency reserve you never want to breach
            </span>
          </div>
        </div>

        {/* Live Calculation Preview Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '18px 22px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Live Computed Safe to Spend
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              ₹{parsedCurrent.toLocaleString('en-IN')} (Current) - ₹{essentials.toLocaleString('en-IN')} (Upcoming Essentials) - ₹{parsedSecure.toLocaleString('en-IN')} (Secure)
            </div>
          </div>

          <div style={{
            fontSize: '22px',
            fontWeight: '800',
            fontFamily: 'var(--font-mono)',
            color: previewSafeToSpend > 0 ? '#34d399' : '#fb7185'
          }}>
            = ₹{previewSafeToSpend.toLocaleString('en-IN')}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '12px 26px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              color: '#052e16',
              fontWeight: '700',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)'
            }}
          >
            {saving ? 'Updating...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
