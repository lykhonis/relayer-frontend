import { useCallback, useState } from 'react'
import useSWR from 'swr'
import Web3 from 'web3'
import classNames from 'classnames'
import { shortenHex } from 'utils/shortenHex'
import { useClipboard } from 'use-clipboard-copy'
import { useToast } from '@apideck/components'
import { formatLyx } from 'utils/lyx'
import useProfile from 'hooks/useProfile'
import useWeb3 from 'hooks/useWeb3'

type Transaction = {
  hash: string
  to?: string | null
  value?: string
  fee?: string
  status: 'unknown' | 'pending' | 'completed' | 'failed'
  createdAt: string
}

type TransactionPage = {
  pageCount: number
  transactions: Transaction[]
}

const Transactions = () => {
  const { profile } = useProfile()
  const web3 = useWeb3()
  const [page, setPage] = useState(0)
  const { addToast } = useToast()
  const clipboard = useClipboard()

  const { data } = useSWR<TransactionPage | undefined>(
    web3 && profile?.address ? `/api/transactions?profile=${profile.address}&page=${page}` : null,
    async (url) => {
      const response = await fetch(url, {
        method: 'get',
        headers: { 'Accept-Type': 'application/json' }
      })
      if (response.ok) {
        const data = await response.json()
        return {
          pageCount: data.pageCount,
          transactions: await Promise.all(
            data.transactions.map(async (data: any) => {
              const info: Transaction = {
                hash: data.transactionHash,
                status: data.status,
                createdAt: data.createdAt
              }
              const tx = await web3?.eth?.getTransaction(data.transactionHash)
              if (tx) {
                info.to = tx.to
                info.value = tx.value
                info.fee = Web3.utils.toBN(tx.gas).mul(Web3.utils.toBN(tx.gasPrice)).toString()
                if (data.status === 'completed' || data.status === 'failed') {
                  const receipt = await web3?.eth?.getTransactionReceipt(data.transactionHash)
                  if (receipt) {
                    info.fee = Web3.utils
                      .toBN(receipt.gasUsed)
                      .mul(Web3.utils.toBN(tx.gasPrice))
                      .toString()
                  }
                }
              }
              return info
            })
          )
        }
      }
    }
  )

  const pageCount = Math.max(1, data?.pageCount ?? 1)
  const pageTotal = Math.ceil(data?.transactions?.length ?? 0 / pageCount)

  const handlePrevious = useCallback(async () => setPage(page - 1), [page])
  const handleNext = useCallback(async () => setPage(page + 1), [page])
  const handleForward = useCallback(
    async () => setPage(Math.min(Math.max(0, pageTotal - 1), page + pageCount)),
    [page, pageTotal, pageCount]
  )
  const handleBackward = useCallback(
    async () => setPage(Math.max(0, page - pageCount)),
    [page, pageCount]
  )

  return (
    <div className="max-w-3xl mx-auto px-4 my-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="rounded-lg overflow-hidden shadow px-4 py-5 h-full">
        <ul role="list" className="divide-y divide-gray-200 overflow-hidden">
          {data?.transactions &&
            data.transactions
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
                            transaction.status === 'pending'
                              ? 'bg-gray-100 text-gray-800'
                              : transaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1 sm:flex sm:justify-between">
                      <div className="flex flex-col">
                        <p className="flex items-center text-sm text-gray-500">
                          {transaction.to ? (
                            <>
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
                            </>
                          ) : (
                            <>&#8230;</>
                          )}
                        </p>
                        <p className="mt-2 flex items-center text-xs text-gray-500">
                          Value: {transaction.value ? formatLyx(transaction.value) : <>&#8230;</>}
                        </p>
                        <p className="flex items-center text-xs text-gray-500">
                          Fee: {transaction.fee ? formatLyx(transaction.fee) : <>&#8230;</>}
                        </p>
                      </div>
                      <div className="mt-2 flex items-start text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(transaction.createdAt).toLocaleString(undefined, {
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
              {Math.min(Math.max(1, pageTotal), page + pageCount - 1)}
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
