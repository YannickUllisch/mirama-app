// src/modules/tenant/setup/setup.hooks.ts
import { useMutation } from '@tanstack/react-query'
import type { ProfileSetupCommand } from './setup.types'

// TODO: point at the real profile endpoint once the backend exposes title/avatar on the user
const updateProfileFn = async (
  data: ProfileSetupCommand,
): Promise<ProfileSetupCommand> => data

export const useUpdateProfileSetup = () =>
  useMutation({ mutationFn: updateProfileFn })
