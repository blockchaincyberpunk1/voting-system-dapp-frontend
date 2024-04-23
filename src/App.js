import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import VotingComponent from './components/VotingComponent';
import { Container } from 'react-bootstrap';
// Import the ABI from the compiled contract JSON
import contractData from './contracts/Voting.json';

/**
 * Main application component.
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  const contractAddress = "0x49d9A91Cf0B6af5349b7288Fa90187DcDd945819";
  // Use the ABI from the imported contract data
  const contractABI = contractData.abi;

  return (
    <Container className="mt-5">
      <h1>Voting DApp</h1>
      <p>This decentralized application allows users to vote on predefined options.</p>
      <VotingComponent contractAddress={contractAddress} contractABI={contractABI} />
    </Container>
  );
}

export default App;
