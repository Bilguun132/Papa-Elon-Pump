require("dotenv").config();
import { Telegraf } from "telegraf";
import { Scraper } from "./crawl";
import { Tweet } from "./model";
require("./db");

//@ts-expect-error
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.launch();
Scraper.getInstance().scrapeTwitter("elonmusk", (tweet: Tweet) => {
  console.log(tweet);
  const twitterLink = `http://twitter.com${tweet.link}`;
  bot.telegram.sendPhoto("@papa_elon_pump_test", { source: `elonmusk.png` });
  const text = `**${new Date(tweet.timestamp).toLocaleTimeString()}** \n[${
    tweet.msg
  }](${twitterLink})`;
  console.log(text);
  bot.telegram.sendMessage(`@papa_elon_pump_test`, text, {
    parse_mode: "HTML",
  });
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
