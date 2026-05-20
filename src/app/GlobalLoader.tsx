'use client';

import React from 'react';
import './GlobalLoader.css';

export default function GlobalLoader() {
  return (
    <div className="global-loader-container">
      <div className="loader-content">
        <span className="loader"></span>
        <p className="loader-text">STATS TUBE</p>
      </div>
    </div>
  );
}
