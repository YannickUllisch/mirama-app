import { Prisma } from '@prisma/client'

export const reconstructPrismaSelect = ({
  prismaModel,
  rawSelectQuery,
}: { prismaModel: string; rawSelectQuery: string[] }) => {
  const parsedSelections = rawSelectQuery.reduce(
    (acc, column) => {
      acc[column] = true
      return acc
    },
    {} as Record<string, boolean>,
  )

  const model = Prisma.dmmf.datamodel.models.find((m) => m.name === prismaModel)

  const validSelectOptions = model
    ? model.fields.map((field) => field.name)
    : []

  // Validate Selection for safety
  const prismaSelections: any = {}
  for (const column of Object.keys(parsedSelections)) {
    if (!validSelectOptions.includes(column)) {
      return Response.json(
        { ok: false, message: `Invalid select field: ${column}` },
        { status: 400 },
      )
    }
    if (typeof parsedSelections[column] !== 'boolean') {
      return Response.json(
        { ok: false, message: 'Select object is not valid' },
        { status: 400 },
      )
    }
    prismaSelections[column] = parsedSelections[column]
  }

  return prismaSelections
}
