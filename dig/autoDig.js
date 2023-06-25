(() => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  console.log(`Digging! (most credit to zastix for skript)`);
  
  setInterval(() => {
    fetch('/api/dig', {
      method: 'POST'
    }).then(res => res.json()).then(async res => {
      if (res.error) {
        let time = parseInt(res.reason.match(/\d+\s*seconds/)?.[0]) || 0;
        console.log(`Rate limited! Waiting ${time} second(s)...`);
        await sleep(time * 1000);
        return;
      }

      if (res.rewards.items.length > 0) res.rewards.items.forEach(item => console.log(`Found ${item.quantity}x ${item.item}`));
      if (res.rewards.shells > 0) console.log(`Found ${res.rewards.shells} shells!`);
    });
  }, 500);
})();
