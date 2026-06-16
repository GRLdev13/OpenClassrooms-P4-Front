export class FileDto {
  constructor(
    public id: string,
    public rawData: Buffer | Buffer<ArrayBufferLike> | null,
    public uploadDate: Date | null,
    public expirationDate: Date | null,
    public isFileExpired: boolean
  ) {}
}