import AdyenCheckout from '@adyen/adyen-web'
import ApplePayElement from '@adyen/adyen-web/dist/types/components/ApplePay'
import UIElement from '@adyen/adyen-web/dist/types/components/UIElement'
import PaymentMethodsResponse from '@adyen/adyen-web/dist/types/core/ProcessResponse/PaymentMethodsResponse'
import { PaymentAction } from '@adyen/adyen-web/dist/types/types'
import { FetchResult, useMutation } from '@graphcommerce/graphql'
import { useCartQuery } from '@graphcommerce/magento-cart'
import { BillingPageDocument } from '@graphcommerce/magento-cart-checkout'
import { Trans } from '@lingui/react'
import { useRouter } from 'next/router'
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import {
  AdyenPaymentDetailsDocument,
  AdyenPaymentDetailsMutation,
} from '../components/AdyenPaymentHandler/AdyenPaymentDetails.gql'
import { useAdyenPaymentMethod } from './useAdyenPaymentMethod'

type useAdyenCreateOnSiteCheckoutProps = {
  brandCode: string
  cartId: string | undefined
  orderNumber: string | undefined
  onSuccess: (orderNumber: string) => Promise<void>
  submit: () => void
  paymentContainer: React.MutableRefObject<HTMLDivElement | undefined>
  adyenComponent: React.MutableRefObject<adyenComponentState>
  adyenAdditionalAction: PaymentAction | undefined
  setAdyenAdditionalAction: Dispatch<SetStateAction<PaymentAction | undefined>>
  adyenError: ReactElement | undefined
  setAdyenError: Dispatch<SetStateAction<ReactElement | undefined>>
}

export type adyenComponentState = {
  state:
    | {
        paymentMethod: {
          brand: string
        }
      }
    | undefined
  isValid: boolean
  isAllowSubmit: boolean
}

export const adyenSuccessStatuses = ['Authorised', 'Received', 'PresentToShopper']
const supportedOnSitePaymentMethods = ['scheme', 'blik', 'applepay']

export function useAdyenCreateOnSiteCheckout(props: useAdyenCreateOnSiteCheckoutProps) {
  const {
    brandCode,
    cartId,
    orderNumber,
    onSuccess,
    submit,
    paymentContainer,
    adyenComponent,
    adyenAdditionalAction,
    setAdyenAdditionalAction,
    setAdyenError,
  } = props

  const [applePayComponentMounted, setApplePayComponentMounted] = useState<
    ApplePayElement | undefined
  >()

  const { locale } = useRouter()
  const conf = useAdyenPaymentMethod(brandCode)
  const { data: cartResult } = useCartQuery(BillingPageDocument, { fetchPolicy: 'cache-first' })
  const [getPaymentDetails] = useMutation(AdyenPaymentDetailsDocument, {
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    let ignore = false

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function handleRefusedPayment(component: UIElement<any>) {
      setAdyenError(
        <Trans id='The payment is refused, please try again or select a different payment method.' />,
      )
      setAdyenAdditionalAction(undefined)
      component?.remount()
    }

    if (
      supportedOnSitePaymentMethods.includes(brandCode) &&
      conf?.paymentMethodsResponse?.paymentMethods
    ) {
      const createCheckout = async () => {
        const checkout = await AdyenCheckout({
          locale,
          environment: process.env.NODE_ENV === 'development' ? 'test' : 'live',
          clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
          paymentMethodsResponse: conf.paymentMethodsResponse as PaymentMethodsResponse,
          onError: (error, component) => {
            if (process.env.NODE_ENV === 'development') console.log(error)
            if (component) {
              handleRefusedPayment(component)
            }
          },
          onChange(state) {
            adyenComponent.current.isValid = state.isValid
            adyenComponent.current.state = state.data
          },
          onAdditionalDetails: async (state, component) => {
            if (cartId && orderNumber && component) {
              state.data.orderId = orderNumber
              let paymentDetails: FetchResult<AdyenPaymentDetailsMutation> | undefined

              try {
                paymentDetails = await getPaymentDetails({
                  variables: { cartId, payload: JSON.stringify(state.data) },
                })
              } catch (e) {
                if (process.env.NODE_ENV === 'development') console.log(e)
              }

              if (!paymentDetails) {
                handleRefusedPayment(component)
                return
              }

              const orderDetails = paymentDetails.data?.adyenPaymentDetails

              if (
                orderDetails?.isFinal === true &&
                orderDetails?.resultCode &&
                adyenSuccessStatuses.includes(orderDetails?.resultCode)
              ) {
                await onSuccess(orderNumber)
              } else {
                handleRefusedPayment(component)
              }
            }
          },
          onSubmit: (state, component) => {
            adyenComponent.current.state = state.data
            if (state.isValid) {
              submit()
            } else {
              handleRefusedPayment(component)
            }
          },
        })

        // The 'ignore' flag is used to avoid double re-rendering caused by React 18 StrictMode
        // More about it here: https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data
        if (paymentContainer.current && !ignore) {
          if (brandCode === 'applepay') {
            if (!applePayComponentMounted && cartResult?.cart?.prices?.grand_total?.value) {
              const options = {
                amount: {
                  value: cartResult.cart.prices.grand_total.value * 100,
                  currency: cartResult.cart?.prices?.grand_total?.currency,
                },
                buttonType: 'order',
                countryCode: cartResult.cart.shipping_addresses[0]?.country?.code,
                totalPriceLabel: 'Authorization',
                onClick: (resolve, reject) => {
                  if (adyenComponent.current.isAllowSubmit) {
                    resolve()
                  } else {
                    setAdyenError(<Trans id='You have to agree in order to proceed' />)
                    reject()
                  }
                },
              }

              const applePayComponent = checkout.create(
                'applepay',
                options,
              ) as unknown as ApplePayElement

              applePayComponent
                .isAvailable()
                .then(
                  () =>
                    paymentContainer.current &&
                    setApplePayComponentMounted(applePayComponent.mount(paymentContainer.current)),
                )
                .catch(() => {
                  setAdyenError(
                    <Trans id='Apple Pay is not available on your device. Please use the Safari browser if you wish to make a purchase using this payment method.' />,
                  )
                })
            }
          } else {
            checkout.create(brandCode).mount(paymentContainer.current)
          }
        }

        if (adyenAdditionalAction) {
          checkout.components[0]?.handleAction(adyenAdditionalAction)
        }
      }

      createCheckout().catch((e) => {
        if (process.env.NODE_ENV === 'development') console.log(e)
      })
    }

    return () => {
      ignore = true
    }
  }, [
    brandCode,
    adyenAdditionalAction,
    applePayComponentMounted,
    cartResult,
    conf,
    locale,
    paymentContainer,
    adyenComponent,
    cartId,
    orderNumber,
    getPaymentDetails,
    onSuccess,
    submit,
    setAdyenError,
    setAdyenAdditionalAction,
  ])
}
