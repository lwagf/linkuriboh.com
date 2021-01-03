<template>
  <div>
    <div class="lk-spinner fixed-center" v-if="showLoadingClass"></div>
    <div :class="showLoadingClass">
      <div v-if="error" class="alert alert-danger" role="alert">
        {{error.message}}
      </div>
      <div class="row">
        <div class="col-md-8">
          <h3>Showing {{visibleNumDuelsText}}</h3>
          <div id="form__home" class="form-group">
            <label for="inputDate">Date (YYYY-MM-DD, UTC)</label>
            <input v-model.lazy="date" class="form-control" id="inputDate" placeholder="YYYY-MM-DD">
            <label for="selectFormat">Format</label>
            <select v-model.lazy="format" class="form-control" id="selectFormat">
              <option value="AdvancedMatch">Advanced (Match)</option>
              <option value="AdvancedSingle">Advanced (Single)</option>
              <option value="GoatMatch">Goat (Match)</option>
              <option value="SpeedMatch">Speed (Match)</option>
            </select>
            <label for="inputCard">Card</label>
            <input v-model.lazy="card" class="form-control" id="inputCard" placeholder="Filter duels with a card like...">
          </div>
          <div v-if="isArrayNotEmpty(duels)" class="container__cards">
            <div v-for="(item, i) in duels" :key="i" class="card">
              <div class="card-body">
                <h5 class="card-title">#{{i+1}} {{item.Player1}} vs. {{item.Player2}} ({{item.CombinedRating}} total rating)</h5>
                <p class="card-text">{{item.Player1}}</p>
                <div v-if="isArrayNotEmpty(item.Player1Visible)" class="container__deck">
                  <a v-for="(jtem, j) in item.Player1Visible" :key="j" target="_blank" class="visibleCard" :href="getCardURL(jtem)">
                    <img :alt="jtem" :title="jtem" width="45" height="65" :src="getCardImage(jtem)"/>
                  </a>
                </div>
                <div v-else class="container__noDeck text-muted">
                  No cards were played
                </div>
                <p class="card-text">{{item.Player2}}</p>
                <div v-if="isArrayNotEmpty(item.Player2Visible)" class="container__deck">
                  <a v-for="(jtem, j) in item.Player2Visible" :key="j" target="_blank" class="visibleCard" :href="getCardURL(jtem)">
                    <img :alt="jtem" :title="jtem" width="45" height="65" :src="getCardImage(jtem)"/>
                  </a>
                </div>
                <div v-else class="container__noDeck text-muted">
                  No cards were played
                </div>
                <a target="_blank" :href="getReplayURL(item.id)" class="card-link">View replay</a>
              </div>
            </div>
          </div>
          <div v-else class="text-muted">
            No results found.
          </div>
        </div>
        <div class="col-md-4">
          <h3>Card usage</h3>
          <label>How many of the {{visibleUsageText}} were seen playing each card?</label>
          <div class="container__cards">
            <div v-for="(item, i) in visibleUsageCards" :key="i" class="card">
              <div class="card-body">
                <h5 class="card-title">
                  #{{i+1}} {{item.name}}
                  <p class="card-text small">{{item.count}} ({{getCardUsagePercent(item.count)}}%)</p>
                </h5>
                <a target="_blank" class="visibleCard" :href="getCardURL(item.name)">
                  <img :alt="item.name" :title="item.name" width="45" height="65" :src="getCardImage(item.name)"/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-useless-escape */
const Axios = require('axios');
const Moment = require('moment');

const MomentStart = Moment
  .utc()
  .startOf('day')
  .subtract(1, 'd');

export default {
  name: 'Home',
  data: function () {
    return {
      card: null,
      error: null,
      format: 'AdvancedMatch',
      loading: false,
      date: MomentStart.format('YYYY-MM-DD'),
      duels: [],
      usage: {},
    };
  },
  computed: {
    showLoadingClass: function () {
      return this.loading ? 'showLoadingClass' : '';
    },
    visibleUsageCards: function () {
      if (!this.usage.cards) {
        return [];
      }
      // Cap the GUi to only show 100
      const visible = [...this.usage.cards];
      visible.length = Math.min(visible.length, 100);
      return visible;
    },
    visibleNumDuelsText: function () {
      return (this.card) ? `${this.duels.length} duels containing a card like "${this.card}"` : 'the 150 highest rated duels';
    },
    visibleUsageText: function () {
      return (this.card) ? `decks containing a card like "${this.card}"` : 'listed decks';
    },
  },
  methods: {
    // This is a bit weird, but some characters the API expects to be encoded, others it expects to be converted to underscores
    getCardImage: (Name) => `https://static-3.studiobebop.net/ygo_data/card_images/${Name.replace(/([\?\&\,\#])/g, (match, capture) => encodeURIComponent(capture)).replace(/[\s\"\*\!\-\:\/]/g, '_')}.jpg`,
    getCardURL: (Name) => `https://yugiohprices.com/card_price?name=${Name.replace(/([\#\&])/g, (match, capture) => encodeURIComponent(capture))}`,
    getCardUsagePercent: function (Amt) {
      return ((Amt / this.usage.total) * 100).toFixed(2);
    },
    getReplayURL: (ID) => `https://www.duelingbook.com/replay?id=${ID}`,
    makeCall: function () {
      this.loading = true;
      // a. Convert the textual date into integer timestamp
      let timestamp = (Moment.utc(this.date).startOf('day').unix());
      if (Number.isNaN(timestamp)) {
        timestamp = 0;
      }
      // b. Figure out if we need the card QS or not
      const queryCard = this.card ? `&c=${this.card}` : '';

      // c. Hit the api
      Axios({
        method: 'get',
        url: `${process.env.VUE_APP_API}/lkapi/?t=${timestamp}&f=${this.format}${queryCard}`,
      }).then((response) => {
        if (response.data) {
          this.loading = false;
          this.error = null;
          this.duels = response.data.duels;
          this.usage = response.data.usage;
        }
      }, (error) => {
        this.loading = false;
        this.error = error;
        this.duels = [];
        this.usage = {};
      });
    },
    isArrayNotEmpty: (Arr) => Arr.length > 0,
  },
  mounted: function () {
    this.makeCall();
  },
  watch: {
    card: function () {
      this.makeCall();
    },
    date: function () {
      this.makeCall();
    },
    format: function () {
      this.makeCall();
    },
  },
};
</script>
