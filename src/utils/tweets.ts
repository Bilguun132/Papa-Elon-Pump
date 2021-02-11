import { Tweet } from "../model";
import { TweetModel } from "../db/Models/Tweet";
export function getTweets($: any) {
  let tweets: Tweet[] = [];
  $('div[data-testid="tweet"]').each((i: number, elem: any) => {
    tweets[i] = extractTweet($, i, elem);
  });

  // console.log('tweets', tweets);
  return tweets;
}

//|----|----------|
//|    |     B    |
//| A  |----------|
//|    |     C    |
//|----|----------|
export const extractTweet = ($: any, i: number, elem: any) => {
  const link = $(elem).parent().parent().next().attr("href");

  const textContent = $(elem).children().last();
  // B
  const topContent = textContent.children().first();
  const time = textContent.find("time");
  const replyLink = time.parent().attr("href");
  // C
  const bottomContent = textContent.children().last().children();
  const msg = bottomContent.find('div[lang="en"]').text();

  const isReply = !!link ? false : true;
  const href = isReply ? replyLink : link;
  const id = extractIdFromHref(href);

  return {
    tweetId: Number(id),
    msg,
    type: isReply ? "reply" : "tweet",
    link: href,
    timestamp: new Date(time.attr("datetime")).getTime(),
    relativeTime: time.text(),
  };
};

export const extractIdFromHref = (link: string) => {
  const re = new RegExp("/status/(.*)");
  const matched = link.match(re);
  return matched && matched[1] ? matched[1] : "";
};

export const getTweetSS = async (
  page: any,
  tweets: Tweet[],
  username: string,
  onComplete: (tweet: Tweet) => void
) => {
  if (tweets.length > 0) {
    let latestTweet = tweets[0];
    const dbLatestTweet = await TweetModel.findOne({
      tweetId: latestTweet.tweetId,
    });
    if (!dbLatestTweet) {
      const el = await page.$(
        "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(3) > section > div > div > div:nth-child(1) > div > div > article > div > div > div > div.css-1dbjc4n.r-18u37iz"
      );
      await el?.screenshot({ path: `${username}.png` });
      onComplete(latestTweet);
      console.log("LatestTweet", latestTweet.tweetId);
      const tweet = new TweetModel(latestTweet);
      tweet.save();
    }
  }
  return;
};
