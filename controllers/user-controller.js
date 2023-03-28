import userService from "../services/user-service.js";
import { validationResult } from "express-validator";
import ApiError from "../errors/api-error.js";
import cardService from "../services/card-service.js";

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest("Ошибка валидации", errors.array()));
      }

      const { email, password } = req.body;

      const userData = await userService.registration(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
        httpOnly: true,
      });

      res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = await userService.login(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
        httpOnly: true,
      });

      res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);

      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;

      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 3600 * 1000,
        httpOnly: true,
      });

      res.status(200).json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async createCard(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const cardData = req.body;

      const card = await cardService.createCard(cardData, refreshToken);

      res.status(200).json(card);
    } catch (e) {
      next(e);
    }
  }

  async getCards(req, res, next) {
    try {
      const userId = req.user.id;
      const cards = await cardService.getCards(userId);

      res.status(200).json(cards);
    } catch (e) {
      next(e);
    }
  }

  async deleteCard(req, res, next) {
    try {
      const id = req.params.id;
      const card = await cardService.deleteCard(id);
      res.status(200).json(card);
    } catch (e) {
      next(e);
    }
  }

  async completeCard(req, res, next) {
    try {
      const id = req.params.id;
      const card = await cardService.completeCard(id);
      res.status(200).json(card);
    } catch (e) {
      next(e);
    }
  }

  async deleteCompleted(req, res, next) {
    try {
      const cardsId = req.body;
      const deleted = await cardService.deleteCompleted(cardsId);
      res.status(200).json(deleted);
    } catch (e) {
      next(e);
    }
  }

  async deleteCompleted(req, res, next) {
    try {
      const userId = req.params.id;
      const deleted = await cardService.deleteCompleted(userId);
      res.status(200).json(deleted);
    } catch (e) {
      next(e);
    }
  }

  async deleteAllCards(req, res, next) {
    try {
      const userId = req.params.id;
      const deleted = await cardService.deleteAllCards(userId);
      res.status(200).json(deleted);
    } catch (e) {
      next(e);
    }
  }

  async deleteImg(req, res, next) {
    try {
      const img = req.body.img;

      const deleted = await cardService.deleteImg(img);
      res.status(200).json(deleted);
    } catch (e) {
      next(e);
    }
  }
}

export default new UserController();
