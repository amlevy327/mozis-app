import { get, reject } from 'lodash'
import { createSelector } from 'reselect'

const FRESH_MINT = '0x0000000000000000000000000000000000000000'

// ACCOUNT

const account = state => get(state, 'web3.account')
export const accountSelector = createSelector(account, a => a)

// TOKEN

const token = state => get(state, 'token.contract')
export const tokenSelector = createSelector(token, t => t)

const tokenLoaded = state => get(state, 'token.loaded')
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl)

const royaltyPercent = state => get(state, 'token.royaltyPercent')
export const royaltyPercentSelector = createSelector(royaltyPercent, rp => rp)

const tokenContractOwnerLoaded = state => get(state, 'token.contractOwner.loaded', false)
export const tokenContractOwnerLoadedSelector = createSelector(tokenContractOwnerLoaded, tcol => tcol)

const tokenContractOwner = state => get(state, 'token.contractOwner.address')
export const tokenContractOwnerSelector = createSelector(tokenContractOwner, tco => tco)

const allTransferSinglesLoaded = state => get(state, 'token.transferSingles.loaded', false)
export const allTransferSinglesLoadedSelector = createSelector(allTransferSinglesLoaded, tsl => tsl)


const allTransferSingles = state => get(state, 'token.transferSingles.data', [])
/*
// TODO: Keep to use transfer single events when tracking other marketplaces
export const myNFTsSelector = createSelector(allTransferSingles, account, (allTransferSingles, account) => {
  const allNFTs = allTransferSingles.filter((t) => t.from === FRESH_MINT)
  const myNFTs = decorateMyNFTs(allTransferSingles, allNFTs, account)
  return myNFTs
})

const decorateMyNFTs = (allTransferSingles, allNFTs, account) => {
  return(
    allNFTs.map((nft) => {
      nft = addCurrentValue(allTransferSingles, nft, account)
      return nft
    })
  )
}

const addCurrentValue = (allTransferSingles, nft, account) => {
  let currentValue = 0

  const filteredTransferSingles = allTransferSingles.filter((t) => t.id === nft.id)

  for(let i=0;i<filteredTransferSingles.length;i++){
    if(account === filteredTransferSingles[i].to) {
      currentValue += filteredTransferSingles[i].value
    }
    if(account === filteredTransferSingles[i].from) {
      currentValue -= filteredTransferSingles[i].value
    }
  }

  return({
    ...nft,
    currentValue
  })
}
*/

// ROYALTY PAYMENTS

const royaltyPayments = state => get(state, 'royaltyPayments.contract')
export const royaltyPaymentsSelector = createSelector(royaltyPayments, rp => rp)

const royaltyPaymentsLoaded = state => get(state, 'royaltyPayments.loaded', false)
export const royaltyPaymentsLoadedSelector = createSelector(royaltyPaymentsLoaded, rpl => rpl)

const totalShares = state => get(state, 'royaltyPayments.totalShares.amount')
export const totalSharesSelector = createSelector(totalShares, ts => ts)

const totalSharesLoaded = state => get(state, 'royaltyPayments.totalShares.loaded', false)
export const totalSharesLoadedSelector = createSelector(totalSharesLoaded, tsl => tsl)

const royaltyPaymentsReceivedLoaded = state => get(state, 'royaltyPayments.received.loaded', false)
export const royaltyPaymentsReceivedLoadedSelector = createSelector(royaltyPaymentsReceivedLoaded, l => l)

const royaltyPaymentsReceived = state => get(state, 'royaltyPayments.received.data', [])
export const royaltyPaymentsReceivedSelector = createSelector(royaltyPaymentsReceived, rpr => rpr)

const royaltyPaymentsReleasedLoaded = state => get(state, 'royaltyPayments.released.loaded', false)
export const royaltyPaymentsReleasedLoadedSelector = createSelector(royaltyPaymentsReleasedLoaded, l => l)

const royaltyPaymentsReleased = state => get(state, 'royaltyPayments.released.data', [])
export const royaltyPaymentsReleasedSelector = createSelector(royaltyPaymentsReleased, rpr => rpr)

const allPayeesLoaded = state => get(state, 'royaltyPayments.payees.loaded', false)
export const allPayeesLoadedSelector = createSelector(allPayeesLoaded, l => l)

const allPayees = state => get(state, 'royaltyPayments.payees.data', [])
export const payeeSharesSelector = createSelector(allPayees, account, (allPayees, account) => {
  let payeeShares
  
  for(let i=0;i<allPayees.length;i++){
    if(account === allPayees[i].account) {
      payeeShares = allPayees[i].shares
    }
  }
  
  return payeeShares
})

// EXCHANGE

const exchange = state => get(state, 'exchange.contract')
export const exchangeSelector = createSelector(exchange, e => e)

const exchangeLoaded = state => get(state, 'exchange.loaded',)
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el)

const allListingsLoaded = state => get(state, 'exchange.allListings.loaded', false)
export const allListingsLoadedSelector = createSelector(allListingsLoaded, status => status)

const allCancelledLoaded = state => get(state, 'exchange.allCancelled.loaded', false)
export const allCancelledLoadedSelector = createSelector(allCancelledLoaded, status => status)

const allSalesLoaded = state => get(state, 'exchange.allSales.loaded', false)
export const allSalesLoadedSelector = createSelector(allSalesLoaded, status => status)

export const allListingTypesLoadedSelector = createSelector(
  allListingsLoaded,
  allCancelledLoaded,
  allSalesLoaded,
  (ll, cl, sl) => (ll, cl, sl)
)

const listingCancelling = state => get(state, 'exchange.listingCancelling', false)
export const listingCancellingSelector = createSelector(listingCancelling, status => status)

const listingPurchasing = state => get(state, 'exchange.listingPurchasing', false)
export const listingPurchasingSelector = createSelector(listingPurchasing, status => status)

const allListings = state => get(state, 'exchange.allListings.data', [])
const allCancelled = state => get(state, 'exchange.allCancelled.data', [])
const allSales = state => get(state, 'exchange.allSales.data', [])

export const allOwnerSalesSelector = createSelector(allSales, account, (allSales, account) => {
  const allOwnerSales = allSales.filter((s) => s.from === account)
  return allOwnerSales
})

export const allOpenListingsSelector = createSelector(allListings, allCancelled, allSales, account, royaltyPercent, (listings, cancelled, sales, account, royaltyPercent) => {
  let allOpenListings = reject(listings, (listing) => {
    const listingCancelled = cancelled.some((l) => l.listingId === listing.listingId)
    const listingSold = sales.some((l) => l.listingId === listing.listingId)
    return (listingCancelled || listingSold)
  })

  allOpenListings = decorateOpenListings(allOpenListings, account, royaltyPercent)

  return allOpenListings
})

const decorateOpenListings = (allOpenListings, account, royaltyPercent) => {
  return(
    allOpenListings.map((listing) => {
      listing = addButtonText(listing, account)
      listing = addRoyaltyAmount(listing, royaltyPercent)
      listing = addTotalCost(listing)
      return listing
    })
  )
}

const addButtonText = (listing, account) => {
  let buttonText

  if (listing.seller === account) {
    buttonText = "Cancel"
  } else {
    buttonText = "Buy"
  }

  return({
    ...listing,
    buttonText
  })
}

const addRoyaltyAmount = (listing, royaltyPercent) => {
  const royaltyAmount = parseInt(listing.price) * royaltyPercent / 10000

  return({
    ...listing,
    royaltyAmount
  })
}

const addTotalCost = (listing) => {
  const totalCost = parseInt(listing.price) + parseInt(listing.royaltyAmount)

  return({
    ...listing,
    totalCost
  })
}

// TODO: move

const allNFTsLoaded = state => get(state, 'token.allNFTs.loaded', false)
export const allNFTsLoadedSelector = createSelector(allNFTsLoaded, nftl => nftl)

export const allNFTsSelector = createSelector(allTransferSingles, allListings, allCancelled, allSales, (allTransferSingles, listings, cancelled, sales) => {
  let allNFTs = allTransferSingles.filter((t) => t.from === FRESH_MINT)

  let allOpenListings = reject(listings, (listing) => {
    const listingCancelled = cancelled.some((l) => l.listingId === listing.listingId)
    const listingSold = sales.some((l) => l.listingId === listing.listingId)
    return (listingCancelled || listingSold)
  })

  allNFTs = decorateAllNFTs(allNFTs, allOpenListings)
  
  return allNFTs
})

const decorateAllNFTs = (allNFTs, allOpenListings) => {
  return(
    allNFTs.map((nft) => {
      nft = addNumberForSale(nft, allOpenListings)
      return nft
    })
  )
}

const addNumberForSale = (nft, allOpenListings) => {
  let numberForSale = 0

  for(let i=0;i<allOpenListings.length;i++){
    if(nft.id === allOpenListings[i].tokenId) {
      numberForSale += parseInt(allOpenListings[i].value)
    }
  }

  return({
    ...nft,
    numberForSale
  })
}

// TODO: move

export const myNFTsSelector = createSelector(allTransferSingles, allSales, account, allListings, allCancelled, (allTransferSingles, sales, account, listings, cancelled) => {
  const allNFTs = allTransferSingles.filter((t) => t.from === FRESH_MINT)

  let allOpenListings = reject(listings, (listing) => {
    const listingCancelled = cancelled.some((l) => l.listingId === listing.listingId)
    const listingSold = sales.some((l) => l.listingId === listing.listingId)
    return (listingCancelled || listingSold)
  })

  const myNFTs = decorateMyNFTs(sales, allNFTs, account, allOpenListings)
  return myNFTs
})

const decorateMyNFTs = (allSales, allNFTs, account, allOpenListings) => {
  return(
    allNFTs.map((nft) => {
      nft = addNumberForSale(nft, allOpenListings)
      nft = addCurrentValue(allSales, nft, account, allNFTs)
      return nft
    })
  )
}

const addCurrentValue = (allSales, nft, account, allNFTs) => {
  let currentValue = 0

  const filteredSales = allSales.filter((s) => s.tokenId === nft.id)

  for(let i=0;i<filteredSales.length;i++){
    if(account === filteredSales[i].to) {
      currentValue += parseInt(filteredSales[i].value)
    }
    if(account === filteredSales[i].from) {
      currentValue -= parseInt(filteredSales[i].value)
    }
  }

  for(let i=0;i<allNFTs.length;i++){
    if(account === allNFTs[i].to && nft.id == allNFTs[i].id) {
      currentValue += parseInt(allNFTs[i].value)
    }
  }

  return({
    ...nft,
    currentValue
  })
}

// TODO: move

const newListingTokenId = state => get(state, 'exchange.newListingTokenId')
export const newListingTokenIdSelector = createSelector(newListingTokenId, tid => tid)

const newListingValue = state => get(state, 'exchange.newListingValue')
export const newListingValueSelector = createSelector(newListingValue, v => v)

const newListingPrice = state => get(state, 'exchange.newListingPrice')
export const newListingPriceSelector = createSelector(newListingPrice, p => p)

// TODO: move

// const exchangeApproved = state => get(state, 'exchange.newListingPrice')
// export const newListingPriceSelector = createSelector(exchangeApproved, p => p)

const approvalForAllLoaded = state => get(state, 'token.approvalForAll.loaded')
export const approvalForAllLoadedSelector = createSelector(approvalForAllLoaded, l => l)

const approvalForAll = state => get(state, 'token.approvalForAll.data')

export const exchangeApprovalStatusSelector = createSelector(approvalForAll, account, exchange, (approvalForAll, account, exchange) => {
  let approvalStatus = false
  const approvalsByAccount = approvalForAll.filter((a) => a.account === account)

  for(let i=0;i<approvalsByAccount.length;i++){
    if(exchange.options.address === approvalsByAccount[i].operator) {
      approvalStatus = true
    }
  }
  
  return approvalStatus
})