const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const { user } = await fetch("https://event.blacket.org/api/user").then(x => x.json());
  const items = Object.values(user.treasures).reduce((acc, obj) => ({
    ...acc,
    ...Object.entries(obj).reduce((a, [k, v]) => (v !== 0 ? {
      ...a,
      [k]: v - 1
    } : a), {})
  }), {});

  let hasZeroQuantity = false;

  for (const item of Object.keys(items)) {
    if (items[item] === 0) hasZeroQuantity = true;
    else {
      await wait(500);

      fetch("https://event.blacket.org/api/sell", {
        method: "POST",
        headers: {
          credentials: "include",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          treasure: item,
          quantity: items[item]
        }),
      }).then(r => r.json()).then(data => console.log(`[SellDupes] Sold ${items[item]}x ${item}(s)`));
    }
  }

  if (!hasZeroQuantity) alert(`Sold all dupes! thank zastix for making this :)`)
})();
