import { useCallback, useEffect, useState } from 'react'
import type { ProfilePrefs } from './useProfile'
import type { WorkoutRecord } from './useWorkoutHistory'

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? ''
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return new Uint8Array(Uint8Array.from(raw, (c) => c.charCodeAt(0)).buffer)
}

function weekStartISO(): string {
  const now = new Date()
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - day)
  return monday.toISOString().slice(0, 10)
}

function countWorkoutsThisWeek(records: WorkoutRecord[]): number {
  const weekStart = weekStartISO()
  return records.filter((r) => r.date >= weekStart).length
}

export type NotifPermission = 'default' | 'granted' | 'denied' | 'unsupported'

export function useNotifications(prefs: ProfilePrefs | null, records: WorkoutRecord[]) {
  const [permission, setPermission] = useState<NotifPermission>('default')

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported')
    } else {
      setPermission(Notification.permission as NotifPermission)
    }
  }, [])

  // Sync workout count with Cloudflare Worker whenever records change
  useEffect(() => {
    if (!prefs || !WORKER_URL || Notification.permission !== 'granted') return
    const body = JSON.stringify({
      deviceId: prefs.deviceId,
      workoutsThisWeek: countWorkoutsThisWeek(records),
      weekStart: weekStartISO(),
    })
    void fetch(`${WORKER_URL}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }).catch(() => { /* offline, will retry next session */ })
  }, [prefs, records])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return false

    const result = await Notification.requestPermission()
    setPermission(result as NotifPermission)
    if (result !== 'granted' || !prefs) return false

    // Subscribe to push
    const reg = await navigator.serviceWorker.ready
    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }

    if (!WORKER_URL) return true  // no backend configured yet

    await fetch(`${WORKER_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        deviceId: prefs.deviceId,
        prefs: {
          workoutsPerWeek: prefs.workoutsPerWeek,
          reminderTime: prefs.reminderTime,
          timezone: prefs.timezone,
          enabled: prefs.notificationsEnabled,
        },
        workoutsThisWeek: countWorkoutsThisWeek(records),
        weekStart: weekStartISO(),
      }),
    }).catch(() => { /* offline */ })

    return true
  }, [prefs, records])

  const updateSubscription = useCallback(async (updatedPrefs: ProfilePrefs): Promise<void> => {
    if (!WORKER_URL || Notification.permission !== 'granted') return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (!sub) return

    await fetch(`${WORKER_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        deviceId: updatedPrefs.deviceId,
        prefs: {
          workoutsPerWeek: updatedPrefs.workoutsPerWeek,
          reminderTime: updatedPrefs.reminderTime,
          timezone: updatedPrefs.timezone,
          enabled: updatedPrefs.notificationsEnabled,
        },
        workoutsThisWeek: countWorkoutsThisWeek(records),
        weekStart: weekStartISO(),
      }),
    }).catch(() => { /* offline */ })
  }, [records])

  const unsubscribe = useCallback(async (deviceId: string): Promise<void> => {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    await sub?.unsubscribe()

    if (WORKER_URL) {
      await fetch(`${WORKER_URL}/api/subscribe`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      }).catch(() => { /* offline */ })
    }
    setPermission('default')
  }, [])

  return { permission, requestPermission, updateSubscription, unsubscribe }
}
