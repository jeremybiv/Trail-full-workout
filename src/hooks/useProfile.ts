import { useCallback, useEffect, useState } from 'react'
import { sg, ss } from '../lib/storage'

export interface ProfilePrefs {
  workoutsPerWeek: number
  reminderTime: string
  timezone: string
  notificationsEnabled: boolean
  deviceId: string
}

function makeDeviceId(): string {
  return crypto.randomUUID()
}

const DEFAULTS: Omit<ProfilePrefs, 'deviceId' | 'timezone'> = {
  workoutsPerWeek: 3,
  reminderTime: '07:30',
  notificationsEnabled: false,
}

export function useProfile() {
  const [prefs, setPrefs] = useState<ProfilePrefs | null>(null)

  useEffect(() => {
    sg<ProfilePrefs>('profile').then((saved) => {
      setPrefs({
        ...DEFAULTS,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        deviceId: makeDeviceId(),
        ...saved,
      })
    })
  }, [])

  const updatePrefs = useCallback((patch: Partial<ProfilePrefs>) => {
    setPrefs((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      void ss('profile', next)
      return next
    })
  }, [])

  return { prefs, updatePrefs }
}
