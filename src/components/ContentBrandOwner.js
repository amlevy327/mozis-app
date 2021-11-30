import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
import {
  allTransferSinglesLoadedSelector,
  allListingTypesLoadedSelector,
  allNFTsLoadedSelector
} from '../store/selectors'
import Spinner from './Spinner'
import AllNFTs from './AllNFTs'
// import Financials from './Financials'
import DashboardBrandOwner from './DashboardBrandOwner'
import CreateListing from './CreateListing'

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
          <div className="vertical-split">
            { this.props.showAll ? <DashboardBrandOwner /> : <Spinner type="table"/> }
            { this.props.showAll ? <CreateListing /> : <Spinner type="table"/> }
          </div>
          { this.props.showAll ? <AllNFTs /> : <Spinner type="table"/> }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const allTransferSinglesLoaded = allTransferSinglesLoadedSelector(state)
  const allListingTypesLoaded = allListingTypesLoadedSelector(state)
  const allNFTsLoaded = allNFTsLoadedSelector(state)
  
  return {
    showAll: allTransferSinglesLoaded && allListingTypesLoaded && allNFTsLoaded
  }
}

export default connect(mapStateToProps)(ContentBrandOwner)