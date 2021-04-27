const Web3 = require("web3")
const { readFileSync } = require('fs')
const { promisify } = require("util")
const web3 = new Web3("https://bsc-dataseed.binance.org/")
const { eth, utils } = web3
const { Contract } = eth
const { toWei } = utils

// BNB bunny proxy address
const contractAddress = "0x52cfa188a1468a521a98eaa798e715fbb9eb38a3"

// CAKE bunny proxy address
// const contractAddress = "0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed"

// lib - TODO: extract

const signTransaction = (txAttrs, privateKey) => {
  return new Promise((resolve, reject) => {
    const txCallback = (err, signedTx) => {
      if (err) return reject(err)
      if (!signedTx.rawTransaction) return reject(new Error("NoRawTransactionError"))
      resolve(signedTx.rawTransaction)
    }
    eth.accounts.signTransaction(txAttrs, privateKey, txCallback)
  })
}

const resolveTxHash = (txHashPromise) => (
  new Promise((resolve, reject) => {
    const txHashCallback = (txHash) => {
      console.log("txHash:", txHash)
      return resolve(txHash)
    }
    txHashPromise.on('transactionHash', txHashCallback)
  })
)

const pvtKey = readFileSync('./.private-key-bsc.txt').toString().trim()
if (!pvtKey) {
  console.error("private key is empty - generate, backup and load a private key first")
  process.exit(1)
}
const account = eth.accounts.privateKeyToAccount(pvtKey)
const { address } = account

const pools = ["bnb", "cake"]
const pool = "bnb"
const abiPath = `abi/${pool}`
const ABI = require(abiPath)

const claimAndWithdrawTokens = () => {
  // TODO:
}

const claimTokens = () => {
  let swap = new Contract(ABI, contractAddress)
  swap = swap.methods

  const getRewardData = swap.getReward().encodeABI()

  // TODO: estimategas
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    // gas:      "21000", // normal tx
    gas:      "552000", // normal tx
    to:       contractAddress,
    data:     getRewardData,
  }

  const rawTx = await signTransaction(txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)

  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

const depositTokens = () => {
  let swap = new Contract(ABI, contractAddress)
  swap = swap.methods

  const depositBNBData = swap.depositBNB().encodeABI()

  // sample deposit amount
  const depositAmountBNB = "0.001"
  const depositAmount = toWei(depositAmountBNB, "ether")

  const data = depositBNBData
  // TODO: estimategas
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    // gas:      "21000", // normal tx
    gas:      "552000", // normal tx
    to:       contractAddress,
    value:    depositAmount,
    data:     data,
  }

  const rawTx = await signTransaction(txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)

  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}


const TOKEN = "BNB"
const deinvestTokenPriceTreshold = 510

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

  if (price < deinvestTokenPriceTreshold && balance > 0) {
    await deinvest()
  }
}

;(async () => {

  const fiveMinutes = 1000*60*5
  setInterval(deinvestLoop, fiveMinutes)

})()
