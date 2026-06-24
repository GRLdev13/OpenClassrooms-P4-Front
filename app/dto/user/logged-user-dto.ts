import { Authentification } from "./authentification";

export class LoggedUserDTO extends Authentification {
  firstName: string = "";
  lastName: string = "";
  token: string = "";

  constructor(data: Partial<LoggedUserDTO> = {}) {
    super();
    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.email = data.email || "";
    this.password = data.password || "";
    this.token = data.token || "";
  }
}
