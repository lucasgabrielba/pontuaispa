import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
export default function UnauthorisedError() {
  const navigate = useNavigate()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>401</h1>
        <span className='font-medium'>Acesso Não Autorizado</span>
        <p className='text-center text-muted-foreground'>
          Por favor, faça login com as credenciais apropriadas <br /> para acessar este
          recurso.
        </p>
        <div className='mt-6 flex gap-4'>
        <Button variant='outline' onClick={() => window.location.reload()}>
            Voltar
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Voltar para Início</Button>
        </div>
      </div>
    </div>
  )
}