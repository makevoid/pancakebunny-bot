const { readFileSync } = require('fs')

const loadPrivateKey = (privateKeyPath) => {
  const pvtKey = readFileSync(privateKeyPath).toString().trim()
  if (!pvtKey) {
    console.error("private key is empty - generate, backup and load a private key first")
    process.exit(1)
  }
  return pvtKey
}

module.exports = {
  loadPrivateKey,
}
