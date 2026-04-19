'use client'
import apiRequest from '@hooks/query'
import { useEditableColumns } from '@src/modules/shared/hooks/utils/useEditableColumns'
import type { TagResponse } from '@server/modules/account/tags/features/response'
import {
  type UpdateTagRequest,
  UpdateTagSchema,
} from '@server/modules/account/tags/features/update-tag/schema'
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
    TagResponse,
    UpdateTagRequest
  >({
    mutate: useUpdateTag,
    updateSchema: UpdateTagSchema,
    mapToUpdateInput: (data) => ({
      ...data,
    }),
    prepareMutation: (id, data) => ({
      id,
      data,
    }),
    onValidationError: (err) => {
      const firstMessage = err.issues?.[0]?.message || 'Input Error'
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
