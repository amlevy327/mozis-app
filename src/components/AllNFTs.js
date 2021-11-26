import React, { Component } from 'react'
import { connect } from "react-redux"
import { Tab, Tabs } from 'react-bootstrap'
import Spinner from './Spinner'
import {
  allNFTsSelector,
  allNFTsLoadedSelector
} from '../store/selectors'
// import {
// } from '../store/selectors'
// import {
// } from '../store/interactions'
// import {
// } from '../store/actions'

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
            <td
                className="text-muted cancel-order"
                onClick={(e) => {
                  console.log('button click: STATUS')
                  // purchaseArt(dispatch, artFactory, tokens, art, account, totalPrice)
                }}
            >STATUS</td>
          </tr>
        )
      })
      }
    </tbody>
  )
}

class AllNFTs extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
            Brand NFTs
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="sale" className="bg-dark text-white">
            <Tab eventKey="sale" title="All" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>ID</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                { showAllNFTs(this.props) }
                {/* { this.props.showAll ? showAllNFTs(this.props) : <Spinner type="table"/> } */}
              </table>
            </Tab>
            {/* <Tab eventKey="order" title="Create Order" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th></th>
                    <th>Gen</th>
                    <th></th>
                  </tr>
                </thead>
                { this.props.showAll ? showCreateOrder(this.props) : <Spinner type="table"/> }
              </table>
              { this.props.showAll ? showNumLegaciesForm(this.props) : <Spinner type="table"/> }
            </Tab> */}
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    allNFTsLoaded: allNFTsLoadedSelector(state),
    allNFTs: allNFTsSelector(state)
  }
}

export default connect(mapStateToProps)(AllNFTs)