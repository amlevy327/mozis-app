import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
import {
  loadWeb3,
  loadAccount,
  loadTokenContract,
  loadRoyaltyPaymentsContract,
  loadExchangeContract,
  loadTokenContractOwner,
  loadTokenTransferSingles,
  loadCancelled,
  loadSales,
  loadListings,
  subscribeToEvents,
  getRoyaltyPercent,
  loadPayeesAdded,
  loadPaymentsReceived,
  loadPaymentsReleased,
  getTotalShares,
  loadApprovalForAll,
  setBlankTokenMetadata,
  getChainlinkPriceEthUsd
} from '../store/interactions'
import {
  accountSelector,
  tokenContractOwnerLoadedSelector,
  tokenContractOwnerSelector,
  allTransferSinglesLoadedSelector,
  allNFTsSelector,
  allNFTsLoadedSelector
} from '../store/selectors'

import Navbar from './Navbar'
import Spinner from './Spinner'
import ContentBrandOwner from './ContentBrandOwner'
import ContentBrandCustomer from './ContentBrandCustomer'

const showContent = (props) => {
  const {
    account,
    owner
  } = props

  if(account === owner){
    return(
      //console.log("AML yes is owner")
      <div className="content">
        <ContentBrandOwner />
      </div>
    )
  } else {
    return(
      //console.log("AML no not owner")
      <div className="content">
        <ContentBrandCustomer />
      </div>
    )
  }
}

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    const {
      account,
      dispatch
    } = props


    await window.ethereum.enable() // not sure if need this?
    const web3 = await loadWeb3(dispatch)
    const networkId = await web3.eth.net.getId()
    
    await loadAccount(web3, dispatch)
    
    const token = await loadTokenContract(web3, networkId, dispatch)
    if (!token) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
    }

    const royaltyPayments = await loadRoyaltyPaymentsContract(web3, networkId, dispatch)
    if (!royaltyPayments) {
      window.alert('RoyaltyPayments smart contract not detected on the current network. Please select another network with Metamask.')
    }

    const exchange = await loadExchangeContract(web3, networkId, dispatch)
    if(!exchange) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
    }
    
    await loadTokenContractOwner(token, dispatch)
    await loadTokenTransferSingles(token, dispatch)
    await loadApprovalForAll(token, dispatch)
    await loadListings(exchange, dispatch)
    await loadCancelled(exchange, dispatch)
    await loadSales(exchange, dispatch)
    await subscribeToEvents(token, exchange, royaltyPayments, dispatch)
    await getRoyaltyPercent(token, account, dispatch)
    await loadPayeesAdded(royaltyPayments, dispatch)
    await loadPaymentsReceived(royaltyPayments, dispatch)
    await loadPaymentsReleased(royaltyPayments, dispatch)
    await getTotalShares(royaltyPayments, dispatch)

    //await setBlankTokenMetadata(dispatch)
    await getChainlinkPriceEthUsd(dispatch)
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
    owner: tokenContractOwnerSelector(state),
    allNFTs: allNFTsSelector(state)
  }
}

export default connect(mapStateToProps)(App)