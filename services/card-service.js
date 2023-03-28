import CardDto from "../dtos/card-dto.js";
import UserDto from "../dtos/user-dto.js";
import cardModel from "../models/card-model.js";
import userModel from "../models/user-model.js";
import tokenService from "./token-service.js";
import fs from "fs";

class CardService {
  async createCard(cardData, refreshToken) {
    const userData = tokenService.validateRefreshToken(refreshToken);

    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const cardD = await cardModel.create({
      ...cardData,
      user: userDto.id,
    });
    const card = new CardDto(cardD);
    return card;
  }

  async getCards(userId) {
    const cards = await cardModel.find({ user: userId });
    return cards;
  }

  async deleteCard(id) {
    const card = await cardModel.findOneAndDelete({ _id: id });
    if (card?.image) {
      await this.deleteImg(card.image);
    }

    return card;
  }

  async completeCard(id) {
    const card = await cardModel.findOne({ _id: id });

    card.isCompleted = !card.isCompleted;
    await card.save();
  }

  async deleteCompleted(userId) {
    const cards = await cardModel.find({ user: userId, isCompleted: true });
    const deletedCards = await cardModel.deleteMany({
      user: userId,
      isCompleted: true,
    });

    cards.map((card) => {
      this.deleteImg(card.image);
    });

    return deletedCards;
  }

  async deleteAllCards(userId) {
    const cards = await cardModel.find({ user: userId });

    const deletedCards = await cardModel.deleteMany({ user: userId });

    cards.map((card) => {
      this.deleteImg(card.image);
    });

    return deletedCards;
  }

  async deleteImg(img) {
    fs.unlink(`${img}`, function (err) {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
}

export default new CardService();
