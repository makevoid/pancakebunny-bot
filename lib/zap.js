const { toWei, toBN } = require("web3-utils")
const { ZAP_CONTRACT_ADDRESSES } = require("./constants")
const {
  signTransaction,
  resolveTxHash,
  estimateGas
} = require("./tx")
const {
  priceOfBunny,
  walletBalance,
} = require("./pool")
const { fmt } = require("./utils")

const ZapContract = ({ eth }) => {
  const abiPath = "../abi_zap/zap"
  const ABI = require(abiPath)
  const contractAddress = ZAP_CONTRACT_ADDRESSES
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return { contract, contractAddress }
}

// token swap (or Zap), convert one token to the other using liquidity pools
//
const swapBunnyToToken = async ({ eth, token, address, pvtKey, swapThreshold }) => {
  const pool = token
  const bunnyBalance = await walletBalance({ eth, pool, address })

  // TODO: fixme
  let amount = 10000000000000
  amount = toBN(amount)

  let bunnyPriceUSD = await priceOfBunny({ eth, pool })
  bunnyPriceUSD  = fmt(bunnyPriceUSD)
  const bunnyBalanceUSD = bunnyBalance * bunnyPriceUSD

  console.log("SWAP:", bunnyBalanceUSD, swapThreshold)

  console.log(`\nconvert BUNNY to ${token}:`)
  if (bunnyBalanceUSD > swapThreshold) {
    console.error(`will not convert under ${swapThreshold} USD of profit`)
    // return { status: "stopped", error: "swapTooLowError" , operation: "swap" }
  }

  console.log("ADDRESS:", address)

  const methodName = "zapInToken"
  const { contract, contractAddress } = ZapContract({ eth, pool })
  // const method = contract[methodName](address, amount ,address)

  const addressTokenZapFrom = TOKEN_CONTRACT_ADDRESSES[token]
  const addressTokenZapTo   = TOKEN_CONTRACT_ADDRESSES["BUNNY"]
  const method = contract[methodName](addressTokenZapFrom, amount, addressTokenZapTo)

  const data = method.encodeABI()

  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    data:     data,
    from:     address,
    gas:      600000,
  }
  let gas = await estimateGas({ method, txAttrs })
  txAttrs.gas = gas
  console.log("GAS", gas)



  const rawTx = await signTransaction(eth, txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)

  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

module.exports = {
  swapBunnyToToken,
}
