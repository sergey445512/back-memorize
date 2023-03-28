import { Schema, model } from "mongoose";

const CardModel = Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  word: {
    type: String,
    required: true,
  },
  context: String,
  description: String,
  isCompleted: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: true,
  },
});

export default model("Card", CardModel);
