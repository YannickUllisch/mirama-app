// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class ProjectEntity {
  static assertUniqueProjectName(existing: { id: string } | null): void {
    if (existing) {
      throw new Error('Project name must be unique across your organization.')
    }
  }
}
