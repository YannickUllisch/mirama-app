'use client'
import React, { type FC, useEffect, useState } from 'react'
import { Input } from '../ui/tableInput'
import { toast } from 'sonner'
import { updateResourceById } from '@/src/lib/api/updateResource'

interface EditableCellProps {
  id: string
  initialValue: string | number
  mutate(): any
  apiRoute: string
  paramToUpdate: string
}

// This Input can handle both string and number inputs.
const EditableCell: FC<EditableCellProps> = ({
  id,
  mutate,
  initialValue,
  apiRoute,
  paramToUpdate,
}) => {
  const [value, setValue] = useState<string | number>(initialValue)

  // We set the initial value once it is properly passed into component
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // This function is run once the input is closed down. It updates the specified param at the given api route.
  // Since it is meant to update only table values, a single paramToUpdate is fine.
  // A rewrite is required when multiple params are needed to be updated at the same time.
  const onBlur = () => {
    // If the value hasn't been changed we do not want to run this function
    if (initialValue === value) {
      return
    }

    // We do basic checks for the given input and the expected input format.
    // TODO: Replace this with Zod for better input security.
    if (
      typeof initialValue === 'string' &&
      !/[a-zA-Z0-9]+$/.test(value as string)
    ) {
      toast.error('Given input includes non-allowed characters.')
      return
    }
    if (
      typeof initialValue === 'number' &&
      !/^[0-9]+$/.test(value.toString())
    ) {
      toast.error('Given input includes non-allowed characters.')
      return
    }

    try {
      toast.promise(
        updateResourceById(apiRoute, id, {
          [paramToUpdate]: typeof initialValue === 'string' ? value : +value,
        }),
        {
          loading: 'Updating...',
          error: (err) => err,
          success: () => {
            // Mutate updates the fetched data, which then updates the table value.
            mutate()
            return 'Successfully Updated!'
          },
        },
      )
    } catch (error: any) {
      toast.error(error)
    }
  }
  return (
    <Input
      className="overflow-hidden text-ellipsis whitespace-nowrap w-[85%]"
      defaultValue={value}
      // For both int and string, this will set the Value to type string on change.
      onChangeCapture={(e) => setValue(e.currentTarget.value)}
      type="text"
      onBlur={onBlur}
    />
  )
}

export default EditableCell
