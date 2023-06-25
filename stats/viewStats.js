let user = prompt('Enter a username to view.');
fetch('/api/user/' + user).then((res) => res.json()).then((res) => {
  let n = res.user;

  let treasuresFound = [];
  Object.values(Object.values(n.treasures)).forEach(a => {
    Object.entries(a).forEach(a => (a[1] > 0) ? treasuresFound.push(a[0]): '');
  });

  document.querySelector('.shovel-avatar').src = 1 === n.shovel ? "/content/shovels/iron.png" : 2 === n.shovel ? "/content/shovels/ruby.png" : 3 === n.shovel ? "/content/shovels/gold.png" : n.shovel >= 4 ? "/content/shovels/diamond.png" : "/content/shovels/stone.png";
  document.querySelector('.stats > div:nth-of-type(3) > div').innerHTML = `<img draggable="false" class="stats-icon" src="/content/shell-icon.png" alt="Shell Icon" style="user-select: none;">Shells: ` + n.shells.toLocaleString();
  document.querySelector('.stats > div').innerHTML = `<img draggable="false" class="stats-icon" src="/content/user-icon.png" alt="User Icon" style="user-select: none;">` + n.username;
  document.querySelector('.stats > div:nth-of-type(3) > div:nth-of-type(3)').innerHTML = `<img draggable="false" class="stats-icon" src="/content/treasure-icon.png" alt="Treasure Icon" style="user-select: none;">Unique Treasures: ` + treasuresFound.length;
  document.querySelector('.stats > div:nth-of-type(3) > div:nth-of-type(2)').innerHTML = `<img draggable="false" class="stats-icon" src="/content/treasure-icon.png" alt="Treasure Icon" style="user-select: none;"> Treasures Found: ` + n.miscellaneous.treasures.toLocaleString();

  Array.from(document.querySelector('.history-item-container').children).forEach(a => a.remove());
  document.querySelector('.history-item-container').innerHTML += `<div class="no-history-text">Treasure history is not shown when viewing another's stats.</div>`;

  fetch('/api/leaderboard').then((res) => res.json()).then((rel) => {
    if (rel.leaderboard.filter(a => a.username === n.username)[0]) {
      let position = rel.leaderboard.indexOf(rel.leaderboard.filter(a => a.username === n.username)[0]) + 1;
      console.log(position);
      let img = position === 1 ? "/content/trophy-icon-gold.png" : 2 === position ? "/content/trophy-icon-silver.png" : 3 === position ? "/content/trophy-icon-bronze.png" : position >= 4 && position <= 10 ? "/content/trophy-icon-10.png" : position >= 11 && position <= 25 ? "/content/trophy-icon-25.png" : "/content/trophy-icon-other.png";
      document.querySelector('.stats > div:nth-of-type(2)').innerHTML = `<img draggable="false" class="stats-icon" src="${img}" alt="Trophy Icon" style="user-select: none;"> Position #` + position;
    } else document.querySelector('.stats > div:nth-of-type(2)').innerHTML = `<img draggable="false" class="stats-icon" src="${img}" alt="Trophy Icon" style="user-select: none;"> Position # <100`;

    Array.from(document.querySelector('.sandbox-item-container').children).forEach(child => {
      child.parentNode.replaceChild(child.cloneNode(true), child);
    });

    let treCounts = [];
    let ind = 0;
    Object.values(Object.values(n.treasures)).forEach(a => {
      Object.values(a).forEach(a => treCounts.push(a));
    });
    treCounts.forEach(a => {
      let element = document.querySelector('.sandbox-item-container').children[ind];
      if (a < 1) {
        element.setAttribute('aria-disabled', 'true');
        if (element.children[1]) element.children[1].remove();
      } else {
        element.setAttribute('aria-disabled', 'false');
        if (element.children[1]) element.children[1].remove();
        element.innerHTML += `<div class="sandbox-item-quantity">x${a}</div>`;
      };
      ind++;
    });
  });
});
