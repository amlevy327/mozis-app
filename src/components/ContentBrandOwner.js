import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
// import {
// } from '../store/interactions'
import {
  allTransferSinglesLoadedSelector
} from '../store/selectors'
import Spinner from './Spinner'
import AllNFTs from './AllNFTs'

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
          { this.props.showAllNFTsComponent ? <AllNFTs /> : <Spinner type="table"/> }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const allTransferSinglesLoaded = allTransferSinglesLoadedSelector(state)
  
  return {
    showAllNFTsComponent: allTransferSinglesLoaded
  }
}

export default connect(mapStateToProps)(ContentBrandOwner)