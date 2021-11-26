import React, { Component } from 'react'
import { connect } from 'react-redux'
import './App.css'
import {
  loadWeb3,
  loadAccount
} from '../store/interactions'
// import {
// } from '../store/selectors'

// import Navbar from './Navbar'
// import Spinner from './Spinner'
// import ContentArtist from './ContentArtist'
// import ContentNonArtist from './ContentNonArtist'

// const showContent = (props) => {
//   const {
//     account,
//     artistFeeAccount
//   } = props
  
//   if(account === artistFeeAccount){
//     return(
//       <div className="content">
//         <ContentArtist />
//       </div>
//     )
//   } else {
//     return(
//       <div className="content">
//         <ContentNonArtist />
//       </div>
//     )
//   }
// }

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    await window.ethereum.enable() // not sure if need this?
    const web3 = await loadWeb3(dispatch)
    const networkId = await web3.eth.net.getId()
    await loadAccount(web3, dispatch)
    // const tokens = await loadTokens(web3, networkId, dispatch)
    // if (!tokens) {
    //   window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
    // }
    // const artFactory = await loadArtFactory(web3, networkId, dispatch)
    // if(!artFactory) {
    //   window.alert('Art Factory smart contract not detected on the current network. Please select another network with Metamask.')
    // }
    
    // await loadArtistFeeAccount(artFactory, dispatch)
  }

  render() {
    return (
      <div>
        {/* <Navbar /> */}
        {/* { this.props.showAll ? showContent(this.props) : <Spinner /> } */}
      </div>
    )
  }
}

function mapStateToProps(state) {
  // const allStartupLoaded = allStartupLoadedSelector(state)
  // const artistFeeAccountLoaded = artistFeeAccountLoadedSelector(state)
  
  // return {
  //   showAll: allStartupLoaded && artistFeeAccountLoaded,
  //   account: accountSelector(state),
  //   artistFeeAccount: artistFeeAccountSelector(state)
  // }
}

export default connect(mapStateToProps)(App)