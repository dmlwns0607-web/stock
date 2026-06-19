'use client';
import { useState } from 'react';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!ticker.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch (e) {
      setError('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#111', color: '#fff', borderRadius: '12px' }}>
      <h2>📊 친구들과 함께 쓰는 AI 주식 분석기</h2>
      <p style={{ color: '#aaa' }}>미국 주식 티커(AAPL, NVDA 등)를 입력하세요.</p>
      <div style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
        <input 
          type="text" 
          placeholder="예: AAPL" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)} 
          style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #333', background: '#222', color: '#fff' }}
        />
        <button onClick={handleSearch} disabled={loading} style={{ padding: '12px 24px', borderRadius: '6px', border: 'none', background: '#0070f3', color: '#fff', cursor: 'pointer' }}>
          {loading ? '분석중...' : '분석하기'}
        </button>
      </div>
      {error && <div style={{ color: '#ff4d4d' }}>⚠️ {error}</div>}
      {result && (
        <div style={{ background: '#222', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>{result.name} ({result.symbol})</h3>
          <p><b>현재가:</b> ${result.price} ({result.changePercent})</p>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#ddd', marginTop: '15px' }}>{result.report}</div>
        </div>
      )}
    </div>
  );
}
