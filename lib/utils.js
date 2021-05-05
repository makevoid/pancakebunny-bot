const { fromWei } = require("web3-utils")

const fmt = (amount, precision) => {
  if (!precision) precision = 7
  amount = fromWei(amount, "ether")
  amount = new Number(amount).toFixed(7)
  return amount
}

const fmtFiat = (value) => {
  return new Number(value).toFixed(2)
}

module.exports = {
  fmt,
  fmtFiat,
}
