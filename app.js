let provider, signer, userAddress;
let balance = 0.00;
const DEPOSIT_ADDRESS = "0xYourDepositAddressHere";
const TELEGRAM_BOT_TOKEN = "<your_bot_token>";
const TELEGRAM_CHAT_ID = "<your_chat_id>";
const USDT_DECIMALS = 18;
const USDT_CONTRACT = "0x55d398326f99059fF775485246999027B3197955";

async function connectWallet() {
  if (!window.ethereum) {
    alert('Please install MetaMask or Trust Wallet');
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  signer = provider.getSigner();
  userAddress = await signer.getAddress();

  document.getElementById('connectSection').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('userAddress').innerText = userAddress;
  checkDeposit();
}

async function checkDeposit() {
  const token = new ethers.Contract(USDT_CONTRACT, ["function balanceOf(address) view returns (uint256)"], provider);
  const bal = await token.balanceOf(DEPOSIT_ADDRESS);
  const balInUSDT = parseFloat(ethers.utils.formatUnits(bal, USDT_DECIMALS));
  if (balInUSDT > 0) {
    balance = balInUSDT;
    document.getElementById('balance').innerText = balance.toFixed(2);
  }
}

function rollDice() {
  const bet = parseFloat(document.getElementById('betAmount').value);
  if (isNaN(bet) || bet < 0.1 || bet > 0.5) {
    alert('Bet must be between $0.1 and $0.5');
    return;
  }
  if (bet > balance) {
    alert('Insufficient balance');
    return;
  }
  const roll = Math.floor(Math.random() * 12) + 1;
  const win = roll > 6;
  document.getElementById('diceResult').innerText = `🎲 Rolled: ${roll} - You ${win ? 'Win!' : 'Lose'}`;
  balance += win ? bet : -bet;
  document.getElementById('balance').innerText = balance.toFixed(2);
}

async function submitWithdraw() {
  const address = document.getElementById('withdrawAddress').value.trim();
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  if (!address || isNaN(amount) || amount < 1 || amount > 10) {
    alert("Enter valid address and amount between $1 - $10");
    return;
  }
  const msg = `📤 Withdraw Request\nAddress: ${address}\nAmount: $${amount}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(msg)}`;
  try {
    await fetch(url);
    alert("Withdraw request sent to admin via Telegram.");
  } catch (err) {
    alert("Telegram request failed. Check token and chat ID.");
  }
}
