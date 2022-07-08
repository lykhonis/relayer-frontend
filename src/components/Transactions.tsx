import classNames from 'classnames'
import { shortenHex } from 'utils/shortenHex'
import { useClipboard } from 'use-clipboard-copy'
import { useToast } from '@apideck/components'

const Transactions = () => {
  const positions = [
    {
      hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
      block: '286750',
      to: '0xb19dd19543724749c0032a19849a461d80e6a052',
      gas: '21000',
      status: 'confirmed',
      timestamp: new Date().getTime() / 1000
    },
    {
      hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
      block: '286750',
      to: '0xb19dd19543724749c0032a19849a461d80e6a052',
      gas: '21000',
      status: 'reverted',
      timestamp: new Date().getTime() / 1000
    },
    {
      hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
      block: '286750',
      to: '0xb19dd19543724749c0032a19849a461d80e6a052',
      gas: '21000',
      status: 'confirmed',
      timestamp: new Date().getTime() / 1000
    },
    {
      hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
      block: '286750',
      to: '0xb19dd19543724749c0032a19849a461d80e6a052',
      gas: '21000',
      status: 'reverted',
      timestamp: new Date().getTime() / 1000
    },
    {
      hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
      block: '286750',
      to: '0xb19dd19543724749c0032a19849a461d80e6a052',
      gas: '21000',
      status: 'confirmed',
      timestamp: new Date().getTime() / 1000
    }
  ]
  const { addToast } = useToast()
  const clipboard = useClipboard()
  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="rounded-lg overflow-hidden shadow px-4 py-5 h-full">
        <ul role="list" className="divide-y divide-gray-200 overflow-hidden">
          {positions.map((transaction) => (
            <li key={transaction.hash}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-primary-600 truncate">
                    {transaction.hash}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p
                      className={classNames(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        transaction.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      )}
                    >
                      {transaction.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">{transaction.block}</p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      {shortenHex(transaction.to, 6)}
                      <a
                        className="ml-1 cursor-pointer"
                        onClick={() => {
                          if (clipboard) {
                            clipboard.copy(transaction.to)
                            addToast({ title: 'Copied', type: 'success' })
                          }
                        }}
                      >
                        <svg
                          className="h-4 w-4 text-gray-500 hover:text-gray-900"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <rect x="8" y="8" width="12" height="12" rx="2" />
                          <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                        </svg>
                      </a>
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {new Date(transaction.timestamp * 1000).toLocaleString(undefined, {
                        year: '2-digit',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        weekday: 'short'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <nav className="border-t border-gray-200 px-4 mt-10 flex items-center justify-between sm:px-0">
        <div className="-mt-px w-0 flex-1 flex">
          <a
            href="#"
            className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Previous
          </a>
        </div>
        <div className="hidden md:-mt-px md:flex">
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
          >
            1
          </a>
          <a
            href="#"
            className="border-primary-500 text-primary-600 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            aria-current="page"
          >
            2
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
          >
            3
          </a>
          <span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
            ...
          </span>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
          >
            8
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
          >
            9
          </a>
          <a
            href="#"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
          >
            10
          </a>
        </div>
        <div className="-mt-px w-0 flex-1 flex justify-end">
          <a
            href="#"
            className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Next
          </a>
        </div>
      </nav>
    </div>
  )
}

export default Transactions
