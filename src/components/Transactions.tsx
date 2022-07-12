import BN from 'bn.js'
import classNames from 'classnames'
import { shortenHex } from 'utils/shortenHex'
import { useClipboard } from 'use-clipboard-copy'
import { useToast } from '@apideck/components'
import { formatLyx } from 'utils/lyx'
import { useCallback, useState } from 'react'
import Web3 from 'web3'

const Transactions = () => {
  const transactions = []
  for (let i = 0; i < 10; i++) {
    transactions.push(
      {
        hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
        block: '286750',
        to: '0xb19dd19543724749c0032a19849a461d80e6a052',
        gas: '21000',
        value: new BN('0').add(Web3.utils.toWei(new BN(i), 'ether')).toString(),
        status: 'confirmed',
        timestamp: new Date().getTime() / 1000
      },
      {
        hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
        block: '286750',
        to: '0xb19dd19543724749c0032a19849a461d80e6a052',
        gas: '21000',
        value: '1250000000000000000',
        status: 'reverted',
        timestamp: new Date().getTime() / 1000
      },
      {
        hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
        block: '286750',
        to: '0xb19dd19543724749c0032a19849a461d80e6a052',
        gas: '21000',
        value: '1000000000000000000',
        status: 'confirmed',
        timestamp: new Date().getTime() / 1000
      },
      {
        hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
        block: '286750',
        to: '0xb19dd19543724749c0032a19849a461d80e6a052',
        gas: '21000',
        value: '0',
        status: 'reverted',
        timestamp: new Date().getTime() / 1000
      },
      {
        hash: '0x10f7aa98e51f055cd5bd894fa635bf9f91a54ca10d7335b42af7682c57132048',
        block: '286750',
        to: '0xb19dd19543724749c0032a19849a461d80e6a052',
        gas: '21000',
        value: '3420000000000000000',
        status: 'confirmed',
        timestamp: new Date().getTime() / 1000
      }
    )
  }
  const pageCount = 10
  const pageNavStep = 10
  const pageTotal = Math.ceil(transactions.length / pageCount)
  const [page, setPage] = useState(0)
  const { addToast } = useToast()
  const clipboard = useClipboard()
  const handlePrevious = useCallback(async () => setPage(page - 1), [page])
  const handleNext = useCallback(async () => setPage(page + 1), [page])
  const handleForward = useCallback(
    async () => setPage(Math.min(pageTotal - 1, page + pageNavStep)),
    [page, pageTotal]
  )
  const handleBackward = useCallback(async () => setPage(Math.max(0, page - pageNavStep)), [page])
  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="rounded-lg overflow-hidden shadow px-4 py-5 h-full">
        <ul role="list" className="divide-y divide-gray-200 overflow-hidden">
          {transactions
            .slice(page * pageCount, Math.max(0, (page + 1) * pageCount))
            .map((transaction) => (
              <li key={transaction.hash}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-sm font-medium text-primary-600 truncate hover:text-primary-900"
                      href={`https://explorer.execution.l16.lukso.network/tx/${transaction.hash}`}
                    >
                      {transaction.hash}
                    </a>
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
                      <p className="flex items-center text-sm text-gray-500">
                        &#8594; {shortenHex(transaction.to, 6)}
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
                      <p className="flex items-center text-sm text-gray-500 sm:ml-2">
                        {formatLyx(transaction.value)} Gas: {transaction.gas}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
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
      <nav className="mt-10">
        <div className="max-w-md sm:max-w-sm mx-auto flex items-center justify-between">
          <div className="-mt-px w-0 flex-1 flex">
            {page > 0 && (
              <a
                className="cursor-pointer border-transparent border-b-2 pb-2 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                onClick={handlePrevious}
              >
                Previous
              </a>
            )}
          </div>
          <div className="hidden md:-mt-px md:flex">
            <a
              className="cursor-pointer border-transparent border-b-2 pb-2 text-gray-500 hover:text-gray-700 hover:border-gray-300 px-4 inline-flex items-center text-sm font-medium"
              onClick={handleBackward}
            >
              {page + 1}
            </a>
            <span className="border-transparent text-gray-500 px-4 inline-flex items-center text-sm font-medium">
              ...
            </span>
            <a
              className="cursor-pointer border-transparent border-b-2 pb-2 text-gray-500 hover:text-gray-700 hover:border-gray-300 px-4 inline-flex items-center text-sm font-medium"
              onClick={handleForward}
            >
              {Math.min(pageTotal, page + pageNavStep - 1)}
            </a>
          </div>
          <div className="-mt-px w-0 flex-1 flex justify-end">
            {page < pageTotal - 1 && (
              <a
                className="cursor-pointer border-transparent border-b-2 pb-2 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                onClick={handleNext}
              >
                Next
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Transactions
