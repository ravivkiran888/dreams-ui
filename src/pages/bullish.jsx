import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Loader from '../components/Loader';

const BullishSignals = () => {
  const loaderData = useLoaderData();

  if (!loaderData || !loaderData.signals) {
    return <Loader message="Loading bullish signals..." />
  }

  const { signals } = loaderData;

  if (signals.error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading signals: {signals.error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Title Section */}
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e0e0e0' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#1a1a1a',
          margin: '0',
          letterSpacing: '-0.5px'
        }}>
          Bullish Signals
        </h1>
        <p style={{ 
          fontSize: '0.95rem', 
          color: '#666',
          margin: '0.5rem 0 0 0'
        }}>
          Stocks showing bullish technical indicators
        </p>
      </div>

      {signals.data && Array.isArray(signals.data) && signals.data.length > 0 ? (
        <div style={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                color: 'white'
              }}>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Symbol
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Sector
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Last Price
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Bullish Score
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Volume Signal
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Price Strength
                </th>
              </tr>
            </thead>
            <tbody>
              {signals.data.map((signal, index) => (
                <tr key={index} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8faf7',
                  borderBottom: '1px solid #e8e8e8',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f8f4';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(39, 174, 96, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8faf7';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <td style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    color: '#27ae60'
                  }}>
                    {signal.symbol}
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    fontSize: '0.9rem',
                    color: '#555'
                  }}>
                    {signal.sector || <span style={{ color: '#999' }}>—</span>}
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'right',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#1a1a1a'
                  }}>
                    ₹{signal.lastPrice.toFixed(2)}
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#27ae60'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#d5f4e6',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      {signal.bullishScore}/10
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: signal.volumeCandleSignal ? '#27ae60' : '#ecf0f1',
                      color: signal.volumeCandleSignal ? 'white' : '#7f8c8d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {signal.volumeCandleSignal ? '✓' : '✕'}
                    </span>
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: signal.priceStrengthSignal ? '#27ae60' : '#ecf0f1',
                      color: signal.priceStrengthSignal ? 'white' : '#7f8c8d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {signal.priceStrengthSignal ? '✓' : '✕'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          color: '#999',
          fontSize: '1rem'
        }}>
          No bullish signals available
        </div>
      )}
    </div>
  );
};

export default BullishSignals;
