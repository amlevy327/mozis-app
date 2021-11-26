import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
import {
  loadWeb3,
  loadAccount,
  loadTokenContract,
  loadExchangeContract,
  loadTokenContractOwner,
  loadTokenTransferSingles,
  loadCancelled,
  loadSales,
  loadListings
} from '../store/interactions'
import {
  accountSelector,
  tokenContractOwnerLoadedSelector,
  tokenContractOwnerSelector,
  allTransferSinglesLoadedSelector
} from '../store/selectors'

import Navbar from './Navbar'
import Spinner from './Spinner'
import ContentBrandOwner from './ContentBrandOwner'

const showContent = (props) => {
  const {
    account,
    owner
  } = props

  console.log('AML showContent account: ', account)
  console.log('AML showContent tokenContractOwner: ', owner)

  if(account === owner){
    return(
      //console.log("AML yes is owner")
      <div className="content">
        <ContentBrandOwner />
      </div>
    )
  } else {
    return(
      console.log("AML no not owner")
    )
  }
}

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    await window.ethereum.enable() // not sure if need this?
    const web3 = await loadWeb3(dispatch)
    const networkId = await web3.eth.net.getId()
    
    await loadAccount(web3, dispatch)
    
    const token = await loadTokenContract(web3, networkId, dispatch)
    if (!token) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
    }

    const exchange = await loadExchangeContract(web3, networkId, dispatch)
    if(!exchange) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
    }
    
    await loadTokenContractOwner(token, dispatch)
    await loadTokenTransferSingles(token, dispatch)
    await loadListings(exchange, dispatch)
    await loadCancelled(exchange, dispatch)
    await loadSales(exchange, dispatch)
  }

  render() {
    return (
      <div>
        <Navbar />
        { this.props.showAll ? showContent(this.props) : <Spinner /> }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const tokenContractOwnerLoaded = tokenContractOwnerLoadedSelector(state)
  const allTransferSinglesLoaded = allTransferSinglesLoadedSelector(state)
  
  return {
    account: accountSelector(state),
    showAll: tokenContractOwnerLoaded && allTransferSinglesLoaded,
    owner: tokenContractOwnerSelector(state)
  }
}

export default connect(mapStateToProps)(App)