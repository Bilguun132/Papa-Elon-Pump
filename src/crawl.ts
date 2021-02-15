import cheerio from "cheerio";
import puppeteer from "puppeteer";
import { Tweet } from "./model";
import { Browser, Page } from "puppeteer/lib/cjs/puppeteer/api-docs-entry";

import { getTweets, getTweetSS } from "./utils/tweets";

export class Scraper {
  private static instance: Scraper;
  private browser: Browser | null = null; // for test disable the headless mode,
  private constructor() {}

  private createPage = async (URL: string): Promise<[Page, Tweet[]]> => {
    const page = await this.browser!.newPage();
    await page.setViewport({ width: 1000, height: 926 });
    await page.goto(URL);
    await page.waitForSelector('div[data-testid="tweet"]');
    const header = await page.$(
      "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-aqfbo4.r-kemksi.r-1igl3o0.r-rull8r.r-qklmqi.r-gtdqiz.r-1gn8etr.r-1g40b8q"
    );
    //@ts-expect-error
    await header?.evaluate((el) => (el.style.display = "none"));

    // Load content
    const content = await page.content();
    const $ = cheerio.load(content);

    const tweets = getTweets($);

    return [page, tweets];
  };

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
    console.log(`scraping: `, username);
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      }); // for test disable the headless mode,
    }
    const URL = `https://twitter.com/${username}/with_replies`;
    const [page, tweets] = await this.createPage(URL);
    await getTweetSS(page, tweets, username, onComplete);
    page.close();
    console.log("start evaluate javascript");

    setInterval(async () => {
      const [page, tweets] = await this.createPage(URL);
      await getTweetSS(page, tweets, username, onComplete);
      page.close();
      console.log("Running next...");
    }, 14000);
  };
}
