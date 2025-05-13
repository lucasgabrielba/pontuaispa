import ContentSection from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export default function SettingsNotifications() {
  return (
    <ContentSection
      title='Notificações'
      desc='Configure as preferências de notificação para receber alertas e atualizações.'
    >
      <NotificationsForm />
    </ContentSection>
  )
}
