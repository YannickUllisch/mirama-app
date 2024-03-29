import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@src/components/ui/table'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@src/components/ui/collapsible'

import TableDropDown from '@/src/components/Tables/TableDropDown'
import useSWR from 'swr'
import type { Project, User } from '@prisma/client'
import { fetcher } from '@src/lib/utils'
import { ChevronDown } from 'lucide-react'

const ProjectsTable = () => {
  const { data: projects } = useSWR<Project[]>('/api/projekt', fetcher)
  console.log(projects)

  return (
    <div className="w-[1000px]">
      <h2 className="p-4">All Projects</h2>
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Managed By</TableHead>
              <TableHead className="font-medium">Start Date</TableHead>
              <TableHead className="font-medium">End Date</TableHead>
              <TableHead className="font-medium">Priority</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Budget</TableHead>
              <TableHead className="font-medium">Tasks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects
              ? projects.map((project) => (
                  <Collapsible key={project.id} asChild>
                    <>
                      <TableRow>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{'Michael'}</TableCell>
                        <TableCell>{'placeholder'}</TableCell>
                        <TableCell>{'placeholder'}</TableCell>
                        <TableCell>{project.priority}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>{project.budget}</TableCell>
                        <TableCell>
                          <CollapsibleTrigger
                            className="dark:text-white"
                            asChild
                          >
                            <ChevronDown />
                          </CollapsibleTrigger>
                        </TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableDropDown />
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ProjectsTable
