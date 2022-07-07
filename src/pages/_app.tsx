import 'styles/index.css'
import { ModalProvider, ToastProvider } from '@apideck/components'
import { AppProps } from 'next/app'
import { ReactNode } from 'react'
import { Web3Provider } from 'providers/web3'
import { ProfileProvider } from 'providers/profile'
import { NetworkProvider } from 'providers/network'
import { PriceProvider } from 'providers/price'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const getLayout = (Component as any).getLayout || ((page: ReactNode) => page)
  return (
    <ToastProvider>
      <Web3Provider>
        <NetworkProvider>
          <ProfileProvider>
            <PriceProvider>
              <ModalProvider>{getLayout(<Component {...pageProps} />)}</ModalProvider>
            </PriceProvider>
          </ProfileProvider>
        </NetworkProvider>
      </Web3Provider>
    </ToastProvider>
  )
}
