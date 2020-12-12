/* eslint-disable no-console */
/* eslint-disable import/order */
const database = require('./database.json');
const knex = require('knex')({
  client: 'mysql',
  connection: database.mysql,
});
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
const port = 3000;

app.get('/lkapi/', async (req, res) => {
  let timestamp = 0;
  let format = 'AdvancedMatch';
  let card;
  if (req.query) {
    const queryTime = req.query.t;
    const queryFormat = req.query.f;
    const queryCard = req.query.c;
    if (queryTime) {
      timestamp = queryTime;
    }
    if (queryFormat) {
      format = queryFormat;
    }
    if (queryCard) {
      card = queryCard;
    }
  }
  const query = knex('duel').select().where('Time', timestamp).orderBy('CombinedRating', 'desc');
  if (format) {
    query.andWhere('Format', format);
  }
  if (card) {
    // This is deliberately not an arrow function so we have access to "this"
    // eslint-disable-next-line func-names
    query.andWhere(function () {
      this.where('Player1Visible', 'like', `%${card}%`).orWhere('Player2Visible', 'like', `%${card}%`);
    });
  }
  let duels = [];
  const tempUsageCards = {};
  const usage = {
    total: 0,
    cards: [],
  };
  try {
    duels = await query;
  } catch (err) {
    console.log('== Error in /lkapi/', err);
    return res.json({
      duels,
      usage,
    });
  }

  // The following loop will a. Convert visible to JSON && sort b. Calculate the usage
  for (let ii = 0; ii < duels.length; ii += 1) {
    let visibleToSearch = [];
    const currentDuel = duels[ii];
    currentDuel.Player1Visible = (JSON.parse(currentDuel.Player1Visible)).sort();
    currentDuel.Player2Visible = (JSON.parse(currentDuel.Player2Visible)).sort();
    // Case A. No card search was specified - calculate as normal
    if (!card) {
      usage.total += 2;
      visibleToSearch = currentDuel.Player1Visible.concat(currentDuel.Player2Visible);
    } else {
      // Case B. Card was specified - this means the user only cares about Decks including that card
      // So - we will only acknowledge .PlayerXVisible which actually contains this card
      const cardLowerCased = card.toLowerCase();
      const Player1VisibleLIKE = (currentDuel.Player1Visible.join('","')).toLowerCase();
      const Player2VisibleLIKE = (currentDuel.Player2Visible.join('","')).toLowerCase();
      if (Player1VisibleLIKE.includes(cardLowerCased)) {
        usage.total += 1;
        visibleToSearch = visibleToSearch.concat(currentDuel.Player1Visible);
      }
      if (Player2VisibleLIKE.includes(cardLowerCased)) {
        usage.total += 1;
        visibleToSearch = visibleToSearch.concat(currentDuel.Player2Visible);
      }
    }
    for (let jj = 0; jj < visibleToSearch.length; jj += 1) {
      const currentCard = visibleToSearch[jj];
      if (!tempUsageCards[currentCard]) {
        tempUsageCards[currentCard] = 0;
      }
      tempUsageCards[currentCard] += 1;
    }
  }
  // Convert tempUsageCards to an array - so we can order by count
  const tempCardKeys = Object.keys(tempUsageCards);
  for (let index = 0; index < tempCardKeys.length; index += 1) {
    const currentKey = tempCardKeys[index];
    const currentValue = tempUsageCards[currentKey];
    usage.cards.push({
      name: currentKey,
      count: currentValue,
    });
  }
  usage.cards.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

  res.json({
    duels,
    usage,
  });
});
app.listen(port, () => console.log(`Listening on ${port}`));
