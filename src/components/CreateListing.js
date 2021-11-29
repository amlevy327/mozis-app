import React, { Component } from 'react'
import { connect } from "react-redux"
import Spinner from './Spinner'
import {
  newListingTokenIdChanged,
  newListingValueChanged,
  newListingPriceChanged,
} from '../store/actions'
import {
  createListing,
  approveExchange
} from '../store/interactions'
import {
  accountSelector,
  approvalForAllLoadedSelector,
  exchangeApprovalStatusSelector,
  exchangeSelector,
  myNFTsSelector,
  newListingPriceSelector,
  newListingTokenIdSelector,
  newListingValueSelector,
  tokenSelector
} from '../store/selectors'

const showForm = (props) => {
  const {
    dispatch,
    account,
    exchange,
    token,
    tokenId,
    value,
    price,
    myNFTs,
    approvalStatus
  } = props

  return(
    <form onSubmit={(event) => {
      event.preventDefault()
      console.log('AML submitted new listing')
      checkNewListingInputs(account, exchange, token, tokenId, value, price, myNFTs, dispatch, approvalStatus)
    }}>
      <div className="form-group small">
        <label>Token ID</label>
        <div className="input-group"></div>
          <input
          type="text"
          placeholder="Token ID"
          onChange={(e) => dispatch(newListingTokenIdChanged(e.target.value))}
          className="form-control form-control-sm bg-dark text-white"
          required
          />
      </div>
      <div className="form-group small">
        <label># to Sell</label>
        <div className="input-group"></div>
          <input
          type="text"
          placeholder="# to sell"
          onChange={(e) => dispatch(newListingValueChanged(e.target.value))}
          className="form-control form-control-sm bg-dark text-white"
          required
          />
      </div>
      <div className="form-group small">
        <label>Total Cost (eth)</label>
        <div className="input-group"></div>
          <input
          type="text"
          placeholder="Total cost (eth)"
          onChange={(e) => dispatch(newListingPriceChanged(e.target.value * 10 **18))}
          className="form-control form-control-sm bg-dark text-white"
          required
          />
      </div>
      <button type="submit" className="btn btn-primary btm-sm btn-black">Create Listing</button>
    </form>
  )
}

const checkNewListingInputs = (account, exchange, token, tokenId, value, price, myNFTs, dispatch, approvalStatus) => {
  let nft = myNFTs.filter((nft) => nft.id === tokenId)
  
  if (nft.length === 0) {
    window.alert('You do not currently own this NFT.')
    return
  }

  nft = nft[0]
  if (value > (nft.currentValue - nft.numberForSale)) {
    window.alert('The number to sell you input is greater than the total you own minus current listings.')
    return
  }

  console.log('AML approvalStatus: ', approvalStatus)

  createListing(account, exchange, token, tokenId, value, price.toString(), dispatch, approvalStatus) // TODO: check own token id, own value
}

class CreateListing extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
            Create Listing
        </div>
        <div className="card-body">
          { showForm(this.props) }
          {/* { this.props.showAll ? showForm(this.props) : <Spinner type="table"/>} */}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const approvalForAllLoaded = approvalForAllLoadedSelector(state)
  
  return {
    showAll: approvalForAllLoaded,
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    tokenId: newListingTokenIdSelector(state),
    value: newListingValueSelector(state),
    price: newListingPriceSelector(state),
    myNFTs: myNFTsSelector(state),
    approvalStatus: exchangeApprovalStatusSelector(state)
  }
}

export default connect(mapStateToProps)(CreateListing)