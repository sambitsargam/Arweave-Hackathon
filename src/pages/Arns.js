import React, { useState, useEffect, useContext } from "react";
import { Card, Grid, Row, Text, Loading } from "@nextui-org/react";
import PageTitle from "../components/Typography/PageTitle";
import {
  Input,
  Button,
  HelperText,
  Label,
  Select,
  Textarea,
} from "@windmill/react-ui";
import axios from "axios";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

export default function Transaction() {
  const [userAddress, setUserAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [arnsName, setArnsName] = useState(""); // State to store the ARNS name input value

  const handleArnsNameChange = (event) => {
    setArnsName(event.target.value);
  };

  const fetchOwnerAddress = async () => {
    try {
      // fetch the datafrom a url endpoint
        const response = await axios.get(   
            `https://dev.arns.app/v1/contract/bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U/records/${arnsName}`
            );
        const ownerAddress = response.data.owner;
      setUserAddress(ownerAddress);
      console.log(ownerAddress);
    } catch (error) {
      // Handle any errors that occur during the fetch.
      alert("Address is not Registered with ARNS")
      setUserAddress(""); // Clear the userAddress state if an error occurs
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you should have the necessary setup for registry and antContract instances.
    // Make sure they are defined and initialized properly before calling fetchOwnerAddress.
    fetchOwnerAddress();
  };

  useEffect(() => {
    if (userAddress !== "") {
    // Define an async function to obtain the user's wallet address
    const Transactions = async () => {
      try {
        const res = await axios.get(
            `https://arweave.net/wallet/${userAddress}/balance`
          );

        const balance = res.data / 1000000000000;
        setBalance(balance);
          const recipientsQuery = `{
            transactions(recipients: ["${userAddress}"]) {
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
  
          const recipientsResponse = await axios.post("https://arweave.net/graphql", { query: recipientsQuery });
  
          // Fetch transactions for owners
          const ownersQuery = `{
            transactions(owners: ["${userAddress}"]) {
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
  
          const ownersResponse = await axios.post("https://arweave.net/graphql", { query: ownersQuery });
  
          // Merge transactions data
          const recipientsTransactions = recipientsResponse.data.data.transactions.edges.map(edge => edge.node);
          const ownersTransactions = ownersResponse.data.data.transactions.edges.map(edge => edge.node);
  
          const mergedTransactions = [...recipientsTransactions, ...ownersTransactions];
          setTransactions(mergedTransactions);
      } catch (error) {
        console.error(
          "Error while obtaining the user's wallet address:",
          error
        );
        setBalance("");
        setTransactions([]);
      }
    };
    Transactions();
}
  }, [userAddress]);


  const columns = [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Owner Address",
      accessor: "owner.address",
    },
    {
      Header: "Recipient Address",
      accessor: "recipient",
    },
    {
      Header: "Fee (AR)",
      accessor: "fee.ar",
    },
    {
      Header: "Quantity (AR)",
      accessor: "quantity.ar",
      Cell: ({ value }) => parseFloat(value).toFixed(2),
    },
    {
      Header: "Timestamp (UTC)",
      accessor: "block.timestamp",
    },
  ];
  return (
    <>
      <PageTitle> Find The ARNS Transactions </PageTitle>
      <div className="w-max"></div>
      <div
        className="
         grid md:grid-cols-5 grid-col-9 lg:grid-cols-1 gap-7 "
      >
        <div>
          <form onSubmit={handleSubmit}>
            <Label>
              <span>ARNS Name</span>
              <Input
                className="mt-1"
                placeholder="ardrive"
                value={arnsName}
                onChange={handleArnsNameChange}
              />
            </Label>
            <Button block type="submit" className="mt-4">
              Search
            </Button>
          </form>
          <br></br>
          <br></br>
          <div class="block overflow-hidden border border-gray-100 rounded-lg shadow-sm">
            <div class="p-6">
              <div className="flex flex-row items-center justify-between">
                <h5 class="text-xl font-bold dark:text-white">
                   Wallet Address
                </h5>
              </div>
              <h5 class="text-md font-bold w-5/12 dark:text-white text-white rounded-full bg-blue-400 ">
                {userAddress}
              </h5>
            </div>
            <div class="p-6">
              <div className="flex flex-row items-center justify-between">
                <h5 class="text-xl font-bold dark:text-white">
                  Wallet Balance
                </h5>
              </div>
              <h5 class="text-md font-bold w-2/12 dark:text-white text-white rounded-full bg-blue-400 ">
                {balance} AR
              </h5>
            </div>
          </div>
        </div>
      </div>
      <PageTitle> MY Transaction </PageTitle>
      <div className="w-max"></div>
      <div
        className="
         grid md:grid-cols-5 grid-col-9 lg:grid-cols-1 gap-7 "
      >
        <div>
          <div class="block overflow-hidden border border-gray-100 rounded-lg shadow-sm">
            <ReactTable data={transactions} columns={columns}>
              {(state, makeTable, instance) => {
                return (
                  <div
                    style={{
                      background: "lightblue",
                      borderRadius: "5px",
                      overflow: "hidden",
                      padding: "5px",
                    }}
                  >
                    {makeTable()}
                  </div>
                );
              }}
            </ReactTable>
          </div>
        </div>
      </div>
    </>
  );
}
