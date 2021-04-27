const Web3 = require("web3")
const { readFileSync } = require('fs')
const { promisify } = require("util")
const web3 = new Web3("https://bsc-dataseed.binance.org/")
const { eth, utils } = web3
const { Contract } = eth
const { toWei } = utils
// const getTransaction = promisify(eth.getTransaction)

// address: 0x5870a2af7ede1B1995426f640B407F888b34b0A7

// lib

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

;(async () => {

  const pools = ["bnb", "cake"]
  const pool = "bnb"
  const abiPath = `abi/${pool}`
  const ABI = require(abiPath)

  // const block = await eth.getBlockNumber()
  // console.log("block:", block)

  // BNB bunny proxy address
  const contractAddress = "0x52cfa188a1468a521a98eaa798e715fbb9eb38a3"

  // CAKE bunny proxy address
  // const contractAddress = "0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed"

  // const txToCopy = "0xbdd5a03cecf3a85569dd21071024ab161d6f193a225ab9221e050966a47a7390"
  //
  // const tx = await eth.getTransaction(txToCopy)
  // console.log("tx:", tx)

  // const contractAddress = "0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed"
  //
  // const functionName = "getReward()"
  // MethodID: 0x3d18b912

  // ABI BNB
  const ABI = require("./abi/bnb.js")


  // ABI CAKE
  // -----
  // const ABI = require("./abi/cake.js")
  // const code = await eth.getCode(contractAddress)
  // console.log("code:", code)

  let swap = new Contract(ABI, contractAddress)
  swap = swap.methods

  // const toAddress = address   // send to self
  // const value = 1000000000000 // min eth (bnb) transfer amount (in wei)

  const depositBNBData = swap.depositBNB().encodeABI()

  const depositAmountBNB = "0.001"
  const depositAmount = toWei(depositAmountBNB, "ether")


  const data = depositBNBData
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    // gas:      "21000", // normal tx
    gas:      "552000", // normal tx
    to:       contractAddress,
    value:    depositAmount,
    data:     data,
  }

  // dev account: 0x5870a2af7ede1B1995426f640B407F888b34b0A7

  // bunny:
  // deposit BNB call
  // ~0.003 - 0.002856 gas fee in bnb (eth)
  // 551119 gas

  // contract call n1
  // depositBNB()


  const rawTx = await signTransaction(txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)


  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)


  // const res = await swap.getReward().call()
  // console.log("res:", res)
})()
