import type { LinkTagDto } from "../tag/tag-dto";

export class CreateFileDto {
  constructor(
    public name: string,
    public tags:LinkTagDto[],
    public extension:string,
    public password:string | null,
    public expirationTimeInDay: number,
  ) {}
}
