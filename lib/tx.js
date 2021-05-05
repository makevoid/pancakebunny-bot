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

const estimateGas = async ({ method, txAttrs }) => {
  // TODO: check if method exists
  let gas = await method.estimateGas(txAttrs)
  gas = gas + 100 // bump max gas a bit
  // bump gas soo much? why?
  gas = gas * 1.9
  gas = gas.toFixed()
  return gas
}

module.exports = {
  signTransaction,
  resolveTxHash,
  estimateGas,
}
