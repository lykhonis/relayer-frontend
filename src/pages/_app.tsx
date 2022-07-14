import 'styles/index.css'
import { ModalProvider, ToastProvider } from '@apideck/components'
import { AppProps } from 'next/app'
import { ReactNode } from 'react'
import { Web3Provider } from 'providers/web3'
import { ProfileProvider } from 'providers/profile'
import { NetworkProvider } from 'providers/network'
import { PriceProvider } from 'providers/price'
import { DepositProvider } from 'providers/deposit'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const getLayout = (Component as any).getLayout || ((page: ReactNode) => page)
  return (
    <ToastProvider>
      <Web3Provider>
        <NetworkProvider>
          <ProfileProvider>
            <PriceProvider>
              <DepositProvider>
                <ModalProvider>{getLayout(<Component {...pageProps} />)}</ModalProvider>
              </DepositProvider>
            </PriceProvider>
          </ProfileProvider>
        </NetworkProvider>
      </Web3Provider>
    </ToastProvider>
  )
}
