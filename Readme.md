# pancakebunny-bot

A PancakeBunny bot that does automatic token **claim** every week, it also has a function to **withdraw** if a price is reached with this strategy:

Pool A) a high APY crypto pool (e.g. CAKE / BUNNY)
Pool B) a more stable (but lower APY) flip pool or stablecoin (e.g. USDT-BUSD, BTC-BNB, USDT-BNB, BUSD-BNB, USDT, BUSD etc.)

e.g. Swap price set to 24-30

Assuming the bot starts with 10 CAKE and the price is 35

- The price falls to 30
- The bot withdraws the tokens from the CAKE pool
- Zaps all CAKEs to USDT-BUSD
- Deposits the USDT-BUSD to the USDT-BUSD flip pool
- The price falls to 23 then rises to 25
- The bot withdraws the USDT-BUSDs and zaps them to CAKEs
- then it deposits them to the CAKE pool again

(this feature is in WIP, at the moment the bot can only claim tokens every week)

<!--
### Configuration

```yml
:pool_a: "CAKE"
:pool_b: "USDT-BUSD"
:price_swap: "24" # if CAKE is lower than this price, claim CAKEs, zap all and deposit to stable flip (USDT-BUSD), if CAKE is higher than this price, claim USDT-BUSD, zap all and deposit to CAKE
:claim_and_deposit_every: 604800 # 7 days - claim CAKE + Bunny and re-deposit into the current pool
```
-->

### Setup

- download the code from github to your local machine
- make sure your local machine is safe (fresh new linux install recommended)
- export your ethereum BSC private key from metamask and save it into a file named "~/pancakebunny-private-key.txt"
- make sure you have sufficient BNB balance (10-20$ should be alright)
- make sure you have sufficient Token balance (e.g. CAKE) - (if this is the first time testing the bot, please put a low amount of Tokens (CAKEs), I cannot guarantee that the bot is bug free, always check bscscan and the bot logs, if you see an error stop the bot, use this code at your own risk, end of the disclaimer, you have been warned :])
- run `npm install`

### Run

to run the bot, execute the start command:

```sh
npm start
```

---

LICENSE

GPLv3 - use this code at your own risk

@makevoid
