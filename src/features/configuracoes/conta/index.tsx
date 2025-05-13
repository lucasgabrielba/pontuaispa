import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Conta'
      desc='Atualize suas informações de conta, como nome, e-mail e senha.'
    >
      <AccountForm />
    </ContentSection>
  )
}
