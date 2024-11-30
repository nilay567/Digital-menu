import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import './QrCodeScanner.css';
import NavBar from '../../components/NavBar/NavBar';
import { useRestaurant } from '../../hooks/useRest.js';

const QrCodeScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const location = useLocation();
  const qrReaderRef = useRef(null);
  const { setSelectedRestaurantId } = useRestaurant();

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      setSelectedRestaurantId(data);
      stopCamera(); // Stop the camera after scanning
      window.location.href = `http://localhost:3000/${data}/userMenu`;
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const stopCamera = () => {
    if (qrReaderRef.current) {
      qrReaderRef.current.stop();
      setIsCameraOn(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    const handlePageChange = () => {
      if (location.pathname !== 'http://localhost:3000/scan-qrcode') {
        stopCamera();
      }
    };

    handlePageChange();

    return () => {
      stopCamera();
    };
  }, [location.pathname]);

  return (
    <>
      <NavBar />
      <div className="qrCodeScannerContainer">
        <h2>Scan QR Code</h2>
        <div className="qrReaderWrapper">
          {isCameraOn && (
            <QrReader
              ref={qrReaderRef}
              delay={300}
              onError={handleError}
              onResult={(result, error) => {
                if (result) {
                  handleScan(result?.text);
                }
                if (error) {
                  handleError(error);
                }
              }}
              style={{ width: '100%' }}
              videoStyle={{ width: '100%', height: 'auto' }}
            />
          )}
        </div>
        {scanResult && <p>Scanned URL: {scanResult}</p>}
      </div>
    </>
  );
};

export default QrCodeScanner;
