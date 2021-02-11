import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { Tweet } from "./model";
import { Browser, Page } from "puppeteer/lib/cjs/puppeteer/api-docs-entry";

import { getTweets, getTweetSS } from "./utils/tweets";

export class Scraper {
  private static instance: Scraper;
  private browser: Browser | null = null; // for test disable the headless mode,
  private constructor() {}

  public static getInstance = (): Scraper => {
    if (!Scraper.instance) {
      Scraper.instance = new Scraper();
    }

    return Scraper.instance;
  };

  scrapeTwitter = async (
    username: string,
    onComplete: (tweet: Tweet) => void
  ) => {
    let page: Page;
    // setInterval(async () => {
    console.log(`scraping: `, username);
    if (!this.browser)
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      }); // for test disable the headless mode,
    await this.browser.newPage();
    const pages = await this.browser.pages();
    page = pages[0];
    await page.setViewport({ width: 1000, height: 926 });

    // Go to page, wait for our content to be ready
    const URL = `https://twitter.com/${username}/with_replies`;
    await page.goto(URL);
    await page.waitForSelector('div[data-testid="tweet"]');

    // Load content
    const content = await page.content();
    const $ = cheerio.load(content);

    const tweets = getTweets($);
    getTweetSS(page, tweets, username, onComplete);

    console.log("start evaluate javascript");

    setInterval(() => {
      const tweets = getTweets($);
      getTweetSS(page, tweets, username, onComplete);
      console.log("Running next...");
    }, 14000);
  };
}
