// Minimal duck-typed interface compatible with PrismaClient, transaction clients,
// and extended clients (ScopedDb) — avoids DefaultArgs vs InternalArgs mismatch.
type Tx = {
  role: {
    findFirst: (...args: any[]) => Promise<any>
  }
}

/**
 * Resolves a system-level role by name.
 * Used when creating org owners, accepting invitations, etc.
 */
export async function getSystemRole(tx: Tx, name: string) {
  const role = await tx.role.findFirst({
    where: { name, tenantId: null },
  })
  if (!role) {
    throw new Error(
      `System role "${name}" not found. Run "prisma db seed" first.`,
    )
  }
  return role
}
