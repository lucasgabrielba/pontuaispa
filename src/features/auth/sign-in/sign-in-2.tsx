import ViteLogo from '@/assets/vite.svg'
import { UserAuthForm } from './components/user-auth-form'
import { SquareAsterisk } from 'lucide-react'

export default function SignIn2() {
  return (
    <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <SquareAsterisk />
          <h1 className="text-xl font-medium ml-2">Pontu AI</h1>
        </div>
        <img
          src={ViteLogo}
          className="relative m-auto"
          width={301}
          height={60}
          alt="Vite"
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Maximize seus pontos e benefícios de fidelidade com análise inteligente dos seus gastos em cartões de crédito.&rdquo;
            </p>
            <footer className="text-sm">Pontu AI - Decisões financeiras inteligentes</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-left">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Entre com seu e-mail e senha{' '}
              <br />
              <span className="hidden sm:inline">
                ou use um dos provedores de autenticação
              </span>
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
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
        </div>
      </div>
    </div>
  )
}