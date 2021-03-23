import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';
import web3 from 'web3';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

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
      
      
      this.state.contract.methods.set( result[0].hash).send({from:this.state.accounts[0]}).then((r)=>{
        this.setState({ipfsHash: result[0].hash})
        //this.setState({ipfsHash})
      })
  console.log(this.state.accounts);

  // I dont know why i use this below function


  //    this.SimpleStorageInstance.set(result[0].hash,{from: this.state.accounts}).then((res)=>{
  //      return SimpleStorageContract.get.call(this.state.accounts)
  //    }).then((ipfsHash)=>{
  //      //update
  //      this.state({ipfsHash})
  //      console.log('ipfsHash',this.state.ipfsHash)

  //    })

     
  //     console.log('ipfsHash',this.state.ipfsHash)
    })
  }

  // still need some update
  
  //  componentWillMount = async() =>{
  //   await this.loadWeb3() 

  // }
  
  componentDidMount = async () => {
    try {
      await this.loadWeb3() 
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      console.log(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      console.log(networkId)
      

      const deployedNetwork = SimpleStorageContract.networks[networkId];

      //fetch contract
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log(instance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });//, this.runExample);
      const ipfsHash = await instance.methods.get().call()
      this.setState({ipfsHash})





    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console chuthya.`,
      );
      console.error(error);
    }
  };


  // conect to the block chain
  loadWeb3 = async () =>{
    
    if(window.ethereum){

      window.web3 = new web3(window.ethereum)
      await window.ethereum.enable()
    }if(window.web3){

      window.web3 = new web3(window.web3.currentProvider)

    }else{
      window.alert("please use metamask!")
    }

  }
  
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
        <nav className = "navabar navbar-dark fixed-top bg-dark text-white flex-md-nawrap p-0 shadow">
          this is navabar
        <ul className =" navabar-vav px-3">
          <li className= "nav-item text-navrap d-one d-sm-none d-sm-block">
            <small className = "text-white">{this.state.accounts}</small>
          </li>
        </ul>

        </nav>
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
