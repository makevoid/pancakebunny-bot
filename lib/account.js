const loadAccount = (eth, pvtKey) => {
  const account = eth.accounts.privateKeyToAccount(pvtKey)
  const { address } = account
  return address
}

module.exports = {
  loadAccount,
}
