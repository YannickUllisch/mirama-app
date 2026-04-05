import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";
import { DEFAULT_PLANS } from "./seed-data/seed-plans";
import { DEFAULT_SYSTEM_POLICIES } from "./seed-data/seed-policies";
import { DEFAULT_SYSTEM_ROLES } from "./seed-data/seed-roles";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
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
    const existing = await prisma.role.findFirst({
      where: { name: role.name, tenantId: null },
    });
    if (existing) {
      continue;
    }

    await prisma.role.create({
      data: {
        name: role.name,
        description: role.description,
        tenantId: null,
        policies: {
          connect: role.policyNames
            .filter((pName) => policyMap.has(pName))
            .map((pName) => ({ id: policyMap.get(pName) as string })),
        },
      },
    });
    console.log(`Created role: ${role.name}`);
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