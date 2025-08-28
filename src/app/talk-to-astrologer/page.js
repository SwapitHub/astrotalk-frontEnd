"use client";
import React, { useState } from 'react';
import axios from 'axios';

function CallButton() {
  const [status, setStatus] = useState('');

  const handleCall = async () => {
    setStatus('Calling...');
    try {
      const res = await axios.post('http://localhost:8080/make-call');
      if (res.data.success) {
        setStatus('Call initiated! Check your phone.');
      } else {
        setStatus('Call failed: ' + res.data.error);
      }
    } catch (err) {
      setStatus('Error: ' + err.message);
    }
  };

  return (
    <div>
      <button onClick={handleCall}>Call My Test Number</button>
      <p>{status}</p>
    </div>
  );
}

export default CallButton;
