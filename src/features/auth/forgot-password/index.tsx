import { Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { ForgotForm } from './components/forgot-password-form'

export default function ForgotPassword() {
 return (
   <AuthLayout>
     <Card className="p-6">
       <div className="mb-2 flex flex-col space-y-2 text-left">
         <h1 className="text-md font-semibold tracking-tight">
           Esqueci minha Senha
         </h1>
         <p className="text-sm text-muted-foreground">
           Digite seu email cadastrado e <br /> enviaremos um link para
           redefinir sua senha.
         </p>
       </div>
       <ForgotForm />
       <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
         Não tem uma conta?{' '}
         <Link
           to="/sign-up"
           className="underline underline-offset-4 hover:text-primary"
         >
           Cadastre-se
         </Link>
         .
       </p>
     </Card>
   </AuthLayout>
 )
}