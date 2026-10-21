import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  Check, 
  Calendar, 
  Tag, 
  FileUp, 
  Sparkles, 
  AlertCircle,
  Home,
  CreditCard,
  ShoppingCart,
  Zap,
  Users,
  Stethoscope,
  Receipt
} from 'lucide-react';

const CATEGORIES = [
  { id: 'Rent', label: 'Rent', icon: Home, color: '#38bdf8' },
  { id: 'EMI', label: 'EMI / Loan', icon: CreditCard, color: '#818cf8' },
  { id: 'Rasan', label: 'Rasan (Groceries)', icon: ShoppingCart, color: '#34d399' },
  { id: 'Card Bill', label: 'Card Bill', icon: CreditCard, color: '#fb7185' },
  { id: 'Housekeeper', label: 'Housekeeper', icon: Users, color: '#f59e0b' },
  { id: 'Utilities', label: 'Utilities & WiFi', icon: Zap, color: '#a78bfa' },
  { id: 'Medical', label: 'Medical', icon: Stethoscope, color: '#ec4899' },
  { id: 'Other', label: 'Other', icon: Receipt, color: '#94a3b8' },
];

const getFormattedDate = (daysAhead = 7) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AddExpensesView({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense }) {
  const [activeTab, setActiveTab] = useState('manual'); // 'manual', 'upload', 'templates'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(() => getFormattedDate(7));
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !dueDate) {
      alert('Please fill all fields: Title, Category, Amount, and Due Date');
      return;
    }

    try {
      setSubmitting(true);
      await onAddExpense({
        title,
        category,
        amount: parseFloat(amount),
        due_date: dueDate,
        is_recurring: true,
        payment_status: 'unpaid'
      });
      setTitle('');
      setAmount('');
      setDueDate(getFormattedDate(7));
      setFeedbackMsg(`Successfully added ${title}! Upcoming essentials recalculated.`);
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyTemplate = (tmplTitle, tmplCategory, tmplAmount) => {
    setTitle(tmplTitle);
    setCategory(tmplCategory);
    setAmount(tmplAmount.toString());
    const now = new Date();
    now.setDate(now.getDate() + 7);
    setDueDate(now.toISOString().split('T')[0]);
  };

  const totalUnpaid = expenses
    .filter(e => e.payment_status === 'unpaid' && e.included_in_timeline)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaid = expenses
    .filter(e => e.payment_status === 'paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
          Add Expenses & Upcoming Bills
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Ingest manual obligations (Rent, EMI, Rasan, Bills) to automatically compute your dashboard essentials and safe spending.
        </p>
      </div>

      {feedbackMsg && (
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
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* 3 Ingestion Mode Switcher (from idea.excalidraw) */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
        <button
          onClick={() => setActiveTab('manual')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'manual' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: activeTab === 'manual' ? '#34d399' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <PlusCircle size={16} />
          <span>1. Add Manually (Form)</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'templates' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activeTab === 'templates' ? '#a78bfa' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>2. Quick Presets (Rent, Rasan, EMI)</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'upload' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'upload' ? '#38bdf8' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileUp size={16} />
          <span>3. Upload Bill / OCR (Phase 4)</span>
        </button>
      </div>

      {/* Tab 1: Manual Input Form */}
      {activeTab === 'manual' && (
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '18px' }}>
            New Essential Bill / Obligation
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Bill Description / Merchant
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Flat Rent, Car EMI, Groceries"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#1a2234',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id} style={{ background: '#111622', color: '#fff' }}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="22000"
                min="1"
                step="any"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Due Date */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Due Date
                </label>
                <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
                  {dueDate || 'Select date'}
                </span>
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onClick={(e) => {
                  try {
                    if (e.target.showPicker) e.target.showPicker();
                  } catch (err) {}
                }}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  colorScheme: 'dark',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
              {/* Quick Date Shortcuts */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setDueDate(getFormattedDate(0))}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    background: dueDate === getFormattedDate(0) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: dueDate === getFormattedDate(0) ? '#34d399' : 'var(--text-muted)',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getFormattedDate(7))}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    background: dueDate === getFormattedDate(7) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: dueDate === getFormattedDate(7) ? '#34d399' : 'var(--text-muted)',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getFormattedDate(15))}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    background: dueDate === getFormattedDate(15) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: dueDate === getFormattedDate(15) ? '#34d399' : 'var(--text-muted)',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  +15 Days
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getFormattedDate(30))}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-subtle)',
                    background: dueDate === getFormattedDate(30) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: dueDate === getFormattedDate(30) ? '#34d399' : 'var(--text-muted)',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  +1 Month
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
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
              <PlusCircle size={16} />
              <span>{submitting ? 'Adding...' : 'Add Expense & Recalculate'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Quick Presets */}
      {activeTab === 'templates' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '14px' }}>
            Click any template to auto-populate the form:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {[
              { title: 'Apartment Rent', cat: 'Rent', amt: 24000 },
              { title: 'Monthly Rasan & Groceries', cat: 'Rasan', amt: 7500 },
              { title: 'HDFC Credit Card Bill', cat: 'Card Bill', amt: 16500 },
              { title: 'Car EMI Payment', cat: 'EMI', amt: 12500 },
              { title: 'Housekeeper & Maid Salary', cat: 'Housekeeper', amt: 3500 },
              { title: 'Airtel WiFi & Electricity', cat: 'Utilities', amt: 3200 },
            ].map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleApplyTemplate(t.title, t.cat, t.amt);
                  setActiveTab('manual');
                }}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#ffffff' }}>{t.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.cat}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  ₹{t.amt.toLocaleString('en-IN')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Upload Preview Placeholder */}
      {activeTab === 'upload' && (
        <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <FileUp size={24} color="var(--accent-cyan)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Multi-Modal Bill Ingestion (Hackathon Module)</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 20px auto' }}>
            Upload Bank statement PDFs, CSVs, or UPI screenshots. Mesh Vision API automatically parses transaction dates, amounts, and assigns categories without manual input.
          </p>
          <div style={{
            border: '2px dashed var(--border-subtle)',
            borderRadius: '12px',
            padding: '30px',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'inline-block'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drag & Drop PDF / PNG receipt here or browse</span>
          </div>
        </div>
      )}

      {/* Current Ingested Expenses List & Real-time Totals */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
            Active Expenses & Bills ({expenses.length})
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#fb7185' }}>Unpaid: ₹{totalUnpaid.toLocaleString('en-IN')}</span>
            <span style={{ color: '#34d399' }}>Paid: ₹{totalPaid.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {expenses.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No expenses recorded yet. Use the form above to add your first bill!
            </div>
          ) : (
            expenses.map(expense => {
              const isPaid = expense.payment_status === 'paid';
              const isIncluded = expense.included_in_timeline;

              return (
                <div
                  key={expense.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: isPaid ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    opacity: !isIncluded ? 0.45 : isPaid ? 0.65 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: 'var(--accent-cyan)'
                    }}>
                      {expense.category}
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff', textDecoration: isPaid ? 'line-through' : 'none' }}>
                        {expense.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Due on {expense.due_date}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: isPaid ? 'var(--text-muted)' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      ₹{expense.amount.toLocaleString('en-IN')}
                    </div>

                    {/* Timeline Include Toggle Switch (from idea.excalidraw) */}
                    <button
                      type="button"
                      onClick={() => onUpdateExpense(expense.id, { included_in_timeline: !isIncluded })}
                      title="Include / Exclude from Dashboard Forecast"
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        background: isIncluded ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: isIncluded ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {isIncluded ? 'Included in Forecast' : 'Excluded'}
                    </button>

                    {/* Paid / Unpaid Toggle */}
                    <button
                      type="button"
                      onClick={() => onUpdateExpense(expense.id, { payment_status: isPaid ? 'unpaid' : 'paid' })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: isPaid ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-subtle)',
                        background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: isPaid ? '#34d399' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {isPaid ? <Check size={12} /> : null}
                      <span>{isPaid ? 'Paid' : 'Mark Paid'}</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => onDeleteExpense(expense.id)}
                      title="Delete Expense"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#fb7185'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
