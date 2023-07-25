// hacky dig built so others could see my results
// fill in process.env.name and process.env.pass

const chalk = require('chalk');
const axios = require('axios');
const express = require('express');
const sio = require('socket.io');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

console.log(chalk.hex('#c0d471')('> Tropical Triumph Script has started.'));

axios.post('https://event.blacket.org/api/login', {
  username: process.env.name,
  password: process.env.pass
}).then((res) => {
  let Cookie = res.headers['set-cookie'][0].split(';')[0];

  setInterval(() => {
    axios.post('https://event.blacket.org/api/dig', {}, {
      headers: {
        Cookie
      }
    }).then(async (res) => {
      if (res.data.error) {
        let time = parseInt(res.data.reason.match(/\d+\s*seconds/)?.[0]) || 0;
        await sleep(time * 500);
        return;
      }

      if (res.data.rewards.items.length > 0) {
        res.data.rewards.items.forEach(item => {
          console.log(chalk.blue(`+${item.quantity}x ${item.item}`));
          io.emit('result', `+${item.quantity}x ${item.item}`);
        });
      };
    
      if (res.data.rewards.shells > 0) {
        console.log(chalk.green(`+${res.data.rewards.shells} shells`));
        io.emit('result', `+${res.data.rewards.shells} shells`);
      };
    }).catch(err => {})
  }, 50);
});

let app = express().get('/', (req, res) => {
  res.send(`
    <head>
      <title>digger</title>
      <script src="https://cdn.socket.io/4.6.0/socket.io.min.js" integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+" crossorigin="anonymous"></script>
    </head>

    <body>
      <div id="results" style="text-align: center;">
      </div>

      <script>
        let socket = io();
        socket.on('result', (r) => document.querySelector('#results').innerHTML += '<div class="result">' + r + '</div>')
      </script>
    </body>
  `)
});

global.io = new sio.Server(app.listen(8080, () => console.log(chalk.yellow(`> Site started.`))));
io.on('connection', (socket) => console.log(chalk.yellow('> User connected to site.')));
