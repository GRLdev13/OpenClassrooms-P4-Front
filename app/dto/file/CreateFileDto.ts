export class CreateFileDto {
  constructor(
    public id: string,
    public base64: string | null,
    public expirationDate: Date | null,
    public uploadDate: Date | null,
    public isFileExpired: boolean,
  ) {}
}
