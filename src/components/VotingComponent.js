import React, { useState, useEffect } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import { ethers } from "ethers";

/**
 * A component to interact with a smart contract to vote on various options.
 * @param {Object} props The component props.
 * @param {string} props.contractAddress The Ethereum contract address.
 * @param {Array} props.contractABI The ABI of the contract.
 */
const VotingComponent = ({ contractAddress, contractABI }) => {
  const [options, setOptions] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);

  /**
   * Connect to Ethereum network and initialize contract on component mount.
   */
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(votingContract);
          await loadOptions(votingContract);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.log("Please install MetaMask to use this application.");
      }
    };

    init();
  }, [contractAddress, contractABI]);

  /**
   * Load voting options from the blockchain.
   * @param {Object} votingContract The contract instance.
   */
  const loadOptions = async (votingContract) => {
    const optionsCount = await votingContract.getOptionCount();
    const optionsList = [];
    for (let i = 0; i < optionsCount; i++) {
      const option = await votingContract.getOption(i);
      optionsList.push({
        name: option.name,
        voteCount: option.voteCount.toString(),
      });
    }
    setOptions(optionsList);
    setLoading(false);
  };

  /**
   * Handle voting for a specific option.
   * @param {number} index The index of the option to vote for.
   */
  const vote = async (index) => {
    try {
      await contract.vote(index);
      setHasVoted(true);
      await loadOptions(contract);
    } catch (error) {
      console.error("Voting failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {options.map((option, index) => (
        <Card key={index} style={{ margin: "10px" }}>
          <Card.Body>
            <Card.Title>{option.name}</Card.Title>
            <Card.Text>Votes: {option.voteCount}</Card.Text>
            {!hasVoted && <Button onClick={() => vote(index)}>Vote</Button>}
          </Card.Body>
        </Card>
      ))}
      {hasVoted && <Alert variant="success">Thanks for voting!</Alert>}
    </div>
  );
};

export default VotingComponent;
