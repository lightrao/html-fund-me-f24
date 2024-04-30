import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");

connectButton.onclick = connect;
withdrawButton.onclick = withdraw;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected";
      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log(accounts);
    } catch (error) {
      console.error("Connection error:", error);
      connectButton.innerHTML = "Connection Failed";
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }

  ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length === 0) {
      connectButton.innerHTML = "Connect";
    } else {
      connectButton.innerHTML = "Connected";
      console.log("Connected account:", accounts[0]);
    }
  });
}

async function withdraw() {
  withdrawButton.disabled = true;
  withdrawButton.innerText = "Withdrawing...";
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const transactionResponse = await contract.withdraw();
      const receipt = await listenForTransactionMine(
        transactionResponse,
        provider
      );
      withdrawButton.innerText = "Withdrawn Successfully";

      // Logging key information from the transaction receipt
      console.log("Transaction Receipt:");
      console.log(` - Block Hash: ${receipt.blockHash}`);
      console.log(` - Transaction Index: ${receipt.transactionIndex}`);
      console.log(` - From: ${receipt.from}`);
      console.log(` - To: ${receipt.to}`);
      console.log(` - Gas Used: ${receipt.gasUsed.toString()}`);
      console.log(
        ` - Cumulative Gas Used: ${receipt.cumulativeGasUsed.toString()}`
      );
      console.log(` - Contract Address: ${receipt.contractAddress}`);
      console.log(` - Status: ${receipt.status === 1 ? "Success" : "Failed"}`);
      console.log(` - Confirmations: ${receipt.confirmations}`);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      withdrawButton.innerText = "Withdraw Failed";
    } finally {
      withdrawButton.disabled = false;
    }
  } else {
    withdrawButton.innerText = "Please install MetaMask";
    withdrawButton.disabled = false;
  }
}

async function fund() {
  fundButton.disabled = true;
  fundButton.innerText = "Funding...";
  const ethAmount = document.getElementById("ethAmount").value;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      const receipt = await listenForTransactionMine(
        transactionResponse,
        provider
      );
      fundButton.innerText = "Funded Successfully";
    } catch (error) {
      console.error("Funding failed:", error);
      fundButton.innerText = "Fund Failed";
    } finally {
      fundButton.disabled = false;
    }
  } else {
    fundButton.innerText = "Please install MetaMask";
    fundButton.disabled = false;
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      if (transactionReceipt.status === 0) {
        reject(new Error("Transaction failed"));
      } else {
        console.log(
          `Transaction confirmed in block ${transactionReceipt.blockNumber}`
        );
        resolve(transactionReceipt);
      }
    });
  });
}
