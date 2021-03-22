import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, buffer: null, ipfsHash:null };

  captureFile = (event)=>{
    event.preventDefault()
    // console.log("File capture...")
    const file=event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file)
    reader.onloadend=()=>{
      this.setState({buffer: Buffer(reader.result)})
      //console.log(this.state.buffer)

    }
    
  }
  onSubmit =(event)=>{
    event.preventDefault();
    console.log(this.state.buffer)
    ipfs.files.add(this.state.buffer,(error,result)=>{
      if(error){
        console.log(error)
        return;
      }
      
      this.setState({ipfsHash: result[0].hash})
  console.log(this.state.accounts);
     this.SimpleStorageContract.set(result[0].hash,{from: this.state.accounts}).then((res)=>{
       return SimpleStorageContract.get.call(this.state.accounts)
     }).then((ipfsHash)=>{
       //update
       this.state({ipfsHash})
       console.log('ipfsHash',this.state.ipfsHash)

     })

     
      console.log('ipfsHash',this.state.ipfsHash)
    })
  }
  
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  
  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>this is the prototype</h1>
        <p>Your contract is ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          please uplode the file
        </p>
       <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
       <h2>uplode File</h2>
       <form onSubmit={this.onSubmit}>
         <input type="file" onChange={this.captureFile}/>
         <input type ="submit"/>
       </form>
        
      </div>
    );
  }
}

export default App;
