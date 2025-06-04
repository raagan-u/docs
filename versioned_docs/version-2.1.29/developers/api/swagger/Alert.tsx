import React from 'react';
import "./swagger-ui.css";
const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="custom-alert">
      <div className="custom-alert__container">
        <span className="custom-alert__message">{message}</span>
        <button 
          className="custom-alert__close-btn" 
          onClick={onClose}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
