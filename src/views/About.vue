<template>
  <div class="about">
    <h2>What is Linkuriboh.com?</h2>
    <p>This site is intended to show data from the <b>150 highest rated duels</b> per day, played on the simulator <a target="_blank" href="https://www.duelingbook.com/html5">Dueling Book</a>, in an easy to understand and absorb format. The key areas were deck building inspiration, highlighting trends in card popularity and simple yet friendly presentation. "Linkuriboh" is an iconic <a target="_blank" href="https://yugiohprices.com/card_price?name=Linkuriboh">Link Monster card.</a></p>
    <p>Created in a few late nights during December 2020 as the COVID pandemic raged, a lack of IRL organised play meant increasing difficulty in observing the competitive metagame. The site was also a great opportunity for me to learn <a target="_blank" href="https://vuejs.org/">the Vue framework.</a></p>
    <h2>How does it work?</h2>
    <p>Somewhat discretely, Dueling Book actually stores logs for every duel ever played. A simple task running at midnight reads all logs for the previous day.</p>
    <p>The rating of both players is combined into a single "Combined Rating", then the logs are sorted and trimmed so only the top 150 duels remain. Perhaps with additional support and infrastructure, more than 150 could be catalogued if the demand is there. :)</p>
    <h2>I want to contact you!</h2>
    <p><a target="_blank" href="mailto:&#108;&#105;&#110;&#107;&#117;&#114;&#105;&#098;&#111;&#104;&#064;&#108;&#111;&#103;&#097;&#110;&#119;&#104;&#105;&#116;&#101;&#046;&#111;&#114;&#103;">Send me an email.</a></p>
    <br>
    <p>Linkuriboh.com is not affiliated with, endorsed, sponsored, or specifically approved by Dueling Book, the Yu-Gi-Oh! Trading Card Game or Konami.</p>
    <p>HUGE thank-you to the <a target="_blank" href="http://yugiohprices.com/">Yugioh Prices API</a> for card images.</p>
  </div>
</template>
