export class DownloadFileDto {
  constructor(
    public id: string,
    public password: string | null = null,
  ) {}
}
