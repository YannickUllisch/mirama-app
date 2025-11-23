'use client'

const BudgetPage = () => {
  // const { data: session } = useSession({ required: true })
  // // States
  // const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  // const {
  //   data: projects,
  //   isLoading,
  //   mutate,
  // } = useSWR<
  //   (Project & {
  //     expenses: Expense[]
  //   })[]
  // >('project')
  // const selectedProject = useMemo(() => {
  //   if (projects && selectedProjectId !== '') {
  //     return projects.find((project) => project.id === selectedProjectId)
  //   }
  //   return undefined
  // }, [projects, selectedProjectId])
  // return (
  //   <main className="flex flex-col">
  //     <PageHeader
  //       icon={CreditCardIcon}
  //       title="Finance Management"
  //       description={'Finance view and management across projects'}
  //     />
  //     <BudgetExpenseBarChart projects={projects ?? []} />
  //     <Separator className="my-7" />
  //     <div>
  //       <span className="text-lg font-semibold">Project Specific Finances</span>
  //       <GeneralSelect
  //         setValue={setSelectedProjectId}
  //         value={selectedProjectId}
  //         placeholder="Select Project"
  //         items={
  //           projects?.map((project) => ({
  //             label: project.name,
  //             value: project.id,
  //           })) ?? []
  //         }
  //       />
  //       {selectedProject && (
  //         <DataTable
  //           key={`datatable-expenses-${selectedProject.name}`}
  //           tableIdentifier={`${selectedProject.name}-budget-table`}
  //           columns={getExpenseColumns({ mutate: mutate, session: session })}
  //           data={selectedProject.expenses ?? []}
  //           dataLoading={isLoading}
  //           toolbarOptions={{ showFilterOption: true }}
  //         />
  //       )}
  //     </div>
  //   </main>
  // )
}

export default BudgetPage
