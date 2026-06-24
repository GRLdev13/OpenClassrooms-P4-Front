import { Authentification } from "./authentification";

export class RegisterUserDTO extends Authentification {
  passwordConfirmation: string = "";
  firstName: string = "";
  lastName: string = "";

  constructor(data: Partial<RegisterUserDTO> = {}) {
    super();
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.email = data.email || "";
    this.password = data.password || "";
    this.passwordConfirmation = data.passwordConfirmation || "";
  }
}
