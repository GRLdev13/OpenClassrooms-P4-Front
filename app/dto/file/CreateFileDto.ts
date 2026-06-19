import type { LinkTagDto } from "../tag/TagDto";

export class CreateFileDto {
  constructor(
    public name: string,
    public tags:LinkTagDto[],
    public rawData: string | FormData | null,
    public extension:string,
    public password:string | null,
    public expirationTimeInDay: number, //numbers of day 1-3-7
  ) {}
}
