import { Authentification } from "./authentification";

export class DeleteUserDTO extends Authentification {
  email: string = "";
  passwordConfirmation: string = "";

  constructor(data: Partial<DeleteUserDTO> = {}) {
    super();
    this.email = data.email || "";
    this.password = data.password || "";
    this.passwordConfirmation = data.passwordConfirmation || "";
  }
}
