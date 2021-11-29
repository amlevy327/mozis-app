import React, { Component } from 'react'
import { connect } from "react-redux"
import Spinner from './Spinner'
import {
  allNFTsSelector,
  allNFTsLoadedSelector,
  tokensMetadataSelector
} from '../store/selectors'
import {
} from '../store/interactions'
import { ether } from '../helpers.js'

const showStatistics = (props) => {
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
              <td>{showFormattedPrice(nft.directSalePrice)}</td>
              <td>{showFormattedNumber(nft.numberSales)}</td>
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

class SalesStatistics extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-body">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>NFT ID</th>
              <th># Minted</th>
              <th>Direct Sale Price (eth)</th>
              <th># Sales</th>
            </tr>
          </thead>
          { this.props.showAll ? showStatistics(this.props) : <Spinner type="table"/> }
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const allNFTsLoaded = allNFTsLoadedSelector(state)

  return {
    showAll: allNFTsLoaded,
    allNFTs: allNFTsSelector(state),
    tokensMetadata: tokensMetadataSelector(state)
  }
}

export default connect(mapStateToProps)(SalesStatistics)