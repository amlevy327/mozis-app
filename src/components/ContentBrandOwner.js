import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
// import {
// } from '../store/interactions'
import {
  allTransferSinglesLoadedSelector,
  allListingTypesLoadedSelector
} from '../store/selectors'
import Spinner from './Spinner'
import AllNFTs from './AllNFTs'
import RoyaltyStatus from './RoyaltyStatus'

class ContentBrandOwner extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
    // const {
    // } = props
  }

  render() {
    return (
      <div>
        <div className="content">
          { this.props.showAllNFTsComponent ? <RoyaltyStatus /> : <Spinner type="table"/> }
          { this.props.showAllNFTsComponent ? <AllNFTs /> : <Spinner type="table"/> }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const allTransferSinglesLoaded = allTransferSinglesLoadedSelector(state)
  const allListingTypesLoaded = allListingTypesLoadedSelector(state)
  
  return {
    showAllNFTsComponent: allTransferSinglesLoaded && allListingTypesLoaded
  }
}

export default connect(mapStateToProps)(ContentBrandOwner)