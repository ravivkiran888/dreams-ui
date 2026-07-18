import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Loader from '../components/Loader';

const formatLocalTimestamp = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  const parsedDate = new Date(timestamp);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium'  }).format(parsedDate);
};

const BullishSignals = () => {
  const loaderData = useLoaderData();

  if (!loaderData || !loaderData.signals) {
    return <Loader message="Loading bullish signals..." />
  }

  const { signals } = loaderData;
  const signalsList = Array.isArray(signals.data)
    ? signals.data
    : Array.isArray(signals.data?.data)
      ? signals.data.data
      : [];

  const refreshedAtValue =
    signals.refreshedAt ??
    signals.data?.refreshedAt ??
    signalsList[0]?.refreshedAt ??
    signalsList[0]?.RefreshedAt;

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedRefreshedAt = formatLocalTimestamp(refreshedAtValue);

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

      {signalsList.length > 0 ? (
        <div style={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {formattedRefreshedAt ? (
            <div style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#f7f9fb',
              color: '#4a4a4a',
              fontSize: '0.9rem',
              borderBottom: '1px solid #e8e8e8'
            }}>
              Refreshed at: {formattedRefreshedAt}
            </div>
          ) : null}
          <div style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#f7f9fb',
            borderBottom: '1px solid #e8e8e8',
            color: '#334155'
          }}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              marginBottom: '0.35rem'
            }}>
              Screening Criteria
            </div>
            <ul style={{
              margin: '0',
              paddingLeft: '1.1rem',
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              <li>Momentum: day change percentage is above 0.8.</li>
              <li>Price strength: last price is greater than average price.</li>
              <li>Demand: total buy quantity is greater than total sell quantity, and bid quantity is greater than offer quantity.</li>
              <li>Depth: buy-side order book depth is greater than sell-side depth.</li>
              <li>Volume candle: current candle has significant volume.</li>
            </ul>
          </div>
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
              {signalsList.map((signal, index) => (
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
                      {signal.bullishScore}/5
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
