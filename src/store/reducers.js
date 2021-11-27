import { combineReducers } from "redux"

// WEB3
function web3(state = {}, action) {
  switch(action.type) {
    case 'WEB3_LOADED':
      return { ...state, connection: action.connection}
    case 'WEB3_ACCOUNT_LOADED':
      return { ...state, account: action.account }
    default:
      return state
  }
}

// ROYALTY PAYMENTS
function royaltyPayments(state = {}, action) {
  switch(action.type) {
    case 'ROYALTY_PAYMENTS_CONTRACT_LOADED':
      return { ...state, loaded: true, contract: action.contract}
    case 'PAYEES_ADDED_LOADED':
      return { ...state, loaded: true, payees: action.payees}
    case 'PAYMENT_RELEASED_LOADED':
      return { ...state, loaded: true, released: action.released}
    case 'PAYMENT_RECEIVED_LOADED':
      return { ...state, loaded: true, received: action.received}
    default:
      return state
  }
}

// TOKEN
function token(state = {}, action) {
  switch(action.type) {
    case 'TOKEN_CONTRACT_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    case 'ROYALTY_PERCENT_LOADED':
      return { ...state, royaltyPercent: action.royaltyPercent}
    case 'TOKEN_CONTRACT_OWNER_LOADED':
      return { ...state, contractOwner: { loaded: true, address: action.contractOwner} }
    case 'TRANSFER_SINGLES_LOADED':
      return { ...state, transferSingles: { loaded: true, data: action.transferSingles } }
    case 'ALL_NFTS_LOADED':
      return { ...state, allNFTs: { loaded: true, data: action.allNFTs } }
    case 'TOKEN_TRANSERRED_SINGLE':
      return { ...state, transferSingle: { loaded: true, data: action.transferSingles } }
      /*
    case 'TOKEN_CONTRACT_OWNER_LOADED':
      return { ...state, owner: action.owner}
      */
    default:
      return state
  }
}

// EXCHANGE

function exchange(state = {}, action) {
  switch(action.type) {
    case 'EXCHANGE_CONTRACT_LOADED':
      return { ...state, loaded: true, contract: action.contract }
    
    case 'LISTINGS_LOADED':
      return { ...state, allListings: { loaded: true, data: action.listings } }
    /*
      case 'LISTING_CREATING':
      return { ...state, listingCreating: true }
    case 'LISTING_CREATED':
      return {
        ...state,
        listingCreating: false,
        allListings: {
          ...state.allListings,
          data: [
            ...state.allListings.data,
            action.listing
          ]
        }
      }
    */

    case 'CANCELLED_LOADED':
      return { ...state, allCancelled: { loaded: true, data: action.cancelled } }
    case 'LISTING_CANCELLING':
      return { ...state, listingCancelling: true }
    case 'LISTING_CANCELLED':
      return {
        ...state,
        listingCancelling: false,
        allCancelled: {
          ...state.allCancelled,
          data: [
            ...state.allCancelled.data,
            action.cancelled
          ]
        }
      }
   
    case 'SALES_LOADED':
      return { ...state, allSales: { loaded: true, data: action.sales } }
    case 'LISTING_PURCHASING':
        return { ...state, listingPurchasing: true }
    case 'LISTING_PURCHASED':
      return {
        ...state,
        listingPurchasing: false,
        allSales: {
          ...state.allSales,
          data: [
            ...state.allSales.data,
            action.sale
          ]
        }
      }
    default:
      return state
    
  }
}

// TODO: add contract reducer

const rootReducer = combineReducers({
  web3,
  token,
  royaltyPayments,
  exchange
})

export default rootReducer