import mongoose from "mongoose";
const TweetSchema = new mongoose.Schema({
  tweetId: {
    type: Number,
    unique: true,
  },
  msg: String,
  type: {
    type: String,
    enum: ["tweet", "reply"],
  },
  link: String,
  timestamp: Number,
  relativeTime: String,
});

export const TweetModel = mongoose.model("Tweet", TweetSchema);
