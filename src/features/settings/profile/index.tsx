import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Perfil'
      desc='Gerencie suas informações pessoais, como nome, e-mail e foto de perfil.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
