export default class AppError extends Error {
  constructor(message = "Une erreur est survenue.") {
    super(message);
    this.name = "AppError";
  }
}