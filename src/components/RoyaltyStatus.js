import React, { Component } from 'react'
import { connect } from "react-redux"
import { Tab, Tabs } from 'react-bootstrap'
import Spinner from './Spinner'
import {
  accountSelector,
  allSalesLoadedSelector,
  allOwnerSalesSelector,
  royaltyPaymentsReceivedLoadedSelector,
  royaltyPaymentsReceivedSelector,
  royaltyPaymentsReleasedLoadedSelector,
  royaltyPaymentsReleasedSelector,
  royaltyPaymentsSelector,
  royaltyPaymentsLoadedSelector
} from '../store/selectors'
import {
  withdrawRoyalties
} from '../store/interactions'
// import {
// } from '../store/actions'
import { ether } from '../helpers.js'

const showFinancials = (props) => {
  console.log('showFinancials')

  const {
    royaltyPaymentsReceived,
    royaltyPaymentsReleased,
    allOwnerSales,
    account,
    royaltyPayments,
    dispatch
  } = props

  return(
    <table className="table table-dark table-sm small">
      <tbody>
        <tr>
          <td>Royalties to Withdraw</td>
          <td>{calculateTotalAvailableToWithdraw(royaltyPaymentsReceived, royaltyPaymentsReleased)}</td>
          <td
                className="text-muted cancel-order"
                onClick={(e) => {
                  withdrawRoyalties(dispatch, account, royaltyPayments)
                }}
            >Withdraw</td>
        </tr>
        <tr>
          <td>Total Withdrawn</td>
          <td>{calculateTotalReleased(royaltyPaymentsReleased)}</td>
        </tr>
        <tr>
          <td>Direct Sales</td>
          <td>{calculateDirectSales(allOwnerSales)}</td>
        </tr>
        <tr>
          <td>TOTAL REVENUE</td>
          <td>{calculateTotalAvailableToWithdraw(royaltyPaymentsReceived, royaltyPaymentsReleased) + calculateTotalReleased(royaltyPaymentsReleased) + calculateDirectSales(allOwnerSales)}</td>
        </tr>
      </tbody>
    </table>
  )
}

const calculateTotalAvailableToWithdraw = (royaltyPaymentsReceived, royaltyPaymentsReleased) => {
  let totalAvailable = 0

  for(let i=0;i<royaltyPaymentsReceived.length;i++){
    if (royaltyPaymentsReceived[i]){
      totalAvailable += parseInt(royaltyPaymentsReceived[i].amount)
    }
  }

  totalAvailable = totalAvailable * 90 / 100

  for(let i=0;i<royaltyPaymentsReleased.length;i++){
    if (royaltyPaymentsReleased[i]){
      totalAvailable -= parseInt(royaltyPaymentsReleased[i].amount)
    }
  }

  if(totalAvailable === 0 ){
    return 0
  } else {
    return ether(totalAvailable)
  }
}

const calculateTotalReleased = (royaltyPaymentsReleased) => {
  let totalReleased = 0

  for(let i=0;i<royaltyPaymentsReleased.length;i++){
    if (royaltyPaymentsReleased[i]){
      totalReleased += parseInt(royaltyPaymentsReleased[i].amount)
    }
  }
  return ether(totalReleased)
}

const calculateDirectSales = (allOwnerSales) => {
  let totalDirectSales = 0

  console.log('AML allOwnerSales: ', allOwnerSales)

  for(let i=0;i<allOwnerSales.length;i++){
    if (allOwnerSales[i]){
      totalDirectSales += parseInt(allOwnerSales[i].price)
    }
  }

  console.log('AML totalDirectSales: ', totalDirectSales)

  return ether(totalDirectSales)
}

class RoyaltyStatus extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          Financials
        </div>
        <div className="card-body">
          { this.props.showAll ? showFinancials(this.props) : <Spinner type="table" /> }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {

  const royaltyPaymentsReceivedLoaded = royaltyPaymentsReceivedLoadedSelector(state)
  const royaltyPaymentsReleasedLoaded = royaltyPaymentsReleasedLoadedSelector(state)
  const allSalesLoaded = allSalesLoadedSelector(state)
  const royaltyPaymentsLoaded = royaltyPaymentsLoadedSelector(state)

  return {
    showAll: royaltyPaymentsReceivedLoaded && royaltyPaymentsReleasedLoaded && allSalesLoaded && royaltyPaymentsLoaded,
    royaltyPaymentsReceived: royaltyPaymentsReceivedSelector(state),
    royaltyPaymentsReleased: royaltyPaymentsReleasedSelector(state),
    account: accountSelector(state),
    allOwnerSales: allOwnerSalesSelector(state),
    royaltyPayments: royaltyPaymentsSelector(state),
  }
}

export default connect(mapStateToProps)(RoyaltyStatus)