# pancakebunny-bot

A bot that has a strategy based on staking on two pools:

Pool A) a high APY crypto pool (e.g. CAKE / BUNNY)
Pool B) a more stable (but lower APY) flip pool (e.g. USDT-BUSD, BTC-BNB, USDT-BNB, BUSD-BNB, etc.)

### Configuration

```yml
:pool_a: "CAKE"
:pool_b: "USDT-BUSD"
:price_swap: "24" # if CAKE is lower than this price, claim CAKEs, zap all and deposit to stable flip (USDT-BUSD), if CAKE is higher than this price, claim USDT-BUSD, zap all and deposit to CAKE
:claim_and_deposit_every: 604800 # 7 days - claim CAKE + Bunny and re-deposit into the current pool
```

### setup

- download the code from github to your local machine
- make sure your local machine is safe (fresh new linux install recommended)
- export your ethereum BSC private key from metamask and save it into a file named "~/pancakebunny-private-key.txt"

LICENSE

GPLv3 - use this code at your own risk
