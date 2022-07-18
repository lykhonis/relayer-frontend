import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from '@apideck/components'
import classNames from 'classnames'

const ActionModal = ({
  isOpened,
  variant,
  subject,
  content,
  negativeTitle,
  negativeAction,
  positiveTitle,
  positiveAction
}: {
  variant?: 'info' | 'danger'
  isOpened?: boolean
  subject: string
  content: string | JSX.Element
  negativeTitle?: string
  positiveTitle: string
  negativeAction?: () => void
  positiveAction: () => void
}) => (
  <Transition.Root show={isOpened ?? false} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-10"
      onClose={() => {
        if (negativeAction) {
          negativeAction()
        }
      }}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div
                  className={classNames(
                    'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10',
                    variant === 'danger' ? 'bg-red-50' : 'bg-blue-50'
                  )}
                >
                  {variant === 'danger' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    {subject}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{content}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button
                  type="button"
                  variant={variant === 'danger' ? 'danger' : 'primary'}
                  className="ml-4"
                  onClick={positiveAction}
                >
                  {positiveTitle}
                </Button>
                <Button type="button" variant="outline" onClick={negativeAction}>
                  {negativeTitle ?? 'Cancel'}
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
)

export default ActionModal
