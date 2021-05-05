const Web3 = require("web3")
const { promisify } = require("util")
const { loadAccount } = require("./lib/account")
const { loadPrivateKey } = require("./lib/pvt-key")
const { depositBNB } = require("./lib/bnb-pool")
const {
  printStatus,
  depositTokens,
  claimTokens,
  withdrawTokens,
} = require("./lib/pool")
const { swapBunnyToToken } = require("./lib/zap")
const web3 = new Web3("https://bsc-dataseed.binance.org/")
const { eth, utils } = web3


// configs

const TOKEN = "CAKE"
const DEINVEST_PRICE_TRESHOLD = 30 // withdraw all tokens (e.g. CAKEs) under this price

// const CLAIM_WEEKLY_ACTIVE = true
const CLAIM_WEEKLY_ACTIVE = false
const DEINVEST_ACTIVE = false

// ---

const privateKeyPath = "./.private-key-bsc.txt"
const pvtKey = loadPrivateKey(privateKeyPath)
const address = loadAccount(eth, pvtKey)
//
// const claimAndWithdrawTokens = async () => {
//   // TODO:
// }

// const deinvest = async () => {
//   await claimAndWithdrawTokens()
// }

// const reinvest = async () => {
//   await claimTokens()
//   await zapToken()
//   await depositTokens()
// }

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
  const pool = "CAKE"

  const claimThreshold = 10 // USD - claim tokens if proft is above this number
  const depositThreshold = 9 // USD - deposit tokens if value of tokens is above this amount
  const swapThreshold = 8 // USD - swap tokens if wallet balance (converted in USDs) is higher than this value

  await printStatus({ eth, pool, address })

  process.exit()
  console.log("uncomment and run the code below at your own risk - this code is still WIP")

  // claim all tokens
  // await claimTokens({ eth, pool, address, pvtKey, claimThreshold })

  // deposit new tokens from the wallet balance
  // await depositTokens({ eth, pool, depositThreshold, address, pvtKey })

  // zap claimed bunnies to token so they can be deposited
  // await swapBunnyToToken({ eth, token: pool, address, pvtKey, swapThreshold })
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
