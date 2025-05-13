import ContentSection from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export default function SettingsAppearance() {
  return (
    <ContentSection
      title='Aparência'
      desc='Escolha o tema e as preferências de exibição que você prefere.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
