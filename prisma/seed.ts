import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SYSTEM_POLICIES = [
  {
    name: "FullAccess",
    description: "Unrestricted access to all resources",
    isManaged: true,
    statements: [{ effect: "ALLOW", action: "*", resource: "*" }],
  },
  {
    name: "OrganizationManages",
    description: "Full control over organization settings and members",
    isManaged: true,
    statements: [
      { effect: "ALLOW", action: "organization:*", resource: "organization/*" },
      { effect: "ALLOW", action: "member:*", resource: "member/*" },
      { effect: "ALLOW", action: "team:*", resource: "team/*" },
    ],
  },
  {
    name: "ProjectManager",
    description: "Create, edit, and delete projects",
    isManaged: true,
    statements: [
      { effect: "ALLOW", action: "project:*", resource: "project/*" },
    ],
  },
  {
    name: "ReadOnly",
    description: "Read-only access to all resources",
    isManaged: true,
    statements: [
      { effect: "ALLOW", action: "*:read", resource: "*" },
      { effect: "ALLOW", action: "*:list", resource: "*" },
    ],
  },
] as const;

const SYSTEM_ROLES = [
  {
    name: "Owner",
    description: "Full unrestricted access, cannot be removed",
    policyNames: ["FullAccess"],
  },
  {
    name: "Admin",
    description:
      "Administrative access to organizations, projects and members",
    policyNames: ["OrganizationManage", "ProjectManage", "TaskManage"],
  },
  {
    name: "Member",
    description: "Standard member with project and task access",
    policyNames: ["ProjectManage", "TaskManage"],
  },
  {
    name: "Viewer",
    description: "Read-only access across the tenant",
    policyNames: ["ReadOnly"],
  },
] as const;

async function main() {
  console.log("Seeding system-level IAM policies and roles...");

  // Upsert policies
  const policyMap = new Map<string, string>();
  for (const pDef of SYSTEM_POLICIES) {
    let policy = await prisma.policy.findFirst({
      where: { name: pDef.name, tenantId: null },
    });
    if (!policy) {
      policy = await prisma.policy.create({
        data: {
          name: pDef.name,
          description: pDef.description,
          isManaged: pDef.isManaged,
          tenantId: null,
          statements: {
            create: pDef.statements.map((s) => ({
              effect: s.effect,
              action: s.action,
              resource: s.resource,
            })),
          },
        },
      });
      console.log(`Created policy: ${pDef.name}`);
    } 
    policyMap.set(pDef.name, policy.id);
  }

  // Upsert roles
  for (const rDef of SYSTEM_ROLES) {
    const existing = await prisma.role.findFirst({
      where: { name: rDef.name, tenantId: null },
    });
    if (existing) {
      continue;
    }

    await prisma.role.create({
      data: {
        name: rDef.name,
        description: rDef.description,
        tenantId: null,
        policies: {
          connect: rDef.policyNames
            .filter((pName) => policyMap.has(pName))
            .map((pName) => ({ id: policyMap.get(pName) as string })),
        },
      },
    });
    console.log(`Created role: ${rDef.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });