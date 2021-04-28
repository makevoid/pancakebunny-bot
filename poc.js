const Web3 = require("web3")
const { promisify } = require("util")
const { loadAccount } = require("./lib/account")
const { loadPrivateKey } = require("./lib/pvt-key")
const {
  signTransaction,
  resolveTxHash,
  estimateGas
} = require("./lib/tx")
const web3 = new Web3("https://bsc-dataseed.binance.org/")
const { eth, utils } = web3
const { Contract } = eth
const { toWei } = utils

// configs

const TOKEN = "CAKE"
const DEINVEST_PRICE_TRESHOLD = 510 // withdraw under this price

const CLAIM_WEEKLY_ACTIVE = true
const DEINVEST_ACTIVE = false

// Bunny Pools proxy contracts addresses
const poolContractAddresses = {
  CAKE: "0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed",
  USDT: "0x0Ba950F0f099229828c10a9B307280a450133FFc",
  BTCB: "0x549d2e2B4fA19179CA5020A981600571C2954F6a",
  // ...
}

const privateKeyPath = "./.private-key-bsc.txt"
const pvtKey = loadPrivateKey(privateKeyPath)
const address = loadAccount(eth, pvtKey)


const claimAndWithdrawTokens = async () => {
  // TODO:
}

const depositTokens = async () => {

}

const withdrawTokens = async () => {
  const methodName = "withdrawUnderlying"

  let contract = new Contract(ABI, contractAddress)
  contract = contract.methods

  console.log(Object.keys(contract))
  process.exit()
  // const amount = contract.

  const method = contract[methodName]()

  const data = method.encodeABI()
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    data:     data,
    from:     address,
  }
  const gas = await estimateGas({ method, txAttrs })
  txAttrs.gas = gas

  const rawTx = await signTransaction(txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)

  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

const claimTokens = async () => {
  const methodName = "getReward"

  let contract = new Contract(ABI, contractAddress)
  contract = contract.methods
  const method = contract[methodName]()

  const data = method.encodeABI()
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    data:     data,
    from:     address,
  }
  const gas = await estimateGas({ method, txAttrs })
  txAttrs.gas = gas

  const rawTx = await signTransaction(txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)

  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

const deinvest = async () => {
  await claimAndWithdrawTokens()
}

const reinvest = async () => {
  await claimTokens()
  await zapToken()
  await depositTokens()
}

const reinvestLoop = async () => {
  // if (oneWeekPassed) {
  //   await reinvest()
  // }
}

const deinvestLoop = async () => {
  const price = await tokenPrice()
  const balance = await tokenPoolBalance()

  if (price < DEINVEST_PRICE_TRESHOLD && balance > 0) {
    await deinvest( // withdraw under this price)
  }
}

// setInterval(deinvestLoop, fiveMinutes)

const claimWeekly = async () => {
  const oneWeek = 604800 * 1000
  await claimTokens()
  setInterval(claimTokens, oneWeek)
}

const checkPriceAndDeinvest = async () => {
  // TODO:
  // const fiveMinutes = 1000*60*5
  // setInterval(deinvestLoop, fiveMinutes)
}

const mainFn = async () => {
  if (CLAIM_WEEKLY_ACTIVE) await claimWeekly()
  if (DEINVEST_ACTIVE) await checkPriceAndDeinvest()

  // test functions - put CLAIM_WEEKLY_ACTIVE and DEINVEST_ACTIVE as false and uncomment to use
  // depositBNB()
  // ...
}

const main = () => {
  ;(async () => {
    try {
      await mainFn()
    } catch (err) {
      console.error("-ERROR-")
      console.error(err)
    }
  })()
}

main()
