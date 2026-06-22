import { Authentification } from "./Authentification";

export class LoginUserDTO extends Authentification {

  id:string;
  
  constructor(data: Partial<LoginUserDTO> = {}) {
    super();
    this.email = data.email || "";
    this.id = data.id || "";
    this.password = data.password || "";
  }
}
