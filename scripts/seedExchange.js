// set constants
let URI_STRING = "www.me.com/"
let ROYALTY_PERCENT = "1000"

const RoyaltyPayments = artifacts.require('../src/contracts/RoyaltyPayments.sol')
const Exchange = artifacts.require('../src/contracts/Exchange.sol')
const Token = artifacts.require('../src/contracts/Token.sol')

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports = async function(callback) {
  try {
    console.log('script is running')

    // GET ACCOUNTS
    const accounts = await web3.eth.getAccounts()
    const mozisDeployer = accounts[0]
    const mozisRoyaltyPayments = accounts[1]
    const artist = accounts[2]
    const buyer = accounts[3]
    const tester = accounts[4]

    // GET CONTRACTS

    // royalty payments
    const payees = [artist, mozisRoyaltyPayments]
    const shares = [90, 10]

    const royaltyPayments = await RoyaltyPayments.deployed(
      payees,
      shares,
      { from: mozisDeployer }
    )
    console.log('RoyaltyPayments fetched')

    // token
    const token = await Token.deployed(
      artist,
      URI_STRING,
      royaltyPayments.address,
      ROYALTY_PERCENT,
      { from: mozisDeployer }
    )
    console.log('Token fetched')

    // exchange
    const exchange = await Exchange.deployed(
      { from: mozisDeployer }
    )
    console.log('Exchange fetched')

    // approve exchange to move tokens - artist
    await token.setApprovalForAll(exchange.address, true, { from: artist })
    console.log('Exchange approved by artist')

    // create listings
    await exchange.createListing(token.address, 0, 1, web3.utils.toWei('1', 'ether'), { from: artist })
    await wait(1)
    console.log('listing 1 created- value: 1, price: 1eth')

    await exchange.createListing(token.address, 0, 1, web3.utils.toWei('2', 'ether'), { from: artist })
    await wait(1)
    console.log('listing 2 created- value: 1, price: 2eth')

  } catch (error) {
    console.log(error)
  }

  callback()
}