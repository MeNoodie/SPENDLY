import React from 'react';
import { 
  CalendarClock, 
  CheckCircle2, 
  ToggleLeft, 
  ToggleRight, 
  AlertCircle,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Banknote
} from 'lucide-react';

const formatMonth = (dateStr) => {
  if (!dateStr) return '---';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(parts[1], 10) - 1] || '---';
  }
  return '---';
};

const formatDay = (dateStr) => {
  if (!dateStr) return '--';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    return parseInt(parts[2], 10) || '--';
  }
  return '--';
};

export default function TimelineView({ timelineItems, currentSavings, onToggleInclude, onTogglePaid }) {
  const sortedItems = [...timelineItems].sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
          Chronological Financial Timeline
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Interactive "What-If" timeline. Toggle the <strong>Include</strong> switch to simulate excluding an obligation and watch your projected balance update.
        </p>
      </div>

      {/* Timeline List */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {sortedItems.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No timeline events recorded. Add bills in "Add Expenses" to populate the timeline!
          </div>
        ) : (
          sortedItems.map((event, idx) => {
            const isPaid = event.payment_status === 'paid';
            const isIncluded = event.included_in_timeline;

            return (
              <div
                key={event.id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: isPaid ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  opacity: !isIncluded ? 0.45 : isPaid ? 0.65 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Left: Date + Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(139, 92, 246, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {formatMonth(event.due_date)}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                      {formatDay(event.due_date)}
                    </span>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', textDecoration: isPaid ? 'line-through' : 'none' }}>
                        {event.title}
                      </span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'var(--accent-cyan)'
                      }}>
                        {event.category}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      Due on {event.due_date} • {isPaid ? 'Payment Confirmed' : 'Payment Pending'}
                    </div>
                  </div>
                </div>

                {/* Right: Amount + Projection + Toggles */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: isPaid ? 'var(--text-muted)' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      - ₹{event.amount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Balance after: ₹{event.projected_balance_after.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Include in Forecast Simulation Toggle */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => onToggleInclude(event.id, !isIncluded)}
                      style={{
                        background: isIncluded ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                        border: isIncluded ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                        color: isIncluded ? '#34d399' : 'var(--text-muted)',
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {isIncluded ? 'Included in Forecast' : 'Excluded (What-if)'}
                    </button>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {isIncluded ? 'Affects Safe Spend' : 'Ignored in Safe Spend'}
                    </span>
                  </div>

                  {/* Mark Paid Toggle */}
                  <button
                    type="button"
                    onClick={() => onTogglePaid(event.id, isPaid ? 'unpaid' : 'paid')}
                    style={{
                      background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      border: isPaid ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                      color: isPaid ? '#34d399' : 'var(--text-secondary)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {isPaid ? <CheckCircle2 size={14} /> : null}
                    <span>{isPaid ? 'Paid' : 'Mark as Paid'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
