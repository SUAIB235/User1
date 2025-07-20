let tronWeb;
let userAddr;

async function connectWallet() {
  if (!window.tronWeb || !window.tronWeb.ready) return alert('Install TronLink');
  tronWeb = window.tronWeb; userAddr = tronWeb.defaultAddress.base58;
  document.getElementById('addr').innerText = userAddr;
  document.getElementById('connectBtn').style.display = 'none';
  document.getElementById('main').style.display = 'block';
  await updateBalance();
}

async function updateBalance() {
  const bal = await tronWeb.trx.getBalance(userAddr);
  document.getElementById('bal').innerText = (bal/1e6).toFixed(6);
}

async function roll() {
  const bet = parseFloat(document.getElementById('betAmount').value);
  const target = parseInt(document.getElementById('target').value);
  if (!bet || bet<1 || !target || target<1||target>99) return alert('Enter valid bet & target');
  const tx = await tronWeb.transactionBuilder.sendTrx('YOUR_HOUSE_WALLET', bet * 1e6, userAddr);
  const signed = await tronWeb.trx.sign(tx);
  const res = await tronWeb.trx.sendRawTransaction(signed);
  if (!res.result) return alert('TX failed');
  const roll = Math.floor(Math.random()*100)+1;
  let win = (target>50 && roll>=(target+1)) || (target<50 && roll<target);
  const payout = win ? bet * (98/target) : 0;
  document.getElementById('res').innerText = `Rolled ${roll}! ${ win ? 'You win ' + payout.toFixed(6) + ' TRX' : 'You lose'}.`;
  await updateBalance();
}

async function withdraw() {
  const tx = await fetch('https://your-backend.vercel.app/api/withdraw', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ addr: userAddr })
  });
  const json = await tx.json();
  alert(json.msg);
}
