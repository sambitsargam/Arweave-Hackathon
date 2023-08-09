const axios = require('axios');
const CronJob = require('cron').CronJob;

const firebaseDatabaseURL = 'https://arhubtracker-default-rtdb.firebaseio.com';

const fetchDataFromFirebase = async () => {
  try {
    const response = await axios.get(`${firebaseDatabaseURL}/data.json`);
    const data = response.data;
    console.log('Fetched data from Firebase:', data);
    const walletAddresses = Object.values(data).map(entry => entry.walletAddress);
    const emails = Object.values(data).map(entry => entry.email);
    
    console.log('Wallet addresses and emails:', walletAddresses, emails);
    
    // Assuming you want to fetch transactions for all wallet addresses, you can loop through them
    for (let i = 0; i < walletAddresses.length; i++) {
      const walletAddress = walletAddresses[i];
      const email = emails[i];
      console.log('Fetching transactions for wallet address:', walletAddress);
    
      // Call the fetchTransactions function with the extracted wallet address and email
      await fetchTransactions(walletAddress, email);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching data from Firebase:', error.message);
    return null;
  }
};

// now use the extracted walletaddress to fetch transactions
const fetchTransactions = async (walletAddress,emails) => {
  try {
    const recipientsQuery = `{
      transactions(recipients: ["${walletAddress}"]) {
        edges {
          node {
            id
            recipient
            owner {
              address
            }
            fee {
              ar
            }
            quantity {
              winston
              ar
            }
            tags {
              name
              value
            }
            block {
              timestamp
            }
          }
        }
      }
    }`;

    const recipientsResponse = await axios.post("https://arweave.net/graphql", {
      query: recipientsQuery,
    });

    const recipientTransactions = recipientsResponse.data.data.transactions.edges.map(
      (edge) => edge.node
    );

    const ownersQuery = `{
      transactions(owners: ["${walletAddress}"]) {
        edges {
          node {
            id
            recipient
            owner {
              address
            }
            fee {
              ar
            }
            quantity {
              winston
              ar
            }
            tags {
              name
              value
            }
            block {
              timestamp
            }
          }
        }
      }
    }`;

    const ownersResponse = await axios.post("https://arweave.net/graphql", {
      query: ownersQuery,
    });

    const ownerTransactions = ownersResponse.data.data.transactions.edges.map(
      (edge) => edge.node
    );

    // Filter recipient transactions by timestamp
    const recipientfilteredTransactions = recipientTransactions.filter(
      (transaction) => {
        const transactionTimestamp = transaction.block.timestamp;
        const currentTimestamp = Date.now() / 1000;
        const difference = currentTimestamp - transactionTimestamp;
        return difference <= 30;
      }
    );

    // Filter owner transactions by timestamp
    const ownerfilteredTransactions = ownerTransactions.filter((transaction) => {
      const transactionTimestamp = transaction.block.timestamp;
      const currentTimestamp = Date.now() / 1000;
      const difference = currentTimestamp - transactionTimestamp;
      return difference <= 30;
    });


// now check if the filtered transactions are more than 0
if (recipientfilteredTransactions.length > 0) {
  console.log('Recipient transactions found', recipientfilteredTransactions);
  // Send individual emails to each owner with their corresponding transactions
  for (let i = 0; i < recipientfilteredTransactions.length; i++) {
  const transaction = recipientfilteredTransactions[i];
  const ownerEmail = emails;
  const owner = transaction.owner.address;
  const transid = transaction.id;
  const fees = transaction.fee.ar;
  const quantity = transaction.quantity.ar;
  const transactionTimestamps = transaction.block.timestamp;
  const transactionTimestamp = new Date(transactionTimestamps * 1000).toUTCString();
// now send the filtered transactions to the nodemailer api to send email with all details of that transaction
  const response = await axios.post('https://trackrhub.onrender.com/receipt', {
        email: ownerEmail,
        owner: owner,
        transid: transid,
        fees: fees,
        quantity: quantity,
        transactionTimestamp: transactionTimestamp,
      });
  console.log("response is", response);
  console.log("recipientfilteredTransactions are", recipientfilteredTransactions);
  console.log('Email sent successfully',emails);
  console.log('Transaction:', transaction);
  }
} else {
  console.log('No Reciptant transactions found');
}



if (ownerfilteredTransactions.length > 0 ) {
  console.log('Owner transactions Length found', ownerfilteredTransactions.lenth);

  // Send individual emails to each owner with their corresponding transactions
  for (let i = 0; i < ownerfilteredTransactions.length; i++) {
    const transaction = ownerfilteredTransactions[i];
    const ownerEmail = emails;
    const transid = transaction.id;
    const appNameTag = transaction.tags.find(tag => tag.name === 'App-Name');
    const appName = appNameTag ? appNameTag.value : 'N/A';
    const quantity = transaction.quantity.ar;
    const recipient = transaction.recipient;
    const fees = transaction.fee.ar;
    const transactionTimestamps = transaction.block.timestamp;
    const transactionTimestamp = new Date(transactionTimestamps * 1000).toUTCString();

   if (quantity > 0) {
    try {
      const response = await axios.post('https://trackrhub.onrender.com/owner', {
        email: ownerEmail,
        receipt: recipient,
        transid: transid,
        fees: fees,
        quantity: quantity,
        transactionTimestamp: transactionTimestamp,
      });
      console.log("response is", response);
      console.log(`Email sent successfully to ${ownerEmail}`);
      console.log('Transaction:', transaction);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  } else {
    // Now send the filtered transaction and owner email to the nodemailer API
    try {
      const response = await axios.post('https://trackrhub.onrender.com/contract', {
        email: ownerEmail,
        appName: appName,
        transid: transid,
        quantity: quantity,
        fees: fees,
        transactionTimestamp: transactionTimestamp,
      });
      console.log("response is", response);
      console.log(`Email sent successfully to ${ownerEmail}`);
      console.log('Transaction:', transaction);
    } catch (error) {
      console.error('Error sending email:', error);
    } 
  }
  }
} else {
  console.log('No Owner transactions found');
};
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
  }
};
// Schedule the job to run every 30 sec
const cronJob = new CronJob('*/30 * * * * *', fetchDataFromFirebase);

// Start the cron job
cronJob.start();