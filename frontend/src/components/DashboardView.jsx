import React from 'react';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Wallet,
  Calendar,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

export default function DashboardView({
  dashboardData,
  loading,
  onRefresh,
  onQuickTogglePaid,
  onCreditSalary,
  onNavigate
}) {
  if (loading || !dashboardData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--accent-emerald)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span>Calculating live financial picture...</span>
        </div>
      </div>
    );
  }

  const { safe_to_spend_today, current_picture, next_few_weeks, recent_decisions, user_name, user_code } = dashboardData;

  const totalSpendings = current_picture.total_spendings ?? ((current_picture.paid_bills_total || 0) + (current_picture.upcoming_essentials || 0));
  const remainingCash = current_picture.remaining_cash_balance ?? Math.max(0, current_picture.current_savings - (current_picture.paid_bills_total || 0));

  const isHealthy = safe_to_spend_today > 15000;
  const isTight = safe_to_spend_today > 0 && safe_to_spend_today <= 15000;
  const isDanger = safe_to_spend_today <= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Top Banner / Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
              Financial Health Overview
            </h2>
            {user_code && (
              <span style={{
                background: 'rgba(99, 102, 241, 0.18)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#a5b4fc',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '6px',
                fontFamily: 'monospace'
              }}>
                {user_code}
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Real-time balance calculations derived directly from your profile and active bills.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {current_picture.salary > 0 && (
            <button
              onClick={onCreditSalary}
              title="Credit your monthly salary into active balance"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.14)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '10px',
                padding: '10px 16px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.14)'}
            >
              <TrendingUp size={16} />
              <span>Credit Salary (+₹{current_picture.salary.toLocaleString('en-IN')})</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('decisions')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              color: '#052e16',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Sparkles size={16} />
            <span>New Decision</span>
          </button>
        </div>
      </div>

      {/* 1. HERO CARD: Safe to Spend Today (Matching idea.excalidraw) */}
      <div className={`glass-panel ${isHealthy ? 'glow-emerald' : ''}`} style={{
        padding: '30px',
        position: 'relative',
        overflow: 'hidden',
        background: isDanger
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(18, 24, 38, 0.95) 100%)'
          : isTight
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(18, 24, 38, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(18, 24, 38, 0.95) 100%)',
        border: `1px solid ${isDanger ? 'rgba(244, 63, 94, 0.3)' : isTight ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className={`badge ${isDanger ? 'badge-rose' : isTight ? 'badge-amber' : 'badge-emerald'}`}>
                {isDanger ? '⚠️ Safety Buffer Breached' : isTight ? '⚡ Tight Spending Margin' : '✅ Optimal Spending Buffer'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Formula: Balance - Total Spendings - Reserve</span>
            </div>

            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Safe to spend Today
            </div>

            <div style={{ fontSize: '46px', fontWeight: '800', color: '#ffffff', letterSpacing: '-1.5px', margin: '8px 0', fontFamily: 'var(--font-mono)' }}>
              ₹{safe_to_spend_today.toLocaleString('en-IN')}
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Protected after reserving <strong>₹{current_picture.secure_savings.toLocaleString('en-IN')}</strong> and deducting <strong>₹{totalSpendings.toLocaleString('en-IN')}</strong> total spendings.</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            minWidth: '260px'
          }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Formula Breakdown
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Balance:</span>
                <span style={{ color: '#ffffff' }}>+ ₹{current_picture.current_savings.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#fb7185' }}>Total Spendings:</span>
                <span style={{ color: '#fb7185' }}>- ₹{totalSpendings.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>• Paid Expenses:</span>
                <span style={{ color: 'var(--text-muted)' }}>₹{(current_picture.paid_bills_total || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>• Upcoming Due:</span>
                <span style={{ color: 'var(--text-muted)' }}>₹{current_picture.upcoming_essentials.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#38bdf8' }}>Preferred Minimum:</span>
                <span style={{ color: '#38bdf8' }}>- ₹{current_picture.secure_savings.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                <span style={{ color: '#34d399' }}>Safe to Spend:</span>
                <span style={{ color: '#34d399' }}>= ₹{safe_to_spend_today.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CURRENT PICTURE WIDGET (4-column layout) */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--accent-cyan)" />
          <span>Current Picture</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>

          {/* Card A: Current Balance */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Balance</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={16} color="var(--accent-cyan)" />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              ₹{current_picture.current_savings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Remaining Cash: ₹{remainingCash.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Card B: Total Spendings */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Spendings</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} color="#f87171" />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
              ₹{totalSpendings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Paid: ₹{(current_picture.paid_bills_total || 0).toLocaleString('en-IN')} | Due: ₹{current_picture.upcoming_essentials.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Card C: Upcoming Essentials */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upcoming Due</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertTriangle size={16} color="#fb7185" />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#fb7185', fontFamily: 'var(--font-mono)' }}>
              ₹{current_picture.upcoming_essentials.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Unpaid essential bills due
            </div>
          </div>

          {/* Card D: Preferred Minimum Balance */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Preferred Minimum</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="#34d399" />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              ₹{current_picture.secure_savings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Safety buffer (Locked reserve)
            </div>
          </div>

        </div>
      </div>

      {/* 3. NEXT FEW WEEKS (Timeline Strip from idea.excalidraw) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--accent-purple)" />
            <span>Next Few Weeks (Upcoming Obligations)</span>
          </div>
          <button
            onClick={() => onNavigate('expenses')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-emerald)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Manage Bills</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          {next_few_weeks.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No upcoming bills found. Add one in "Add Expenses"!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {next_few_weeks.map((item) => {
                const isPaid = item.payment_status === 'paid';
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: isPaid ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      opacity: isPaid ? 0.6 : 1,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isPaid ? '#34d399' : '#a78bfa',
                        fontWeight: '700',
                        fontSize: '12px'
                      }}>
                        {item.category.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', textDecoration: isPaid ? 'line-through' : 'none' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span>Due: {item.due_date}</span>
                          <span>•</span>
                          <span style={{ color: 'var(--accent-cyan)' }}>Category: {item.category}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          ₹{item.amount.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Left after: ₹{item.projected_balance_after.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={() => onQuickTogglePaid(item.id, isPaid ? 'unpaid' : 'paid')}
                        title={isPaid ? "Mark as Unpaid" : "Mark as Paid"}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isPaid ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                          background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: isPaid ? '#34d399' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isPaid ? <Check size={14} /> : null}
                        <span>{isPaid ? 'Paid' : 'Mark Paid'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. RECENT DECISIONS (from idea.excalidraw) */}
      <div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-emerald)" />
          <span>Recent AI Financial Decisions</span>
        </div>

        {(!recent_decisions || recent_decisions.length === 0) ? (
          <div className="glass-panel" style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={22} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>No Financial Decisions Yet</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: '1.5' }}>
              Evaluate your first purchase (e.g. Laptop, Phone, Trip, EMI) to test whether it fits your budget and safety buffer.
            </div>
            <button
              onClick={() => onNavigate('decisions')}
              style={{
                marginTop: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Evaluate First Purchase
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {recent_decisions.map((dec) => {
              const isEmi = dec.verdict === 'EMI';
              const isWait = dec.verdict === 'WAIT';
              const isFull = dec.verdict === 'PAY_IN_FULL';

              return (
                <div 
                  key={dec.id}
                  className="glass-panel" 
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderTop: `3px solid ${isFull ? '#10b981' : isEmi ? '#8b5cf6' : '#f59e0b'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                        {dec.item_name}
                      </h4>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                        ₹{dec.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <span className={`badge ${isFull ? 'badge-emerald' : isEmi ? 'badge-purple' : 'badge-amber'}`}>
                      {dec.verdict_label}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {dec.reasoning}
                  </p>

                  {dec.status_note && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} />
                      <span>{dec.status_note}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
