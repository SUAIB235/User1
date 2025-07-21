let provider;
let signer;
let selectedChoice = null;
const DEPOSIT_ADDRESS = "0xYourDepositAddressHere"; // <- Replace this
const TELEGRAM_BOT_TOKEN = "<your_bot_token>";       // <- Replace this
const TELEGRAM_CHAT_ID = "<your_chat_id>";           // <- Replace this

window.onload = async () => {
  const stored = localStorage.getItem("walletConnected");
  if (stored === "true") {
    await connectWallet();
  }
};

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask or Trust Wallet to continue.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  const address = await signer.getAddress();

  document.getElementById("walletAddress").textContent = address;
  document.getElementById("connectSection").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  localStorage.setItem("walletConnected", "true");

  updateBalance(address);
}

async function updateBalance(address) {
  // Mocked until you implement on-chain balance scan
  document.getElementById("balance").textContent = "0.00";
  // Replace with real USDT balance fetch later if needed
}

function selectChoice(choice) {
  selectedChoice = choice;
  alert(`You selected ${choice.toUpperCase()}`);
}

function rollDice() {
  const bet = parseFloat(document.getElementById("betAmount").value);
  if (!selectedChoice) return alert("Select Even or Odd before rolling.");
  if (!bet || bet < 0.1 || bet > 0.5) return alert("Enter a valid bet between $0.1 and $0.5");

  const result = Math.floor(Math.random() * 6) + 1;
  const isEven = result % 2 === 0;
  const win = (selectedChoice === "even" && isEven) || (selectedChoice === "odd" && !isEven);

  document.getElementById("diceResult").textContent = `Dice: ${result} → You ${win ? "Win 🎉" : "Lose ❌"}`;
}

async function submitWithdraw() {
  const address = document.getElementById("withdrawAddress").value.trim();
  const amount = parseFloat(document.getElementById("withdrawAmount").value);

  if (!ethers.utils.isAddress(address)) return alert("Invalid wallet address.");
  if (isNaN(amount) || amount < 1 || amount > 10) return alert("Withdraw must be between $1 and $10.");

  const message = `🧾 Withdraw Request:\nAddress: ${address}\nAmount: $${amount}`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
  });

  alert("Withdraw request sent!");
}
