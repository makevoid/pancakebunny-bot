const { toWei, toBN } = require("web3-utils")
const {
  POOL_CONTRACT_ADDRESSES,
  TOKEN_CONTRACT_ADDRESSES,
  BUNNY_DASHBOARD_CONTRACT_ADDRESS
} = require("./constants")
const {
  signTransaction,
  resolveTxHash,
  estimateGas
} = require("./tx")
const { fmt, fmtFiat } = require("./utils")

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

const DashboardContract = ({ eth }) => {
  const abiPath = `../abi_dashboard/dashboard`
  const ABI = require(abiPath)
  const contractAddress = BUNNY_DASHBOARD_CONTRACT_ADDRESS
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return { contract, contractAddress }
}

const profitsOfPool = async ({ eth, pool, address }) => {
  const { contract, _ } = DashboardContract({ eth })
  // const profits = await contract.profitsOfPool(address).call()
  const contractAddress = POOL_CONTRACT_ADDRESSES[pool]
  const profits = await contract.profitOfPool_v2(contractAddress, address).call()
  return profits
}

const profitsOfPoolBunny = async ({ eth, pool, address }) => {
  let profits = await profitsOfPool({ eth, pool, address })
  profits = profits.bunny
  return profits
}

const infoOfPool = async ({ eth, pool, address }) => {
  const { contract, _ } = DashboardContract({ eth })
  // const info = await contract.infoOfPool(address).call()
  const contractAddress = POOL_CONTRACT_ADDRESSES[pool]
  const info = await contract.infoOfPool_v2(contractAddress, address).call()
  return info
}

const walletBalance = async ({ eth, pool, address }) => {
  const { contract, _ } = TokenContract({ eth, pool })
  const balance = await contract.balanceOf(address).call()
  return balance
}

const priceOfBunny = async ({ eth, pool }) => {
  const { contract, _ } = DashboardContract({ eth })
  const price = await contract.priceOfBunny().call()
  return price
}

const tokenBalance = async ({ eth, pool, address }) => {
  const { contract, _ } = PoolContract({ eth, pool })
  const balance = await contract.balanceOf(address).call()
  return balance
}

const withdrawableBalance =  async ({ eth, pool, address }) => {
  const { contract, _ } = PoolContract({ eth, pool })
  const balance = await contract.withdrawableBalanceOf(address).call()
  // console.log(contract)
  return balance
}

const earned = async ({ eth, pool, address }) => {
  const { contract, _ } = PoolContract({ eth, pool })
  const balance = await contract.earned(address).call()
  return balance
}

const principal = async ({ eth, pool, address }) => {
  const { contract, _ } = PoolContract({ eth, pool })
  const balance = await contract.principalOf(address).call()
  return balance
}

const depositedAt = async ({ eth, pool, address }) => {
  const { contract, _ } = PoolContract({ eth, pool })
  const date = await contract.depositedAt(address).call()
  return new Date(date*1000)
}

const sharesOf = async ({ eth, pool, address }) => {
  const { contract, _ } = PoolContract({ eth, pool })
  const balance = await contract.sharesOf(address).call()
  return balance
}


const printStatus = async ({ eth, pool, address }) => {
  let principalAmount = await principal({ eth, pool, address })
  let walletBal = await walletBalance({ eth, pool, address })
  principalAmount = fmt(principalAmount)
  walletBal = fmt(walletBal)
  console.log(`principal      - ${pool}    `, principalAmount)
  console.log(`wallet balance - ${pool}    `, walletBal)
}

const profitBunnyUSD = async ({ eth, pool, address, debug }) => {
  let bunnyPrice  = await priceOfBunny({ eth, pool })
  let profitBunny = await profitsOfPoolBunny({ eth, pool, address })
  bunnyPrice  = fmt(bunnyPrice)
  profitBunny = fmt(profitBunny)
  bunnyPrice  = fmtFiat(bunnyPrice)
  const profitBunnyFiat = fmtFiat(profitBunny * bunnyPrice)
  if (debug) {
    console.log(`bunny price    - USD     `, bunnyPrice)
    console.log("profit         - bunny   ", profitBunny)
    console.log(`profit         - USD (b) `, profitBunnyFiat)
  }
  return profitBunnyFiat
}

const claimTokens = async ({ eth, pool, address, pvtKey, claimThreshold }) => {
  const profitBunny = await profitBunnyUSD({ eth, pool, address, debug: true })

  console.log("\nclaim tokens:")
  if (profitBunny < claimThreshold) {
    console.error(`will not claim under ${claimThreshold} USD of profit`)
    return { status: "stopped", error: "claimTooLowError" , operation: "claim" }
  }

  const methodName = "getReward"
  const { contract, contractAddress } = PoolContract({ eth, pool })
  const method = contract[methodName]()
  const data = method.encodeABI()

  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    data:     data,
    from:     address,
  }
  let gas = await estimateGas({ method, txAttrs })
  txAttrs.gas = gas
  console.log("GAS", gas)

  const rawTx = await signTransaction(eth, txAttrs, pvtKey)
  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = await resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

// deposit tokens
//
// depositTokens({ eth, pool: "POOL_NAME", depositAmount: "0.01", address: address, pvtKey: pvtKey })
//
// e.g. depositTokens({ eth, pool: "CAKE", depositAmount: "0.01", address: "0x12345...0", pvtKey: "..." })
//
const depositTokens = async ({ eth, pool, depositThreshold, address, pvtKey }) => {
  let walletBalWei = await walletBalance({ eth, pool, address })
  walletBal = fmt(walletBalWei)
  walletBal = new Number(walletBal)
  console.log("\ndeposit tokens:")
  if (walletBal < depositThreshold) {
    console.error(`low wallet balance ${walletBal}, will not deposit`)
    return { status: "stopped", error: "depositTooLowError" , operation: "deposit" }
  }
  const depositAmount = walletBalWei - 10000 // save some :D

  const methodName = "deposit"

  const depositAmountTokens = toBN(depositAmount)
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
  let gas = await estimateGas({ method, txAttrs })
  txAttrs.gas = gas
  console.log("GAS", gas)

  const rawTx = await signTransaction(eth, txAttrs, pvtKey)
  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = await resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

const withdrawTokens = async ({ eth, pool, withdrawThreshold, address, pvtKey }) => {
  console.log("not implemented")
  process.exit()

  const poolPrincipal = await tokenBalance({ eth, pool, address })
  // TODO: conversion
  const poolPrincipalUSD = poolPrincipal
  if (poolPrincipalUSD < withdrawThreshold) {
    console.error(`low wallet balance ${walletBal}, will not withdraw`)
    return { status: "stopped", error: "poolPrincipalTooLowError" , operation: "withdraw"}
  }

  const methodName = "withdrawUnderlying"

  let contract = new Contract(ABI, contractAddress)
  contract = contract.methods

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
  const txHash = await resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

module.exports = {
  printStatus,
  depositTokens,
  claimTokens,
  withdrawTokens,
  priceOfBunny,
  walletBalance,
}
