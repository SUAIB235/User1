function login() {
  const wallet = document.getElementById('wallet').value.trim();
  if (!wallet.startsWith("T") || wallet.length < 25) {
    alert("Enter a valid TRX address");
    return;
  }

  localStorage.setItem("wallet", wallet);
  localStorage.setItem("balance", localStorage.getItem("balance") || "10");
  document.getElementById("walletDisplay").innerText = wallet;
  document.getElementById("balance").innerText = localStorage.getItem("balance");
  document.getElementById("login").style.display = "none";
  document.getElementById("game").style.display = "block";
}

function play(choice) {
  const bet = parseFloat(document.getElementById("bet").value);
  let balance = parseFloat(localStorage.getItem("balance"));

  if (isNaN(bet) || bet < 1) {
    alert("Enter valid bet");
    return;
  }
  if (bet > balance) {
    alert("Insufficient balance");
    return;
  }

  const random = Math.floor(Math.random() * 10) + 1;
  const result = random % 2 === 0 ? "even" : "odd";

  if (result === choice) {
    balance += bet; // Win 1x
    document.getElementById("result").innerHTML = `✅ You Win! Number: ${random}`;
  } else {
    balance -= bet;
    document.getElementById("result").innerHTML = `❌ You Lose! Number: ${random}`;
  }

  localStorage.setItem("balance", balance.toFixed(2));
  document.getElementById("balance").innerText = balance.toFixed(2);
}

function copyAddress() {
  navigator.clipboard.writeText("TT9cYfA9Dxv...your-wallet");
  alert("Address copied!");
}

// Auto login if wallet exists
window.onload = () => {
  const wallet = localStorage.getItem("wallet");
  if (wallet) {
    document.getElementById("walletDisplay").innerText = wallet;
    document.getElementById("balance").innerText = localStorage.getItem("balance");
    document.getElementById("login").style.display = "none";
    document.getElementById("game").style.display = "block";
  }
};
