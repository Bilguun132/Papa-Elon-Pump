import puppeteer from "puppeteer";
import { Tweet } from "./model";
import { Browser, Page } from "puppeteer/lib/cjs/puppeteer/api-docs-entry";

export class Scraper {
  private static instance: Scraper;
  private tweetTimeStampMap: { [key: string]: number } = {};
  private browser: Browser | null = null; // for test disable the headless mode,
  private constructor() {}

  public static getInstance = (): Scraper => {
    if (!Scraper.instance) {
      Scraper.instance = new Scraper();
    }

    return Scraper.instance;
  };

  scrapeTwitter = async (
    username: String,
    onComplete: (tweet: Tweet) => void
  ) => {
    let page: Page;
    setInterval(async () => {
      console.log(`scraping: `, username);
      if (!this.browser) {
        this.browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox"],
        }); // for test disable the headless mode,
        await this.browser.newPage();
        const pages = await this.browser.pages();
        page = pages[0];
        await page.setViewport({ width: 1000, height: 926 });
      }

      await page.goto("https://twitter.com/" + username + "/with_replies", {
        waitUntil: "networkidle2",
      });

      console.log("start evaluate javascript");

      const tweets = await page.evaluate(() => {
        console.log(`evaluating`);
        const header_sel =
          "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div.css-1dbjc4n.r-aqfbo4.r-14lw9ot.r-j7yic.r-rull8r.r-qklmqi.r-gtdqiz.r-1gn8etr.r-1g40b8q";

        let header = document.querySelector(header_sel);
        //@ts-expect-error
        header.style.setProperty("display", "none", "important");
        const div = document.querySelectorAll('[data-testid="tweet"]');
        const tweets: Array<Tweet> = [];

        div.forEach((el) => {
          const time = el.querySelector("time")?.dateTime;
          const author = el.children[1].children[0].querySelector("span")
            ?.textContent;
          const tweetText = el.children[1].children[1].querySelector("span")
            ?.textContent;

          tweets.push({
            timestamp: Date.parse(time ?? ""),
            tweet: tweetText ?? "",
            author: author ?? "",
          });
        });

        return tweets;
      });

      if (tweets.length > 0) {
        let latestTweet = tweets[0];
        if (
          latestTweet.timestamp !== this.tweetTimeStampMap[latestTweet.author]
        ) {
          const el = await page.$(
            "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(3) > section > div > div > div:nth-child(1) > div > div > article > div > div > div > div.css-1dbjc4n.r-18u37iz"
          );
          el?.screenshot({ path: `${username}.png` });
          onComplete(latestTweet);
          this.tweetTimeStampMap[latestTweet.author] = latestTweet.timestamp;
        }
      }
    }, 15000);
  };
}
