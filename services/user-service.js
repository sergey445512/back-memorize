import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import UserDto from "../dtos/user-dto.js";
import tokenService from "./token-service.js";
import ApiError from "../errors/api-error.js";
import mailService from "./mail-service.js";
import userModel from "../models/user-model.js";

class UserService {
  async registration(email, password) {
    const candidate = await userModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с таким почтовым адресом уже существует.`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);

    const activationLink = uuid();

    const user = await userModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    // await mailService.sendActivationMail(
    //   email,
    //   `${process.env.API_URL}/api/activate/${activationLink}`
    // );

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { userDto, ...tokens };
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }

    const passIsEqual = await bcrypt.compare(password, user.password);
    if (!passIsEqual) {
      throw ApiError.BadRequest("Неверный логин или пароль");
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink) {
    const userData = await userModel.findOne({ activationLink });
    if (!userData) {
      throw ApiError.BadRequest("Некоректная ссылка активации");
    }
    userData.isActivated = true;
    await userData.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, userDto };
  }

  async getUsers() {
    const users = await userModel.find();
    return users;
  }
}

export default new UserService();
