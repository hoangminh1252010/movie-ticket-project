import React from 'react';

const QrCode = ({ src }) => {
  return (
    <div className="flex justify-center pb-10">
      <img src={src} alt="QR Code" className="w-40 h-40" />
    </div>
  );
};
export default QrCode;