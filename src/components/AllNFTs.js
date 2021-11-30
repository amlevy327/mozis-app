import React, { Component } from 'react'
import { connect } from "react-redux"
import { Tab, Tabs } from 'react-bootstrap'
import Spinner from './Spinner'
import {
  allNFTsSelector,
  allNFTsLoadedSelector,
  allListingTypesLoadedSelector,
  allOpenListingsSelector,
  accountSelector,
  exchangeSelector,
  myNFTsSelector,
  tokenContractOwnerSelector,
  tokenSelector,
  tokensMetadataSelector
} from '../store/selectors'
// import {
// } from '../store/selectors'
import {
  cancelListing,
  purchaseListing,
  loadAllMetaData
} from '../store/interactions'
// import {
// } from '../store/actions'
import { ether } from '../helpers.js'

const showAllNFTs = (props) => {
  const {
    allNFTs,
    tokensMetadata
  } = props

  if (allNFTs.length === tokensMetadata.length) {
    console.log("AML lengths are equal")
    return(
      <tbody>
        { allNFTs.map((nft) => {
          return(
            <tr className={`nft-${nft.id}`} key={nft.id}>
              <td>
                <img src={tokensMetadata[nft.id].image} alt="N/A" width="100" height="100"></img>
              </td>
              <td>{tokensMetadata[nft.id].name}</td>
              <td>{nft.id}</td>
              <td>{nft.value}</td>
              <td>{nft.numberForSale}</td>
              <td>{showFormattedPrice(nft.min)}</td>
              <td>{showFormattedPrice(nft.max)}</td>
              <td>{nft.showPrice}</td>
              <td>{showFormattedNumber(nft.numberSales)}</td>
              <td>{showFormattedPrice(nft.lastSalePrice)}</td>
            </tr>
          )
        })
        }
      </tbody>
    )
  } else {
    console.log("AML lengths are NOT equal")
    return(<div></div>)
  }
}

const showFormattedPrice = (price) => {
  if (price === 0 ) {
    return "No Sales"
  } else {
    return ether(price)
  }
}

const showFormattedNumber = (number) => {
  if (number === 0 ) {
    return "No Sales"
  } else {
    return number
  }
}

const showAllOpenListings = (props) => {
  const {
    allOpenListings,
    tokensMetadata,
    allNFTs
  } = props

  if (allNFTs.length === tokensMetadata.length) {
    console.log("AML lengths are equal")
    return(
      <tbody>
        { allOpenListings.map((listing) => {
          console.log("AML tokensMetadata: ", tokensMetadata)
          console.log("AML listing.tokenId: ", listing.tokenId)
          return(
            <tr className={`listing-${listing.listingId}`} key={listing.listingId}>
              <td>
                <img src={tokensMetadata[listing.tokenId].image} alt="N/A" width="100" height="100"></img>
              </td>
              <td>{tokensMetadata[listing.tokenId].name}</td>
              <td>{listing.listingId}</td>
              <td>{listing.value}</td>
              <td>{ether(listing.price)}</td>
              <td>{ether(listing.royaltyAmount)}</td>
              <td>{ether(listing.totalCost)}</td>
              <td
                  className="text-muted cancel-order"
                  onClick={(e) => {
                    completeListingAction(props, listing)
                  }}
              >{listing.buttonText}</td>
            </tr>
          )
        })
        }
      </tbody>
    )
  } else {
    console.log("AML lengths are NOT equal")
    return(<div></div>)
  }
}

const completeListingAction = (props, listing) => {
  const {
    account,
    exchange,
    dispatch
  } = props

  switch(listing.buttonText) {
    case "Cancel":
      console.log("AML cancel button text action")
      cancelListing(dispatch, account, exchange, listing)
      break
    case "Buy":
      console.log("AML buy button text action")
      purchaseListing(dispatch, account, exchange, listing)
      break
    default:
      console.log("AML no button text action")
  }
}

const showMyNFTs = (props) => {
  const {
    myNFTs,
    tokensMetadata,
    allNFTs
  } = props

  if (allNFTs.length === tokensMetadata.length) {
    console.log("AML lengths are equal")
    return(
      <tbody>
        { myNFTs.map((nft) => {
          if (nft.currentValue > 0) {
            return(
              <tr className={`nft-${nft.id}`} key={nft.id}>
                <td>
                  <img src={tokensMetadata[nft.id].image} alt="N/A" width="100" height="100"></img>
                </td>
                <td>{tokensMetadata[nft.id].name}</td>
                <td>{nft.id}</td>
                <td>{nft.currentValue}</td>
                <td>{nft.value}</td>
                <td>{nft.numberForSale}</td>
              </tr>
            )
          } else {
            return
          }
        })
        }
      </tbody>
    )
  } else {
    console.log("AML lengths are NOT equal")
    return(<div></div>)
  }
}

const showUserType = (props) => {
  const {
    account,
    owner
  } = props

  if (account === owner) {
    return "Brand Owner"
  } else {
    return "Customer"
  }
}

class AllNFTs extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    const {
      token,
      dispatch,
      allNFTs
    } = props

    await loadAllMetaData(token, allNFTs, dispatch)
  }

  render() {
    console.log('AML this.props.allNFTs.length: ', this.props.allNFTs.length)
    console.log('AML tokensMetadata.length: ', this.props.tokensMetadata.length)

    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          {/* { showUserType(this.props) } */}
          Landing Page
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="collection" className="bg-dark text-white">
            <Tab eventKey="collection" title="Collection" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>NFT ID</th>
                    <th># Minted</th>
                    <th># For Sale</th>
                    <th>History Min Price</th>
                    <th>History Max Price</th>
                    <th># Sales</th>
                    <th>Last Sale Price (eth)</th>
                  </tr>
                </thead>
                { this.props.showAll ? showAllNFTs(this.props) : <Spinner type="table"/> }
              </table>
            </Tab>
            <Tab eventKey="marketplace" title="Marketplace" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Listing ID</th>
                    <th># For Sale</th>
                    <th>Price (eth)</th>
                    <th>Royalty Amount (eth)</th>
                    <th>Total Cost (eth)</th>
                    <th></th>
                  </tr>
                </thead>
                { this.props.showAll ? showAllOpenListings(this.props) : <Spinner type="table"/> }
              </table>
            </Tab>
            <Tab eventKey="my" title="My NFTs" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>NFT ID</th>
                    <th># Owned</th>
                    <th># Minted</th>
                    <th># For Sale</th>
                  </tr>
                </thead>
                { this.props.showAll ? showMyNFTs(this.props) : <Spinner type="table"/> }
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const allNFTsLoaded = allNFTsLoadedSelector(state)
  const allListingTypesLoaded = allListingTypesLoadedSelector(state)

  return {
    showAll: allListingTypesLoaded && allNFTsLoaded,
    allNFTsLoaded: allNFTsLoadedSelector(state),
    allNFTs: allNFTsSelector(state),
    allOpenListings: allOpenListingsSelector(state),
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    owner: tokenContractOwnerSelector(state),
    token: tokenSelector(state),
    myNFTs: myNFTsSelector(state),
    myNFTsLength: myNFTsSelector(state),
    tokensMetadata: tokensMetadataSelector(state)
  }
}

export default connect(mapStateToProps)(AllNFTs)