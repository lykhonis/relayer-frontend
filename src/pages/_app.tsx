import 'styles/index.css'
import { ModalProvider, ToastProvider } from '@apideck/components'
import { AppProps } from 'next/app'
import { ReactNode } from 'react'
import { Web3Provider } from 'providers/web3'
import { ProfileProvider } from 'providers/profile'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const getLayout = (Component as any).getLayout || ((page: ReactNode) => page)
  return (
    <ToastProvider>
      <Web3Provider>
        <ProfileProvider>
          <ModalProvider>{getLayout(<Component {...pageProps} />)}</ModalProvider>
        </ProfileProvider>
      </Web3Provider>
    </ToastProvider>
  )
}
