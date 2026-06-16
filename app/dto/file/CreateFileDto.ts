import type { LinkTagDto, TagDto } from "../tag/TagDto";

export class CreateFileDto {
  constructor(
    public id: string,
    public name: string,
    public tags:LinkTagDto[],
    public base64: string | null,
    public extension:string,
    public uploadDate: Date | null,
    public expirationTimeInDay: number, //numbers of day 1-3-7
  ) {}
}
