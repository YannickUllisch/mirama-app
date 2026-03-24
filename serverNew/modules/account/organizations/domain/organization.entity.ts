// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class OrganizationEntity {
  static createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
  }
}
