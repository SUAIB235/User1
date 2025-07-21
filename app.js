let provider;
let signer;
let selectedChoice = null;

const DEPOSIT_ADDRESS = "0xYourDepositAddressHere"; // replace with your deposit address
const TELEGRAM_BOT_TOKEN = "<your_bot_token>";      // replace with your telegram bot token
const TELEGRAM_CHAT_ID = "<your_chat_id>";          // replace with your telegram chat ID

window.onload = async () => {
  const connected = localStorage.getItem("walletConnected");
  if (connected === "true") {
    await connectWallet();
  }
  document.getElementById("depositAddress").textContent = DEPOSIT_ADDRESS;
};

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask or Trust Wallet to continue.");
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();

    // Display address, show dashboard, hide connect section
    document.getElementById("walletAddress").textContent = truncateAddress(address);
    document.getElementById("connectSection").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");

    localStorage.setItem("walletConnected", "true");

    updateBalance(address);
  } catch (err) {
    alert("Connection rejected or failed.");
  }
}

function truncateAddress(address) {
  return address.slice(0, 6) + "..." + address.slice(-4);
}

async function updateBalance(address) {
  // For now, show 0.00
  // Later you can integrate real USDT balance via BscScan or other API
  document.getElementById("balance").textContent = "0.00";
}

// Account menu toggle
function toggleAccountMenu() {
  document.getElementById("accountMenu").classList.toggle("hidden");
  // Also hide deposit and withdraw sections on menu toggle
  hideDeposit();
  hideWithdraw();
}

// Deposit / Withdraw toggles
function showDeposit() {
  document.getElementById("depositSection").classList.remove("hidden");
  document.getElementById("withdrawSection").classList.add("hidden");
  document.getElementById("accountMenu").classList.add("hidden");
}

function showWithdraw() {
  document.getElementById("withdrawSection").classList.remove("hidden");
  document.getElementById("depositSection").classList.add("hidden");
  document.getElementById("accountMenu").classList.add("hidden");
}

function hideDeposit() {
  document.getElementById("depositSection").classList.add("hidden");
}

function hideWithdraw() {
  document.getElementById("withdrawSection").classList.add("hidden");
}

// Logout function
function logout() {
  localStorage.removeItem("walletConnected");
  location.reload();
}

// Game Logic
function selectChoice(choice) {
  selectedChoice = choice;
  alert(`You selected ${choice.toUpperCase()}`);
}

function rollDice() {
  const bet = parseFloat(document.getElementById("betAmount").value);
  if (!selectedChoice) {
    alert("Please select Even or Odd before rolling the dice.");
    return;
  }
  if (isNaN(bet) || bet < 0.1 || bet > 0.5) {
    alert("Please enter a valid bet amount between $0.1 and $0.5.");
    return;
  }

  // Roll dice 1-6
  const diceResult = Math.floor(Math.random() * 6) + 1;
  const isEven = diceResult % 2 === 0;
  const won = (selectedChoice === "even" && isEven) || (selectedChoice === "odd" && !isEven);

  document.getElementById("diceResult").textContent = `🎲 Dice rolled: ${diceResult} — You ${won ? "Win 🎉" : "Lose ❌"}`;
}

// Withdraw request with Telegram notify
async function submitWithdraw() {
  const address = document.getElementById("withdrawAddress").value.trim();
  const amount = parseFloat(document.getElementById("withdrawAmount").value);

  if (!ethers.utils.isAddress(address)) {
    alert("Please enter a valid wallet address.");
    return;
  }
  if (isNaN(amount) || amount < 1 || amount > 10) {
    alert("Withdraw amount must be between $1 and $10.");
    return;
  }

  const message = `🧾 Withdraw Request\nAddress: ${address}\nAmount: $${amount.toFixed(2)}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
    });

    if (!res.ok) throw new Error("Telegram API error");

    alert("Withdraw request sent successfully!");
    // Clear inputs
    document.getElementById("withdrawAddress").value = "";
    document.getElementById("withdrawAmount").value = "";
  } catch (e) {
    alert("Failed to send withdraw request. Please try again later.");
  }
}
