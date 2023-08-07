import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Label, Input, Button } from '@windmill/react-ui';

function Home() {
  const [useArconnect, setUseArconnect] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Define an async function to obtain the user's wallet address
    const getUserAddress = async () => {
      try {
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

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            {/* Your image elements here */}
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Subscribe to Notification
              </h1>

              {useArconnect ? (
                <>
                  <Label>
                    <span>Your Wallet Address</span>
                    <Input className="mt-1" value={userAddress} readOnly />
                  </Label>
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
                </>
              )}

              {!useArconnect && (
                <Button onClick={handleUseArconnect} block className="mt-4">
                  Use Arconnect
                </Button>
              )}

              {useArconnect && (
                <Button tag={Link} to="/login" block className="mt-4">
                  Subscribe
                </Button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
