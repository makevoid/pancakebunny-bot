const { toWei, toBN } = require("web3-utils")
const { POOL_CONTRACT_ADDRESSES } = require("./constants")

const PoolContract = ({ eth, pool }) => {
  const abiPath = `../abi/${pool}`
  const ABI = require(abiPath)
  const contractAddress = POOL_CONTRACT_ADDRESSES[pool]
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return contract
}

// depositTokens({ eth, pool: "POOL_NAME", depositAmount: "0.01" })
//
// e.g. depositTokens({ eth, pool: "CAKE", depositAmount: "0.01" })
//
const depositTokens = async ({ eth, pool, depositAmount }) => {
  const methodName = "deposit"
  let depositAmountTokens = toWei(depositAmount, "ether")
  depositAmountTokens = toBN(depositAmountTokens)

  const contract = PoolContract({ eth, pool })
  const method = contract[methodName](depositAmount)
  const data = method.encodeABI()

  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    value:    0,
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

module.exports = {
  depositTokens,
  claimTokens,
  withdrawTokens,
}
