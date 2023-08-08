import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Label, Input, Button } from '@windmill/react-ui';
import axios from 'axios';
import arweave from 'arweave';

function Home() {
  const [useArconnect, setUseArconnect] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    // Define an async function to obtain the user's wallet address
    const getUserAddress = async () => {
      try {
        await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);
        // Make sure this code is executed inside an async function or a function that handles the promise.
        const userAddress = await window.arweaveWallet.getActiveAddress();
        
        console.log("Your wallet address is", userAddress);
        setUserAddress(userAddress || '');
      } catch (error) {
        console.error("Error while obtaining the user's wallet address:", error);
        setUserAddress('');
      }
    };

    

    // Call the async function to fetch wallet address if useArconnect is true
    if (useArconnect) {
      getUserAddress();
    } else {
      setUserAddress('');
    }
  }, [useArconnect]);

  const handleUseArconnect = () => {
    setUseArconnect(true);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    // Prepare the data to be sent to the Firebase Realtime Database
    const data = {
      walletAddress: useArconnect ? userAddress : userAddress.trim(),
      email: useArconnect ? email.trim() : email,
    };
    // Make the POST request to the Firebase Realtime Database
    axios.post('https://arhubtracker-default-rtdb.firebaseio.com/data.json', data)
      .then((response) => {
        alert('Your subscription has been saved successfully! Please check your email (including spam folder)for confirmation.');
        console.log('Response:', response);      })
      .catch((error) => {
        console.error('Error saving data to Firebase:', error);
        // Handle the error here, if required.
      });
      try {
        const response = await fetch('https://trackrhub.onrender.com/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const result = await response.json();
        setMessage(result.status);
      } catch (error) {
        console.error('Error subscribing:', error);
        setMessage('Error subscribing. Please try again later.');
      }
    
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            {/* Your image elements here */}
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src="https://2m2lbxhf7j7z3nwqqgix6ytvw4dmrqnfy6hgcyz4yheazgxoouja.arweave.net/0zSw3OX6f5220IGRf2J1twbIwaXHjmFjPMHIDJrudRI"
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src="https://2m2lbxhf7j7z3nwqqgix6ytvw4dmrqnfy6hgcyz4yheazgxoouja.arweave.net/0zSw3OX6f5220IGRf2J1twbIwaXHjmFjPMHIDJrudRI"
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Subscribe to Notification
              </h1>

              {useArconnect ? (
                <>
                  <Label>
                    <span>Your Wallet Address: </span>
                    <h1 className="mt-1 text-blue-500"> {userAddress} </h1>
                  </Label>
                  <br></br>
                  <Label>
                    <span>Email</span>
                    <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sambit@gmail.com" />
                  </Label>
                </>
              ) : (
                <>
                  <Label>
                    <span>Your Wallet Address</span>
                    <Input className="mt-1" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="Enter your wallet address manually" />
                  </Label>
                  <Label>
                    <span>Email</span>
                    <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sambit@gmail.com" />
                  </Label>
                </>
              )}

              {!useArconnect && (
                <Button onClick={handleUseArconnect} block className="mt-4">
                  Use Arconnect
                </Button>
              )}

              <Button onClick={handleSubscribe} block className="mt-4">
                Subscribe
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
