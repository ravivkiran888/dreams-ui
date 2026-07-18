import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { clearSelectedSector, setSelectedSector } from '../store/slices/marketIndicesSlice';

const getTimestampFromItem = (item) => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const timestampValue =
    item.timestamp ??
    item.Timestamp ??
    item.latestTimestamp ??
    item.LatestTimestamp ??
    item.updatedAt ??
    item.createdAt;

  return typeof timestampValue === 'string' && timestampValue.trim() ? timestampValue : null;
};

const formatUserTimezoneTimestamp = (timestamp) => {
  if (!timestamp) {
    return null;
  }

  const parsedDate = new Date(timestamp);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(parsedDate);
};

const MarketIndices = ({ data = [], error = null }) => {
  const dispatch = useDispatch();
  const selectedSector = useSelector((state) => state.marketIndices.selectedSector);

  const sectorTimestamp = formatUserTimezoneTimestamp(
    data.map(getTimestampFromItem).find(Boolean)
  );

  const handleSectorClick = (sector) => {
    if (!sector) {
      return;
    }

    if (selectedSector === sector) {
      dispatch(clearSelectedSector());
      return;
    }

    dispatch(setSelectedSector(sector));
  };

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

  if (data.length === 0) {
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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1">
        <h6 className="mb-0" style={{ fontWeight: 'bold' }}>Market Indices</h6>
        <div className="d-flex align-items-center gap-2">
          {selectedSector ? (
            <button
              type="button"
              onClick={() => dispatch(clearSelectedSector())}
              style={{
                border: '1px solid #d0d7de',
                borderRadius: '999px',
                backgroundColor: '#ffffff',
                color: '#334155',
                padding: '2px 10px',
                fontSize: '0.75rem',
                lineHeight: 1.5,
              }}
            >
              Clear: {selectedSector}
            </button>
          ) : null}
          {sectorTimestamp ? (
            <small className="text-muted">
              As of {sectorTimestamp}
            </small>
          ) : null}
        </div>
      </div>
      <Row xs={4} sm={5} lg={6} className="g-1">
        {data.map((index) => {
          const sector = (index.sector ?? index.name ?? '').trim();
          const isSelected = Boolean(sector) && selectedSector === sector;

          return (
          <Col key={index.sector ?? index.name}>
            <Card
              onClick={() => handleSectorClick(sector)}
              className={`h-100 ${isSelected ? 'border-primary' : index.dayChange >= 0 ? 'border-success' : 'border-danger'}`}
              style={{
                minHeight: '70px',
                borderWidth: isSelected ? '2px' : '1px',
                cursor: sector ? 'pointer' : 'default',
                boxShadow: isSelected ? '0 0 0 2px rgba(13, 110, 253, 0.15)' : 'none',
              }}
            >
              <Card.Body className="p-1" style={{ padding: '4px' }}>
                <Card.Title className="text-truncate" style={{ fontSize: '0.75rem', marginBottom: '2px', fontWeight: 'bold' }}>{index.name}</Card.Title>
                <Card.Text className={`mb-0 ${index.dayChange >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {index.dayChange >= 0 ? '+' : ''}{index.dayChange}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default MarketIndices;
