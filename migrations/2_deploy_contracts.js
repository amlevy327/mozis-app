const RoyaltyPayments = artifacts.require('../contracts/RoyaltyPayments.sol')
const Token = artifacts.require('../contracts/Token.sol')
const Exchange = artifacts.require('../contracts/Exchange.sol')

let URI_STRING = "www.me.com/"
let ROYALTY_PERCENT = "1000"

module.exports = async function(deployer) {

  const accounts = await web3.eth.getAccounts()
  const mozisDeployer = accounts[0]
  const mozisRoyaltyPayments = accounts[1]
  const artist = accounts[2]

  const payees = [artist, mozisRoyaltyPayments]
  const shares = [90, 10]

  const royaltyPayments = await deployer.deploy(RoyaltyPayments,
    payees,
    shares,
    { from: mozisDeployer }
  )

  await deployer.deploy(Token,
    artist,
    URI_STRING,
    royaltyPayments.address, // change this to royaltyPayments.address
    ROYALTY_PERCENT,
    { from: mozisDeployer }
  )

  await deployer.deploy(Exchange,
    { from: mozisDeployer }
  )
};
