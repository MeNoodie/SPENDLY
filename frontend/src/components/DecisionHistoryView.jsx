import React from 'react';
import { History, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DecisionHistoryView({ history, onNewDecision }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
            Decision History
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Complete audit trail of all financial inquiries, mathematical simulations, and recommended verdicts.
          </p>
        </div>
        <button
          onClick={onNewDecision}
          style={{
            padding: '9px 16px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            color: '#052e16',
            fontWeight: '700',
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Evaluate New Item
        </button>
      </div>

      {/* History Items */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {history.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No decisions logged yet. Test out the AI assistant in "New Decision"!
          </div>
        ) : (
          history.map((dec) => {
            const isFull = dec.verdict === 'PAY_IN_FULL';
            const isEmi = dec.verdict === 'EMI';
            const isWait = dec.verdict === 'WAIT';

            return (
              <div
                key={dec.id}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderLeft: `4px solid ${isFull ? '#10b981' : isEmi ? '#8b5cf6' : '#f43f5e'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                      {dec.item_name}
                    </h3>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      ₹{dec.amount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <span className={`badge ${isFull ? 'badge-emerald' : isEmi ? 'badge-purple' : 'badge-rose'}`}>
                    {dec.verdict_label}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {dec.reasoning}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    <span>{dec.created_at ? new Date(dec.created_at).toLocaleString() : 'Just now'}</span>
                  </div>
                  {dec.status_note && (
                    <span>• {dec.status_note}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
