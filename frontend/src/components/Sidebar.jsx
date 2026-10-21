import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  CalendarClock, 
  Sparkles, 
  History, 
  UserCircle2, 
  ShieldCheck, 
  TrendingUp,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, userProfile, user, upcomingCount, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Add Expenses', icon: ReceiptText, badge: upcomingCount ? `${upcomingCount}` : null },
    { id: 'timeline', label: 'Financial Timeline', icon: CalendarClock },
    { id: 'decisions', label: 'New Decision', icon: Sparkles },
    { id: 'history', label: 'Decision History', icon: History },
    { id: 'profile', label: 'Profile & Balance', icon: UserCircle2 },
  ];

  const displayName = user?.name || userProfile?.name || 'User';
  const displayEmail = user?.email || userProfile?.email || '';
  const displayUserCode = user?.user_code || userProfile?.user_code || user?.user_id || userProfile?.user_id || 'userSP01';

  return (
    <aside style={{
      width: '270px',
      minWidth: '270px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: 'rgba(15, 20, 32, 0.95)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      gap: '20px',
      zIndex: 50
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        }}>
          <TrendingUp size={22} color="#ffffff" strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#ffffff' }}>
            spendly<span style={{ color: 'var(--accent-emerald)' }}>.</span>
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Smart Financial Engine</p>
        </div>
      </div>

      {/* User Greeting Card (from Excalidraw) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '14px',
          color: '#ffffff',
          flexShrink: 0
        }}>
          {displayName.substring(0, 2).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hello,</span>
            <span style={{
              background: 'rgba(99, 102, 241, 0.18)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#a5b4fc',
              fontSize: '10px',
              fontWeight: '700',
              padding: '1px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              {displayUserCode}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {displayName}
          </div>
          {displayEmail && (
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {displayEmail}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', padding: '0 10px 4px 10px' }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: isActive ? '#34d399' : 'var(--text-secondary)',
                fontWeight: isActive ? '600' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  background: 'var(--accent-emerald)',
                  color: '#052e16',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 7px',
                  borderRadius: '999px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Safety Buffer Indicator Footer */}
      <div style={{
        padding: '12px 14px',
        borderRadius: '10px',
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '12px', fontWeight: '700' }}>
          <ShieldCheck size={15} />
          <span>Buffer Protection</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          ₹{userProfile?.secure_savings ? userProfile.secure_savings.toLocaleString('en-IN') : '0'} locked reserve.
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)',
          color: 'var(--text-muted)',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#fb7185';
          e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <LogOut size={15} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}
