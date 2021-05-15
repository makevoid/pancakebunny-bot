const signTransaction = (eth, txAttrs, privateKey) => {
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
      return resolve(txHash)
    }
    txHashPromise.on('transactionHash', txHashCallback)
  })
)

const estimateGasBump = (gasValue) => {
  gasValue + 100 // bump max gasValue a bit
  // bump gas temporarily - bsc seems to have gas estimation issues - todo implement transaction resubmission in case it fails for out of gas error
  gasValue = gasValue * 1.9
  gasValue = gasValue.toFixed()
  return gasValue
}

const estimateGas = async ({ method, txAttrs }) => {
  let gas
  try {
    gas = await method.estimateGas(txAttrs)
    gas = estimateGasBumpGas(gas)
  } catch (err) {
    console.log("submitting with fixed gas :/")
    gas = 500000
  }
  return gas
}

module.exports = {
  signTransaction,
  resolveTxHash,
  estimateGas,
}
