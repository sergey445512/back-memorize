import { Schema, model } from "mongoose";

const tokenModel = Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  refreshToken: { type: String, required: true },
});

export default model("Token", tokenModel);
