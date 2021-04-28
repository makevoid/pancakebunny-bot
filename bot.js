const Web3 = require("web3")
const { promisify } = require("util")
const { loadAccount } = require("./lib/account")
const { loadPrivateKey } = require("./lib/pvt-key")
const {
  signTransaction,
  resolveTxHash,
  estimateGas
} = require("./lib/tx")
const { depositBNB } = require("./lib/bnb-pool")
const { depositTokens } = require("./lib/pool")
const web3 = new Web3("https://bsc-dataseed.binance.org/")
const { eth, utils } = web3
const { Contract } = eth


// configs

const TOKEN = "CAKE"
const DEINVEST_PRICE_TRESHOLD = 510 // withdraw under this price

// const CLAIM_WEEKLY_ACTIVE = true
const CLAIM_WEEKLY_ACTIVE = false
const DEINVEST_ACTIVE = false

// ---

const privateKeyPath = "./.private-key-bsc.txt"
const pvtKey = loadPrivateKey(privateKeyPath)
const address = loadAccount(eth, pvtKey)


const claimAndWithdrawTokens = async () => {
  // TODO:
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
    // await deinvest( // withdraw under this price)
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
  // await depositBNB(...)
  await depositTokens({ eth, pool: "CAKE", depositAmount: "0.01" })
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
