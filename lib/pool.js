const PoolContract = ({ eth, pool }) => {
  const abiPath = `./abi/${pool}`
  const ABI = require(abiPath)
  let contract = new eth.Contract(ABI, contractAddress)
  contract = contract.methods
  return contract
}
