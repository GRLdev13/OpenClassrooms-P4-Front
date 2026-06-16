import { LinkTagDto } from "../tag/TagDto";

export class GetFileDto {
  constructor(
    public id: string,
    public name: string,
    public rawData: Buffer | Buffer<ArrayBufferLike> | null,
    public uploadDate: Date,
    public expirationDate: Date | null,
    public hasExpired: boolean,
    public tags:LinkTagDto[] = []
  ) {}
}
