'use client'
import apiRequest from '@hooks/query'
import { useEditableColumns } from '@hooks/utils/useEditableColumns'
import {
  type TagResponseType,
  UpdateTagSchema,
  type UpdateTagType,
} from '@server/domain/tagSchema'
import AddTagDialog from '@src/components/Dialogs/AddTagDialog'
import PageHeader from '@src/components/PageHeader'
import { DataTable } from '@src/components/Tables/DataTable'
import { TagsIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useTagColumns } from './helper/TagTabColumns'

const TagsTab = () => {
  const { data: session } = useSession()
  const { data: tags, isLoading } = apiRequest.tag.fetchAll.useQuery()
  const { mutate: useDeleteTag } = apiRequest.tag.delete.useMutation()
  const { mutate: useUpdateTag } = apiRequest.tag.update.useMutation()

  // Update State
  const { handleFieldUpdate } = useEditableColumns<
    TagResponseType,
    UpdateTagType
  >({
    mutate: useUpdateTag,
    getKey: (data) => data.id,
    updateSchema: UpdateTagSchema,
    mapToUpdateInput: (data) => ({
      ...data,
    }),
    onValidationError: (err) => {
      const firstMessage = err.errors?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })
  return (
    <>
      <PageHeader
        icon={TagsIcon}
        title="Tags"
        description="View and manage Tags used across Projects and Tasks"
      />
      <DataTable
        tableIdentifier="tagsTable"
        columns={useTagColumns({
          deleteMutation: useDeleteTag,
          session: session,
          handleFieldUpdate: handleFieldUpdate,
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
