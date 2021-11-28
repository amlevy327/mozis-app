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
  tokenContractOwnerSelector
} from '../store/selectors'
// import {
// } from '../store/selectors'
import {
  cancelListing,
  purchaseListing
} from '../store/interactions'
// import {
// } from '../store/actions'
import { ether } from '../helpers.js'

const showAllNFTs = (props) => {
  const {
    allNFTs
  } = props

  return(
    <tbody>
      { allNFTs.map((nft) => {
        return(
          <tr className={`nft-${nft.id}`} key={nft.id}>
            <td>
              {/* <img src={art.tokenURI} alt="N/A" width="100" height="100"></img> */}
            </td>
            <td>{nft.id}</td>
            <td>{nft.value}</td>
            <td>{nft.numberForSale}</td>
          </tr>
        )
      })
      }
    </tbody>
  )
}

const showAllOpenListings = (props) => {
  const {
    allOpenListings
  } = props

  return(
    <tbody>
      { allOpenListings.map((listing) => {
        return(
          <tr className={`listing-${listing.listingId}`} key={listing.listingId}>
            <td>
              {/* <img src={art.tokenURI} alt="N/A" width="100" height="100"></img> */}
            </td>
            <td>{listing.listingId}</td>
            <td>{listing.value}</td>
            <td>{listing.seller}</td>
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
    myNFTs
  } = props

  return(
    <tbody>
      { myNFTs.map((nft) => {
        if (nft.currentValue > 0) {
          return(
            <tr className={`nft-${nft.id}`} key={nft.id}>
              <td>
                {/* <img src={art.tokenURI} alt="N/A" width="100" height="100"></img> */}
              </td>
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
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          { showUserType(this.props) }
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="collection" className="bg-dark text-white">
            <Tab eventKey="collection" title="Collection" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>ID</th>
                    <th># Minted</th>
                    <th># For Sale</th>
                  </tr>
                </thead>
                { this.props.allNFTsLoaded ? showAllNFTs(this.props) : <Spinner type="table"/> }
              </table>
            </Tab>
            <Tab eventKey="marketplace" title="Marketplace" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Listing ID</th>
                    <th># For Sale</th>
                    <th>Seller</th>
                    <th>Price (eth)</th>
                    <th>Royalty Amount (eth)</th>
                    <th>Total Cost (eth)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                { this.props.allListingTypesLoaded ? showAllOpenListings(this.props) : <Spinner type="table"/> }
              </table>
            </Tab>
            <Tab eventKey="my" title="My NFTs" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>ID</th>
                    <th># Owned</th>
                    <th># Minted</th>
                    <th># For Sale</th>
                  </tr>
                </thead>
                { this.props.allListingTypesLoaded ? showMyNFTs(this.props) : <Spinner type="table"/> }
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    allNFTsLoaded: allNFTsLoadedSelector(state),
    allNFTs: allNFTsSelector(state),
    allListingTypesLoaded: allListingTypesLoadedSelector(state),
    allOpenListings: allOpenListingsSelector(state),
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    myNFTs: myNFTsSelector(state),
    owner: tokenContractOwnerSelector(state)
  }
}

export default connect(mapStateToProps)(AllNFTs)