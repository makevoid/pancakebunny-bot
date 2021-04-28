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

// Bunny Pools proxy contracts addresses
const poolContractAddresses = {
  cake: "0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed",
  usdt: "0x0Ba950F0f099229828c10a9B307280a450133FFc",
  btcb: "0x549d2e2B4fA19179CA5020A981600571C2954F6a",
  // ...
}

const privateKeyPath = "./.private-key-bsc.txt"
const pvtKey = loadPrivateKey(privateKeyPath)
const address = loadAccount(eth, pvtKey)

const pools = ["bnb", "cake"]
const pool = "bnb"
const abiPath = `./abi/${pool}`
const ABI = require(abiPath)

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

  // process.exit()


  // depositBNB()

  // withdrawTokens()

  // claimTokens()


  // depositBNB()
  // depositTokens()

  // const fiveMinutes = 1000*60*5
  // setInterval(deinvestLoop, fiveMinutes)

})()
