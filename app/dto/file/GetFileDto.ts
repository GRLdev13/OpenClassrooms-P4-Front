export class GetFileDto {
  constructor(
    public id: string,
    public expirationDate: Date | null,
    public uploadDate: Date | null,
    public isFileExpired: boolean,
  ) {}
}
