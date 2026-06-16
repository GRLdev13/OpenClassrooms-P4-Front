import { Authentification } from "./Authentification";

export class LoginUserDTO extends Authentification {
  constructor(data: Partial<LoginUserDTO> = {}) {
    super();
    this.email = data.email || "";
    this.password = data.password || "";
  }
}
