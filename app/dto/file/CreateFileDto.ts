import type { LinkTagDto } from "../tag/TagDto";

export class CreateFileDto {
  constructor(
    public name: string,
    public tags:LinkTagDto[],
    public rawData: string | null,
    public extension:string,
    public expirationTimeInDay: number, //numbers of day 1-3-7
  ) {}
}
