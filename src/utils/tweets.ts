import { Tweet } from "../model";

const TWEET_LIST_DIV = '#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div.css-1dbjc4n.r-14lw9ot.r-1gm7m50.r-1ljd8xs.r-13l2t4g.r-1phboty.r-1jgb5lz.r-11wrixw.r-61z16t.r-1ye8kvj.r-13qz1uu.r-184en5c > div > div:nth-child(2) > div > div > div:nth-child(3) > section > div > div';

export function getTweets($: any) {
    let tweets: Tweet[] = [];
    $('div[data-testid="tweet"]')
        .each((i: number, elem: any) => {
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
    const link = $(elem).parent().parent().next().attr('href');

    const textContent = $(elem).children().last();
    // B
    const topContent = textContent.children().first();
    const time = textContent.find('time');
    const replyLink = time.parent().attr('href');
    // C
    const bottomContent = textContent.children().last().children();
    const msg = bottomContent.find('div[lang="en"]').text();

    const isReply = !!link ? false : true;
    const href = isReply ? replyLink : link;
    const id = extractIdFromHref(href);

    return {
        id: Number(id),
        msg,
        type: isReply ? 'reply' : 'tweet',
        link: href,
        timestamp: time.attr('datetime'),
        relativeTime: time.text(),
    }
}

export const extractIdFromHref = (link: string) => {
    const re = new RegExp('/status/(.*)');
    const matched = link.match(re);
    return (matched && matched[1]) ? matched[1] : '';

}

export const getTweetSS = async (
    page: any,
    tweets: Tweet[],
    map: { [key: number]: string },
    username: string,
    onComplete: (tweet: Tweet) => void
) => {
    if (tweets.length > 0) {
        let latestTweet = tweets[0];
        if (
            latestTweet.timestamp !== map[latestTweet.id]
        ) {
            const el = await page.$("#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(3) > section > div > div > div:nth-child(1) > div > div > article > div > div > div > div.css-1dbjc4n.r-18u37iz");
            el?.screenshot({ path: `${username}.png` });
            onComplete(latestTweet);
            console.log('LatestTweet', latestTweet.id);
            map[latestTweet.id] = latestTweet.timestamp;
        }
    }
    return;
}