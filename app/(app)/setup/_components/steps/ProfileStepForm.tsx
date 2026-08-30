// app/(app)/setup/_components/steps/ProfileStepForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateProfileSetup } from '@src/modules/tenant/setup/setup.hooks'
import {
  type ProfileSetupCommand,
  ProfileSetupSchema,
} from '@src/modules/tenant/setup/setup.types'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import { Input } from '@ui/input'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import AvatarPicker from '../AvatarPicker'
import { useSetup } from '../SetupProvider'
import SetupShell from '../SetupShell'

const ProfileStepForm = () => {
  const { avatars, draft, setProfile, nextStep } = useSetup()
  const { mutate: updateProfile, isPending } = useUpdateProfileSetup()

  const form = useForm<ProfileSetupCommand>({
    resolver: zodResolver(ProfileSetupSchema),
    defaultValues: draft.profile,
  })

  useEffect(() => {
    if (draft.profile.avatar && !form.getValues('avatar')) {
      form.setValue('avatar', draft.profile.avatar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.profile.avatar])

  const onContinue = form.handleSubmit((data) => {
    setProfile(data)
    updateProfile(data, {
      onSuccess: nextStep,
      onError: nextStep,
    })
  })

  return (
    <Form {...form}>
      <SetupShell
        title="Set up your profile"
        description="Choose how you'll appear in Mirama"
        onContinue={onContinue}
        isPending={isPending}
        onSkip={nextStep}
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <AvatarPicker
                  avatars={avatars}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Yannick Ullisch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </SetupShell>
    </Form>
  )
}

export default ProfileStepForm
