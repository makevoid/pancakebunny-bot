// BNB bunny proxy address
const contractAddress = "0x52cfa188a1468a521a98eaa798e715fbb9eb38a3"

const BNBContract = ({ eth }) => {
  const pool = "bnb"
  const abiPath = `./abi/${pool}`
  const ABI = require(abiPath)
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return contract
}

// example of BNB deposit
const depositBNB = async ({ eth }) => {
  const methodName = "depositBNB"
  const depositAmountBNB = "0.001" // NOTE: pass this as a parameter
  const depositAmount = toWei(depositAmountBNB, "ether")

  const contract = BNBContract({ eth })
  const method = contract[methodName]()
  const data = method.encodeABI()

  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    value:    depositAmount,
    data:     data,
    from:     address,
  }
  const gas = await estimateGas({ method, txAttrs })
  txAttrs.gas = gas

  const depositAmount = toWei(depositAmountBNB, "ether")

  // TODO: estimategas
  const txAttrs = {
    gasPrice: "5000000000", // 5 gwei - min gasPrice in BSC
    to:       contractAddress,
    value:    depositAmount,
    data:     data,
    from:     address,
  }

  let gas = await contract.depositBNB().estimateGas(txAttrs)
  gas = gas + 100 // bump max gas a bit
  txAttrs.gas = gas

  const rawTx = await signTransaction(txAttrs, pvtKey)
  // console.log("signedTx:", signedTx)

  const txHashPromise = eth.sendSignedTransaction(rawTx)
  const txHash = resolveTxHash(txHashPromise)
  console.log("txHash:", txHash)
}

module.exports = {
  depositBNB,
}
