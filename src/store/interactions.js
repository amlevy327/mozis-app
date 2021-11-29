import Web3 from 'web3'

import {
  web3Loaded,
  web3AccountLoaded,
  tokenContractLoaded,
  exchangeContractLoaded,
  royaltyPaymentsContractLoaded,
  tokenContractOwnerLoaded,
  royaltyPercentLoaded,
  transferSinglesLoaded,
  allNFTsLoaded,
  listingsLoaded,
  cancelledLoaded,
  salesLoaded,
  listingCancelling,
  listingCancelled,
  listingPurchasing,
  listingPurchased,
  tokenTransferredSingle,
  payeesAdded,
  paymentReleased,
  paymentReceived,
  royaltyWithdrawing,
  paymentReceivedNewEvent,
  paymentReleasedNewEvent,
  totalSharesLoaded,
  listingCreating,
  listingCreated,
  approvalForAllLoaded,
  approvingExchange,
  exchangeApproved
  /*
  ownershipChanged,
  */
} from './actions.js'
import Token from '../abis/Token.json'
import Exchange from '../abis/Exchange.json'
import RoyaltyPayments from '../abis/RoyaltyPayments.json'

// WEB3

export const loadWeb3 = async (dispatch) => {
  console.log('window.ethereum: ', window.ethereum)
  if(typeof window.ethereum !== 'undefined'){
    const web3 = new Web3(window.ethereum)
    dispatch(web3Loaded(web3))
    return web3
  } else {
    window.alert('Please install MetaMask')
    window.location.assign('https://metamask.io/')
  }
}

// ACCOUNT

export const loadAccount = async (web3, dispatch) => {
  const accounts = await web3.eth.getAccounts()
  const account = await accounts[0]
  if(typeof account !== 'undefined') {
    dispatch(web3AccountLoaded(account))
    return account
  } else {
    window.alert('Please login with MetaMask')
    return null
  }
}

// LOAD CONTRACTS

export const loadTokenContract = async (web3, networkId, dispatch) => {
  try {
    const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
    dispatch(tokenContractLoaded(token))
    return token
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

export const loadRoyaltyPaymentsContract = async (web3, networkId, dispatch) => {
  try {
    const royaltyPayments = new web3.eth.Contract(RoyaltyPayments.abi, RoyaltyPayments.networks[networkId].address)
    dispatch(royaltyPaymentsContractLoaded(royaltyPayments))
    return royaltyPayments
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}


export const loadExchangeContract = async (web3, networkId, dispatch) => {
  try {
    const exchange = new web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address)
    dispatch(exchangeContractLoaded(exchange))
    return exchange
  } catch (error) {
    console.log('Contract not deployed to the current network. Please select another network with Metamask.')
    return null
  }
}

// GET 

// royalty percent

export const getRoyaltyPercent = async (token, account, dispatch) => {
  const royaltyPercent = await token.methods.royaltyPercent().call()
  dispatch(royaltyPercentLoaded(royaltyPercent))
}

// total shares

export const getTotalShares = async (royaltyPayments, dispatch) => {
  const totalShares = await royaltyPayments.methods.totalShares().call()
  dispatch(totalSharesLoaded(totalShares))
}

// get token uri

// get royalty info? - need this?

// token contract owner? - need this? part of token contact?

// UPDATE

// update token contract owner? - need this? only Mozis would use this once.



// cancel listing

// purchase listing

// EVENTS

// load token contract owner change
export const loadTokenContractOwner = async (token, dispatch) => {
  const ownershipChangesStream = await token.getPastEvents('OwnershipTransferred', { fromBlock: 0, toBlock: 'latest' })
  console.log('ownerships stream: ', ownershipChangesStream)
  const contractOwner = ownershipChangesStream[ownershipChangesStream.length - 1].returnValues.newOwner
  console.log('contractOwner: ', contractOwner)
  dispatch(tokenContractOwnerLoaded(contractOwner))
}

// load TransferSingle from ERC1155
export const loadTokenTransferSingles = async (token, dispatch) => {
  const transferSinglesStream = await token.getPastEvents('TransferSingle', { fromBlock: 0, toBlock: 'latest' })
  console.log('transferSingles stream: ', transferSinglesStream)
  const transferSingles = transferSinglesStream.map((event) => event.returnValues)
  dispatch(transferSinglesLoaded(transferSingles))
  dispatch(allNFTsLoaded(transferSingles.filter((t) => t.from === '0x0000000000000000000000000000000000000000')))
}

// load ApprovalForAll from ERC1155
export const loadApprovalForAll = async (token, dispatch) => {
  const approvalForAllStream = await token.getPastEvents('ApprovalForAll', { fromBlock: 0, toBlock: 'latest' })
  console.log('approvalForAll stream: ', approvalForAllStream)
  const approvalForAll = approvalForAllStream.map((event) => event.returnValues)
  dispatch(approvalForAllLoaded(approvalForAll))
}

// load listings
export const loadListings = async (exchange, dispatch) => {
  const listingsStream = await exchange.getPastEvents('NewListing', { fromBlock: 0, toBlock: 'latest' })
  console.log('listing stream: ', listingsStream)
  const listings = listingsStream.map((event) => event.returnValues)
  dispatch(listingsLoaded(listings))
}

// load cancelled
export const loadCancelled = async (exchange, dispatch) => {
  const cancelledStream = await exchange.getPastEvents('Cancelled', { fromBlock: 0, toBlock: 'latest' })
  console.log('cancelled stream: ', cancelledStream)
  const cancelled = cancelledStream.map((event) => event.returnValues)
  dispatch(cancelledLoaded(cancelled))
}

// load sales
export const loadSales = async (exchange, dispatch) => {
  const salesStream = await exchange.getPastEvents('Sale', { fromBlock: 0, toBlock: 'latest' })
  console.log('sales stream: ', salesStream)
  const sales = salesStream.map((event) => event.returnValues)
  dispatch(salesLoaded(sales))
}

// load payee added
export const loadPayeesAdded = async (royaltyPayments, dispatch) => {
  const payeesAddedStream = await royaltyPayments.getPastEvents('PayeeAdded', { fromBlock: 0, toBlock: 'latest' })
  console.log('payees stream: ', payeesAddedStream)
  const payees = payeesAddedStream.map((event) => event.returnValues)
  dispatch(payeesAdded(payees))
}

// load payments received
export const loadPaymentsReceived = async (royaltyPayments, dispatch) => {
  const paymentsReceivedStream = await royaltyPayments.getPastEvents('PaymentReceived', { fromBlock: 0, toBlock: 'latest' })
  console.log('paymentsReceivedStream stream: ', paymentsReceivedStream)
  const received = paymentsReceivedStream.map((event) => event.returnValues)
  dispatch(paymentReceived(received))
}

// load payments released
export const loadPaymentsReleased = async (royaltyPayments, dispatch) => {
  const paymentsReleasedStream = await royaltyPayments.getPastEvents('PaymentReleased', { fromBlock: 0, toBlock: 'latest' })
  console.log('paymentsReleased stream: ', paymentsReleasedStream)
  const released = paymentsReleasedStream.map((event) => event.returnValues)
  dispatch(paymentReleased(released))
}

// TODO: load BATCH TRANSFER from ERC1155

// subscribe - listings, cancelled, sales, token contract owner change, TransferSingle from ERC1155
export const subscribeToEvents = async (token, exchange, royaltyPayments, dispatch) => {
  /*
  token.events.OwnershipTransferred({}, (error, event) => {
    dispatch(ownershipChanged(event.returnValues))
  })
*/

  token.events.TransferSingle({}, (error, event) => {
    dispatch(tokenTransferredSingle(event.returnValues))
  })

  token.events.ApprovalForAll({}, (error, event) => {
    dispatch(exchangeApproved(event.returnValues))
  })

  exchange.events.NewListing({}, (error, event) => {
    dispatch(listingCreated(event.returnValues))
  })

  // TODO: change action on this
  exchange.events.Cancelled({}, (error, event) => {
    dispatch(listingCancelled(event.returnValues))
  })

  exchange.events.Sale({}, (error, event) => {
    dispatch(listingPurchased(event.returnValues))
  })

  // TODO: check this
  royaltyPayments.events.PaymentReceived({}, (error, event) => {
    dispatch(paymentReceivedNewEvent(event.returnValues))
  })

  royaltyPayments.events.PaymentReleased({}, (error, event) => {
    dispatch(paymentReleasedNewEvent(event.returnValues))
  })
}

// Cancel listing

export const cancelListing = async (dispatch, account, exchange, listing) => {
  await exchange.methods.cancelListing(listing.listingId).send({ from: account })
  .on('transactionHash', (hash) => {
    dispatch(listingCancelling())
  })
  .on('error', (error) => {
    console.log(error)
    window.alert('There was an error!')
  })
}

// Purchase listing

export const purchaseListing = async (dispatch, account, exchange, listing) => {
  const totalCost = listing.totalCost

  await exchange.methods.purchaseListing(listing.listingId).send({ from: account, value: totalCost })
  .on('transactionHash', (hash) => {
    dispatch(listingPurchasing())
  })
  .on('error', (error) => {
    console.log(error)
    window.alert('There was an error!')
  })
}

// Withdraw royalties

export const withdrawRoyalties = async (dispatch, account, royaltyPayments) => {

  await royaltyPayments.methods.release(account).send({ from: account })
  .on('transactionHash', (hash) => {
    dispatch(royaltyWithdrawing())
    console.log('AML withdrawRoyalties')
  })
  .on('error', (error) => {
    console.log(error)
    window.alert('There was an error!')
  })
}

// Withdraw royalties

export const approveExchange = async (dispatch, account, token, exchange) => {

  
}

// create listing

// export const createListing = async (account, exchange, tokenAddress, tokenId, value, price, dispatch) => {
//   await exchange.methods.createListing(tokenAddress, tokenId, value, price).send({ from: account })
//   .on('transactionHash', (hash) => {
//     dispatch(listingCreating())
//   })
//   .on('error', (error) => {
//     console.log(error)
//     window.alert('There was an error!')
//   })
// }

// TODO: issue with this

export const createListing = async (account, exchange, token, tokenId, value, price, dispatch, approvalStatus) => {
  if (approvalStatus == true) {
    exchange.methods.createListing(token.options.address, tokenId, value, price).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(listingCreating())
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
  } else {
    token.methods.setApprovalForAll(exchange.options.address, true).send({ from: account })
    .on('transactionHash', (hash) => {
      dispatch(approvingExchange())
      exchange.methods.createListing(token.options.address, tokenId, value, price).send({ from: account })
      .on('transactionHash', (hash) => {
        dispatch(listingCreating())
      })
      .on('error', (error) => {
        console.log(error)
        window.alert('There was an error!')
      })
    })
    .on('error', (error) => {
      console.log(error)
      window.alert('There was an error!')
    })
  }
}