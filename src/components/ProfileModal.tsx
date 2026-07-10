import type { ProfilePrefs } from '../hooks/useProfile'
import type { NotifPermission } from '../hooks/useNotifications'

interface Props {
  prefs: ProfilePrefs
  permission: NotifPermission
  streak: number
  totalSessions: number
  onUpdate: (patch: Partial<ProfilePrefs>) => void
  onRequestPermission: () => Promise<boolean>
  onUnsubscribe: () => Promise<void>
  onClose: () => void
}

const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7]

export function ProfileModal({
  prefs, permission, streak, totalSessions,
  onUpdate, onRequestPermission, onUnsubscribe, onClose,
}: Props) {
  const notifSupported = permission !== 'unsupported'
  const notifGranted = permission === 'granted'
  const notifDenied = permission === 'denied'

  async function handleToggleNotif() {
    if (notifGranted && prefs.notificationsEnabled) {
      onUpdate({ notificationsEnabled: false })
      await onUnsubscribe()
    } else if (!notifGranted && !notifDenied) {
      const ok = await onRequestPermission()
      if (ok) onUpdate({ notificationsEnabled: true })
    } else if (notifGranted && !prefs.notificationsEnabled) {
      onUpdate({ notificationsEnabled: true })
      // Re-subscribe if needed
      await onRequestPermission()
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet profile-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Mon profil</h2>

        {/* Quick stats */}
        <div className="profile-stats">
          <div className="pstat-box">
            <span className="pstat-val">🔥 {streak}</span>
            <span className="pstat-lbl">Streak</span>
          </div>
          <div className="pstat-box">
            <span className="pstat-val">{totalSessions}</span>
            <span className="pstat-lbl">Séances</span>
          </div>
        </div>

        {/* Workout goal */}
        <div className="profile-section">
          <p className="profile-label">Objectif par semaine</p>
          <div className="days-row">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                className={`day-btn${prefs.workoutsPerWeek === d ? ' active' : ''}`}
                onClick={() => onUpdate({ workoutsPerWeek: d })}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="profile-hint">
            {prefs.workoutsPerWeek}x / semaine
          </p>
        </div>

        {/* Notification settings */}
        {notifSupported && (
          <div className="profile-section">
            <p className="profile-label">Rappel d'entraînement</p>

            {notifDenied ? (
              <p className="profile-hint denied">
                Notifications bloquées dans les paramètres de ton navigateur.
              </p>
            ) : (
              <>
                <div className="notif-row">
                  <span className="notif-label">
                    {notifGranted && prefs.notificationsEnabled ? 'Activées' : 'Désactivées'}
                  </span>
                  <button
                    className={`notif-toggle${notifGranted && prefs.notificationsEnabled ? ' on' : ''}`}
                    onClick={handleToggleNotif}
                  >
                    <span className="notif-toggle-thumb" />
                  </button>
                </div>

                {notifGranted && prefs.notificationsEnabled && (
                  <div className="time-row">
                    <span className="profile-label-sm">Heure du rappel</span>
                    <input
                      type="time"
                      className="time-input"
                      value={prefs.reminderTime}
                      onChange={(e) => onUpdate({ reminderTime: e.target.value })}
                    />
                  </div>
                )}

                {!notifGranted && (
                  <button className="modal-btn-primary notif-cta" onClick={handleToggleNotif}>
                    Activer les notifications
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
