import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Loader from '../components/Loader';

const HighVolumeScripts = () => {
  const loaderData = useLoaderData();

  if (!loaderData || !loaderData.scripts) {
    return <Loader message="Loading high volume scripts..." />
  }

  const { scripts } = loaderData;

  if (scripts.error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error loading scripts: {scripts.error}
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
          High Volume Scripts
        </h1>
        <p style={{ 
          fontSize: '0.95rem', 
          color: '#666',
          margin: '0.5rem 0 0 0'
        }}>
          Scripts with significantly higher volume than their 5-candle average
        </p>
      </div>

      {scripts.data && Array.isArray(scripts.data) && scripts.data.length > 0 ? (
        <div style={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
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
              <li>The latest candle is bullish (Close &gt; Open).</li>
              <li>The latest candle volume is at least 1.5x the average volume of the preceding five candles on the 5m interval.</li>
            </ul>
          </div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            <thead>
              <tr style={{
                background: 'linear-gradient(135deg, #0066cc 0%, #0052a3 100%)',
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
                  Current Volume
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Prev 5 Candles
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'right',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px'
                }}>
                  Latest Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {scripts.data.map((script, index) => {
                const isVolumeHigh = script.LatestVolume > script.AvgPrev5Volume;
                return (
                  <tr key={index} style={{
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fb',
                    borderBottom: '1px solid #e8e8e8',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f4ff';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <td style={{
                      padding: '1rem 1.5rem',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#0066cc'
                    }}>
                      {script.Symbol}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      fontSize: '0.9rem',
                      color: '#555'
                    }}>
                      {script.Sector || <span style={{ color: '#999' }}>—</span>}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'right',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      color: isVolumeHigh ? '#27ae60' : '#e74c3c'
                    }}>
                      {script.LatestVolume.toLocaleString()}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'right',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      {script.AvgPrev5Volume.toLocaleString()}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'right',
                      fontSize: '0.85rem',
                      color: '#888'
                    }}>
                      {new Date(script.LatestTimestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
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
          No scripts data available
        </div>
      )}
    </div>
  );
};

export default HighVolumeScripts;
