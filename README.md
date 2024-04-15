# html-fund-me-f24

This is a minimalistic example to illustrate how you can interactive with smart contract by browser.

# Requirements

- git
- MetaMask
- Vscode
- LiveServer

# Quickstart

1. Clone the repo

```
git clone https://github.com/lightrao/html-fund-me-f24
cd html-fund-me-f24
code .
```

2. Run the file.

You can usually just double click the file to "run it in the browser". Or you can right click the file in your VSCode and run "open with live server".

And you should see a small button that says "connect".

![Connect](connect.png)

Hit it, and you should see metamask pop up.

# Execute a transaction

I have deployed FundMe contract on sepolia for testing.

# Introduction to function selectors

```bash
cast sig "fund()"
# 0xb60d4288
cast sig "withdraw()"
# 0x3ccfd60b
```

When you click respective button, then view MetaMask HEX DATA: 4 BYTES, you get same number:

```
0xb60d4288
0x3ccfd60b
```

# cast calldata-decode

https://book.getfoundry.sh/reference/cast/cast-calldata-decode#cast-calldata-decode
