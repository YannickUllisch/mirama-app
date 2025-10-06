export const validateRecusiveSubtasks = (
  subtasks: any[],
  id: string | null,
): boolean => {
  if (!id) return false
  for (const sub of subtasks) {
    if (sub.id === id) return true
    if (sub.subtasks && validateRecusiveSubtasks(sub.subtasks, id)) return true
  }
  return false
}
