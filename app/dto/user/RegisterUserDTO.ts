import { Authentification } from "./Authentification";

export class RegisterUserDTO extends Authentification {
  passwordConfirmation: string = "";
  firstName: string = "";
  lastName: string = "";
  token: string = "";

  constructor(data: Partial<RegisterUserDTO> = {}) {
    super();
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.email = data.email || "";
    this.token = data.token || "";
    this.password = data.password || "";
    this.passwordConfirmation = data.passwordConfirmation || "";
  }
}
