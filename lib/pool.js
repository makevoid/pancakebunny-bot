const { toWei, toBN } = require("web3-utils")
const { POOL_CONTRACT_ADDRESSES, TOKEN_CONTRACT_ADDRESSES } = require("./constants")
const {
  signTransaction,
  resolveTxHash,
  estimateGas
} = require("./tx")

const PoolContract = ({ eth, pool }) => {
  const abiPath = `../abi/${pool}`
  const ABI = require(abiPath)
  const contractAddress = POOL_CONTRACT_ADDRESSES[pool]
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return { contract, contractAddress }
}

const TokenContract = ({ eth, pool }) => {
  const abiPath = `../abi_tokens/${pool}`
  const ABI = require(abiPath)
  const contractAddress = TOKEN_CONTRACT_ADDRESSES[pool]
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return { contract, contractAddress }
}

const walletBalance = async ({ eth, pool, address }) => {
  const { contract, contractAddress } = TokenContract({ eth, pool })
  const balance = await contract.balanceOf(address).call()
  return balance
}

const tokenBalance = async ({ eth, pool, address }) => {
  const { contract, contractAddress } = PoolContract({ eth, pool })
  const balance = await contract.balanceOf(address).call()
  return balance
}

const withdrawableBalance =  async ({ eth, pool, address }) => {
  const { contract, contractAddress } = PoolContract({ eth, pool })
  const balance = await contract.withdrawableBalanceOf(address).call()
  // console.log(contract)
  return balance
}

const earned = async ({ eth, pool, address }) => {
  const { contract, contractAddress } = PoolContract({ eth, pool })
  const balance = await contract.earned(address).call()
  return balance
}




// depositTokens({ eth, pool: "POOL_NAME", depositAmount: "0.01", address: address, pvtKey: pvtKey })
//
// e.g. depositTokens({ eth, pool: "CAKE", depositAmount: "0.01", address: "0x12345...0", pvtKey: "..." })
//
const depositTokens = async ({ eth, pool, depositAmount, address, pvtKey }) => {
  const methodName = "deposit"
  let depositAmountTokens = toWei(depositAmount, "ether")
  // console.log(depositAmountTokens)
  // console.log(154805843115958900)

  console.log("walletBalance", await walletBalance({ eth, pool, address }))
  console.log("earned", await earned({ eth, pool, address }))
  console.log("tokenBalance", await tokenBalance({ eth, pool, address }))
  console.log("withdrawableBalance", await withdrawableBalance({ eth, pool, address }))
  process.exit()
  depositAmountTokens = toBN(depositAmountTokens)
  const { contract, contractAddress } = PoolContract({ eth, pool })
  const method = contract[methodName](depositAmountTokens)
  const data = method.encodeABI()
  //
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    data:     data,
    from:     address,
  }
  console.log("txAttrs", txAttrs)
  let gas
  try {
    gas = await estimateGas({ method, txAttrs })
  } catch (err) {
    console.error("gas estimation error")
    console.error(err)
    gas = 540000
  }
  txAttrs.gas = gas
  // console.log("contractAddress", contractAddress)
  console.log("GAS", gas)

  const rawTx = await signTransaction(eth, txAttrs, pvtKey)
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

  const rawTx = await signTransaction(eth, txAttrs, pvtKey)
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

  const rawTx = await signTransaction(eth, txAttrs, pvtKey)
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
