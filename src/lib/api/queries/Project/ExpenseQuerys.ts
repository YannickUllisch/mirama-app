import db from '@db'

export const fetchExpensesByProjectId = async (pid: string) => {
  const project = await db.expense.findMany({
    where: {
      projectId: pid,
    },
  })

  return project
}
