import React, { useState, useEffect } from 'react';
import logo from './logo.svg';


function App() {
  const [message, setMessage] = useState('');

  const getMessage = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    const response = await fetch('/health', requestOptions);
    const data = await response.json();

    if (!response.ok) {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    else {
      setMessage(data.message);
    }
    console.log(data);
  }

  useEffect(() => {
    getMessage();
  }, []);


  return (
    <div>
    </div>
  );
}

export default App;
