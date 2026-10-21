import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Check, 
  ShoppingBag, 
  CreditCard,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function NewDecisionView({ onEvaluateDecision, onDecisionCreated }) {
  const [activeTab, setActiveTab] = useState('ask'); // 'ask' or 'manual'
  const [queryText, setQueryText] = useState('');
  const [manualItem, setManualItem] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualTenure, setManualTenure] = useState(12);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presetQueries = [
    { text: "Can I buy a laptop for ₹65,000 today?", item: "Work Laptop", amt: 65000 },
    { text: "Should I book a Goa vacation for ₹28,000?", item: "Goa Vacation Trip", amt: 28000 },
    { text: "Can I purchase an iPhone 16 Pro for ₹1,19,900?", item: "iPhone 16 Pro", amt: 119900 },
    { text: "Can I buy a new two-wheeler scooter for ₹85,000?", item: "Electric Scooter", amt: 85000 },
  ];

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    if (!queryText) return;

    // Extract item and amount from query text
    const match = queryText.match(/(\d+[\d,]*)/);
    let extractedAmt = 50000;
    if (match) {
      extractedAmt = parseFloat(match[1].replace(/,/g, ''));
    }

    let itemName = "Proposed Purchase";
    if (queryText.toLowerCase().includes("laptop")) itemName = "Laptop Purchase";
    else if (queryText.toLowerCase().includes("iphone") || queryText.toLowerCase().includes("phone")) itemName = "Smartphone Purchase";
    else if (queryText.toLowerCase().includes("vacation") || queryText.toLowerCase().includes("goa") || queryText.toLowerCase().includes("trip")) itemName = "Vacation / Travel";
    else if (queryText.toLowerCase().includes("scooter") || queryText.toLowerCase().includes("car") || queryText.toLowerCase().includes("bike")) itemName = "Vehicle Purchase";

    try {
      setLoading(true);
      const res = await onEvaluateDecision({
        item_name: itemName,
        amount: extractedAmt,
        emi_months: 12
      });
      setResult(res);
      if (onDecisionCreated) onDecisionCreated();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualItem || !manualAmount) return;

    try {
      setLoading(true);
      const res = await onEvaluateDecision({
        item_name: manualItem,
        amount: parseFloat(manualAmount),
        emi_months: parseInt(manualTenure)
      });
      setResult(res);
      if (onDecisionCreated) onDecisionCreated();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '950px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
          AI Financial Decision Assistant
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Evaluate big purchases against your live balance and safety buffer. Get transparent mathematical recommendations: <strong>Pay in Full</strong> vs <strong>Smart EMI</strong> vs <strong>Wait</strong>.
        </p>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
        <button
          onClick={() => { setActiveTab('ask'); setResult(null); }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'ask' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: activeTab === 'ask' ? '#34d399' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>Just Ask (Conversational)</span>
        </button>

        <button
          onClick={() => { setActiveTab('manual'); setResult(null); }}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'manual' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: activeTab === 'manual' ? '#a78bfa' : 'var(--text-secondary)',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={16} />
          <span>Build Manually (Structured Form)</span>
        </button>
      </div>

      {/* Mode 1: Just Ask */}
      {activeTab === 'ask' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form onSubmit={handleAskSubmit} className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
              Ask Spendly Assistant
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="e.g. Can I afford to buy a laptop for ₹65,000 this month?"
                required
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  color: '#052e16',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} />
                <span>{loading ? 'Evaluating...' : 'Ask AI'}</span>
              </button>
            </div>

            {/* Quick Chips */}
            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quick Prompts:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                {presetQueries.map((pq, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQueryText(pq.text)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    {pq.text}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Mode 2: Build Manually Form */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
            Structured Decision Evaluation Form
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Item / Goal Name
              </label>
              <input
                type="text"
                value={manualItem}
                onChange={(e) => setManualItem(e.target.value)}
                placeholder="e.g. Sony Bravia OLED TV"
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Target Amount (₹)
              </label>
              <input
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="85000"
                min="1"
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

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Preferred Installment Tenure (Months)
              </label>
              <select
                value={manualTenure}
                onChange={(e) => setManualTenure(e.target.value)}
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
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={9}>9 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '11px 24px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                color: '#052e16',
                fontWeight: '700',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Crunching Numbers...' : 'Evaluate Decision'}
            </button>
          </div>
        </form>
      )}

      {/* Decision Evaluation Result Card */}
      {result && (
        <div className="glass-panel" style={{
          padding: '28px',
          borderLeft: `5px solid ${result.verdict === 'PAY_IN_FULL' ? '#10b981' : result.verdict === 'EMI' ? '#8b5cf6' : '#f43f5e'}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Recommendation Verdict
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginTop: '4px' }}>
                {result.item_name} — ₹{result.amount.toLocaleString('en-IN')}
              </h3>
            </div>

            <span className={`badge ${result.verdict === 'PAY_IN_FULL' ? 'badge-emerald' : result.verdict === 'EMI' ? 'badge-purple' : 'badge-rose'}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
              {result.verdict_label}
            </span>
          </div>

          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '14px',
            color: 'var(--text-primary)',
            lineHeight: '1.6'
          }}>
            {result.reasoning}
          </div>

          {/* 3 Outcome Comparison Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginTop: '6px' }}>
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Option 1: Pay in Full</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: result.verdict === 'PAY_IN_FULL' ? '#34d399' : '#fb7185', marginTop: '4px' }}>
                {result.verdict === 'PAY_IN_FULL' ? 'Approved (Safe)' : 'Violates Safety Buffer'}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Option 2: Smart EMI</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#a78bfa', marginTop: '4px' }}>
                {result.status_note || 'Available with low monthly burden'}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>Option 3: Wait</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b', marginTop: '4px' }}>
                Defer till 1st for salary credit
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
