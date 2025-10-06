'use client'
import apiRequest from '@hooks/query'
import AddTagDialog from '@src/components/Dialogs/AddTagDialog'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { TagIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTagColumns } from './helper/TagTabColumns'

const TagsTab = () => {
  const { data: session } = useSession()
  const { data: tags, isLoading } = apiRequest.tag.fetchAll.useQuery()
  const { mutate: useDeleteTag } = apiRequest.tag.delete.useMutation()
  const { mutate: useUpdateTag } = apiRequest.tag.update.useMutation()

  return (
    <>
      <PageHeader
        icon={TagIcon}
        title="Tags"
        description="View and manage Tags used across Projects and Tasks"
      />
      <DataTable
        tableIdentifier="tagsTable"
        columns={useTagColumns({
          deleteMutation: useDeleteTag,
          session: session,
          updateMutation: useUpdateTag,
        })}
        data={tags ?? []}
        dataLoading={isLoading}
        toolbarOptions={{
          showFilterOption: true,
          addToolbarleft: <AddTagDialog key={'tag-dialog'} />,
        }}
      />
    </>
  )
}

export default TagsTab
