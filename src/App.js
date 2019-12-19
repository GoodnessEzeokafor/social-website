import React, { Component } from 'react';
import "./Nav/Navbar"
import Web3 from 'web3';
import SocialNetwork from './abis/SocialNetwork.json'
import Navbar from './Nav/Navbar';
import Main from './Content/Main';


export default class App extends Component {
  // // component will mount
async componentWillMount(){
  await this.loadWeb3() 
  await this.loadBlockchainData()
}
// Load Web3
  async loadWeb3(){
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
          const web3 = window.web3
          // // load accounts
          const accounts = await web3.eth.getAccounts() // returns all the account in our wallet 
          console.log(accounts)

          // console.log("Window Ethereum Enabled")
      }
      // Legacy dapp browsers...
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
          
      }
      else {
          alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
  });
  }

//   //  Load Blockchain Data
   async loadBlockchainData(){
    // console.log(SocialNetwork)
    window.web3 = new Web3(window.ethereum)
    const web3 = window.web3
//     // // load accounts
    const accounts = await web3.eth.getAccounts() // returns all the account in our wallet 
    this.setState({account:accounts[0]})
    // console.log(accounts)

//     // // detects the network dynamically 
    const networkId = await web3.eth.net.getId()

//     // // get network data
    const networkData = SocialNetwork.networks[networkId]

    if(networkData){
      const SocialNetworkDapp = new web3.eth.Contract(SocialNetwork.abi, networkData.address) // loads the smart contract
      console.log(SocialNetworkDapp)


      const dapp_name = await SocialNetworkDapp.methods.social_name().call()
      const postCount = await SocialNetworkDapp.methods.postCount().call() 

      this.setState({SocialNetworkDapp}) // updates the state
      this.setState({dapp_name}) // updates the state
      this.setState({postCount})

//       // Load Posts
      for(var j=1; j <= postCount; j++){
        const post = await SocialNetworkDapp.methods.posts(j).call()
        this.setState({
          posts:[...this.state.posts, post]
        })
      }
      console.log({posts:this.state.posts})
//     
  }else {
          window.alert("Marketplace contract is not deployed to the network")
        }
}


createPost(title, content){
  
  // this.createPost = this.createPost.bind(this)
}
constructor(props) {
   super(props);
   this.state ={
    account:'',
    SocialNetworkDapp:'',
    dapp_name:'',
    posts:[]
   }
  }

  render() {
    return (
      <div>
        <Navbar 
        dapp_name ={this.state.dapp_name}
        account={this.state.account}/>

        <Main 
        posts = {this.state.posts}
        // createPost = {this.createPost}
        account={this.state.account}
        SocialNetworkDapp= {this.state.SocialNetworkDapp}
        />

      </div>
    );
  }
}

    


//   render() {
//     return (

//     );
//   }
// }