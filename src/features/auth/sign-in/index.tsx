import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className="p-6">
        <CardHeader>
          <CardTitle>
            Login
          </CardTitle>
          <CardDescription>
            Entre com sua conta para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <UserAuthForm />
        <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
          Ao clicar em login, você concorda com nossos{' '}
          <a
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Política de Privacidade
          </a>
          .
        </p>
      </Card>
    </AuthLayout>
  )
}