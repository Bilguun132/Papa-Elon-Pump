require("dotenv").config();
import { Telegraf } from "telegraf";

import { Scraper } from "./crawl";
import { Tweet } from "./model";
require("./db");

//@ts-expect-error
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.launch();
// Scraper.getInstance().scrapeTwitter("elonmusk", (tweet: Tweet) => {
//   bot.telegram.sendPhoto("@papa_elon_pump_test", { source: `elonmusk.png` }, {caption: "Papa Elon Blessing..."});
//   // const text = `${tweet.author} \n**${new Date(
//   //   tweet.timestamp
//   // ).toLocaleTimeString()}** \n_${tweet.tweet}_`;
//   // bot.telegram.sendMessage(`@papa_elon_pump_test`, text, { parse_mode: "Markdown" });
// });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
