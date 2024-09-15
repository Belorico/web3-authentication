import React, { useState } from 'react';
import { ethers } from 'ethers';

function App() {
  const [account, setAccount] = useState(null);
  const [signature, setSignature] = useState('');
  const [message, setMessage] = useState('Authenticate with MetaMask');

  // Request the MetaMask account
  async function requestAccount() {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    }
  }

  // Sign a message using the MetaMask account
  async function signMessage() {
    if (!account) {
      alert('Please connect to MetaMask first.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const messageToSign = "Sign in to authenticate";

    try {
      const signature = await signer.signMessage(messageToSign);
      setSignature(signature);
      setMessage("Signature generated. Verify your authentication.");
    } catch (error) {
      console.error('Error signing message:', error);
    }
  }

  // Verify the signature
  async function verifySignature() {
    if (!signature) {
      alert('Please sign the message first.');
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const messageToSign = "Sign in to authenticate";

    try {
      const recoveredAddress = ethers.utils.verifyMessage(messageToSign, signature);

      if (recoveredAddress.toLowerCase() === account.toLowerCase()) {
        setMessage('Authentication successful!');
      } else {
        setMessage('Authentication failed.');
      }
    } catch (error) {
      console.error('Error verifying signature:', error);
    }
  }

  return (
    <div>
      <h1>Web3 Authentication with MetaMask</h1>
      <p>{message}</p>
      {account ? (
        <div>
          <p>Connected as: {account}</p>
          <button onClick={signMessage}>Sign Message</button>
          <button onClick={verifySignature}>Verify Signature</button>
        </div>
      ) : (
        <button onClick={requestAccount}>Connect to MetaMask</button>
      )}
      {signature && <p>Signature: {signature}</p>}
    </div>
  );
}

export default App;
