import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs } from 'react-bootstrap'
import './App.css'
import Financials from './Financials'
import SalesStatistics from './SalesStatistics'

class DashboardBrandOwner extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props)
  }

  async loadBlockchainData(props) {
  }

  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          Dashbaord - Brand Owner
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="financials" className="bg-dark text-white">
            <Tab eventKey="financials" title="Financials" className="bg-dark">
              <Financials />
            </Tab>
            <Tab eventKey="statistics" title="Statistics" className="bg-dark">
              <SalesStatistics />
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
}

export default connect(mapStateToProps)(DashboardBrandOwner)