export default class CardDto {
  context;
  description;
  word;
  isCompleted;
  image;

  constructor(model) {
    this.context = model.context;
    this.description = model.description;
    this.word = model.word;
    this.isCompleted = model.isCompleted;
    this.image = model.image;
  }
}
