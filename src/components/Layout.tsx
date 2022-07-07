import { CSSProperties, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  children: ReactNode
  title?: string
  description?: string
  favicon?: string
  className?: string
  style?: CSSProperties
}

const Layout = ({
  children,
  title = 'Relayer Service',
  description = 'Stake LYX to pay for fees',
  favicon = '/img/logo.png',
  className = '',
  style = {}
}: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="icon" href={favicon} />
    </Head>
    <div className={`h-full min-h-screen font-basier-circle ${className}`} style={style}>
      {children}
    </div>
  </>
)

export default Layout
