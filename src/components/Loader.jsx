import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
