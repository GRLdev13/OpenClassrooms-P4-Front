import { LinkTagDto } from "../tag/TagDto";

export class GetFileDto {
  constructor(
    public id: string,
    public name: string,
    public uploadDate: Date,
    public expirationDate: Date | null,
    public hasExpired: boolean,
    public tags: LinkTagDto[] = [],
    public hasPassword: boolean,
    public link: string | null = null,
  ) {}
}

  export class GetFileLinkDto {
  constructor(
    public link: string,
  ) {}
}
