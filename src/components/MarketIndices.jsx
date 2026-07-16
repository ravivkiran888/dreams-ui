import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const MarketIndices = ({ data = [], error = null }) => {
  if (error) {
    return (
      <div style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '2vh'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>Error Loading Sectors</h2>
        
      </div>
    )
  }

  if (data.length === 0 && !error ) {
    return (
      <div style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: '0.5vh'
      }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '1rem' }}>No Market Indices Available</h2>
        
      </div>
    )
  }

  return (
    <div className="market-indices" style={{ padding: '4px' }}>
      <h6 className="mb-1" style={{ fontWeight: 'bold' }}>Market Indices</h6>
      <Row xs={4} sm={5} lg={6} className="g-1">
        {data.map((index) => (
          <Col key={index.sector}>
            <Card className={`h-100 ${index.dayChange >= 0 ? 'border-success' : 'border-danger'}`} style={{ minHeight: '70px', borderWidth: '1px' }}>
              <Card.Body className="p-1" style={{ padding: '4px' }}>
                <Card.Title className="text-truncate" style={{ fontSize: '0.75rem', marginBottom: '2px', fontWeight: 'bold' }}>{index.name}</Card.Title>
                <Card.Text className={`mb-0 ${index.dayChange >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {index.dayChange >= 0 ? '+' : ''}{index.dayChange}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MarketIndices;
