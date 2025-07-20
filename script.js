// main.js
const connectBtn = document.getElementById('connectBtn');
const walletAddress = document.getElementById('walletAddress');
const balanceSection = document.getElementById('balanceSection');
const usdtBalance = document.getElementById('usdtBalance');

let web3;
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"; // BSC Mainnet
const USDT_ABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"}];

connectBtn.onclick = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    walletAddress.innerText = accounts[0];
    balanceSection.style.display = 'block';
    getUSDTBalance(accounts[0]);
  } else {
    alert("Install MetaMask or Trust Wallet browser extension.");
  }
};

async function getUSDTBalance(address) {
  const contract = new web3.eth.Contract(USDT_ABI, USDT_ADDRESS);
  const balance = await contract.methods.balanceOf(address).call();
  usdtBalance.innerText = (balance / 1e18).toFixed(2);
}
