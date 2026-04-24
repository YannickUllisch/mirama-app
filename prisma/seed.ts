import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import 'dotenv/config';
import { Pool } from "pg";
import { env } from "prisma/config";
import { PrismaClient } from "./generated/client";
import { DEFAULT_PLANS } from "./seed-data/seed-plans";
import { DEFAULT_SYSTEM_POLICIES } from "./seed-data/seed-policies";
import { DEFAULT_SYSTEM_ROLES } from "./seed-data/seed-roles";

config()
const pool = new Pool({ connectionString: env('POSTGRES_PRISMA_URL'), });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const main = async () => {
  const policyMap = new Map<string, string>();
  for (const policy of DEFAULT_SYSTEM_POLICIES) {
    let existing = await prisma.policy.findFirst({
      where: { name: policy.name, tenantId: null },
    });
    if (!existing) {
      existing = await prisma.policy.create({
        data: {
          name: policy.name,
          description: policy.description,
          isManaged: policy.isManaged,
          scope: policy.scope,
          tenantId: null,
          statements: {
            create: policy.statements.map((s) => ({
              effect: s.effect,
              action: s.action,
              resource: s.resource,
            })),
          },
        },
      });
      console.log(`Created policy: ${policy.name}`);
    } 
    policyMap.set(policy.name, existing.id);
  }

 for (const role of DEFAULT_SYSTEM_ROLES) {
  const policyIds = role.policyNames
    .map((pName) => policyMap.get(pName))
    .filter((id): id is string => !!id);

  console.log(`Connecting ${role.name} to policies:`, policyIds);

  await prisma.role.create({
    data: {
      name: role.name,
      description: role.description,
      scope: role.scope,
      tenantId: null,
      policies: {
        connect: policyIds.map((id) => ({ id })),
      },
    },
  });
}

  for (const plan of DEFAULT_PLANS) {
    const existingPlan = await prisma.plan.findFirst({
      where: { name: plan.name },
    });

    if (!existingPlan) {
      await prisma.plan.create({
        data: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          interval: plan.interval,
          features: plan.features,
        },
      });
      console.log(`Created plan: ${plan.name}`);
    }
  }

  console.log("Seeding completed");
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