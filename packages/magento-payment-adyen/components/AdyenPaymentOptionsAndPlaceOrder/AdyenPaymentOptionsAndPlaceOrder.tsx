import { type PaymentAction } from '@adyen/adyen-web/dist/types/types'
import {
  useFormCompose,
  useFormPersist,
  useFormValidFields,
  TextFieldElement,
} from '@graphcommerce/ecommerce-ui'
import { useFormGqlMutationCart } from '@graphcommerce/magento-cart'
import {
  PaymentOptionsProps,
  usePaymentMethodContext,
} from '@graphcommerce/magento-cart-payment-method'
import { ErrorSnackbar, FormRow, InputCheckmark } from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactElement, useRef, useState } from 'react'
import { useAdyenCartLock } from '../../hooks/useAdyenCartLock'
import {
  useAdyenCreateOnSiteCheckout,
  adyenSuccessStatuses,
  type adyenComponentState,
} from '../../hooks/useAdyenCreateOnSiteCheckout'
import { useAdyenPaymentMethod } from '../../hooks/useAdyenPaymentMethod'
import {
  AdyenPaymentOptionsAndPlaceOrderMutation,
  AdyenPaymentOptionsAndPlaceOrderMutationVariables,
  AdyenPaymentOptionsAndPlaceOrderDocument,
} from './AdyenPaymentOptionsAndPlaceOrder.gql'
import '@adyen/adyen-web/dist/adyen.css'

/** It sets the selected payment method on the cart. */
export function HppOptions(props: PaymentOptionsProps) {
  const { code, step, child: brandCode } = props
  const [cartId, setCartId] = useState<string | undefined>()
  const [orderNumber, setOrderNumber] = useState<string | undefined>()
  const [adyenAdditionalAction, setAdyenAdditionalAction] = useState<PaymentAction | undefined>()
  const [adyenError, setAdyenError] = useState<ReactElement | undefined>()
  const paymentContainer = useRef<HTMLDivElement | undefined>()
  const adyenComponent = useRef<adyenComponentState>({
    state: undefined,
    isValid: true,
    isAllowSubmit: true,
  })

  const conf = useAdyenPaymentMethod(brandCode)

  const [, lock] = useAdyenCartLock()
  const { selectedMethod, onSuccess } = usePaymentMethodContext()
  const { push } = useRouter()

  function scrollToPaymentComponent() {
    paymentContainer.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  /**
   * In the this folder you'll also find a PaymentMethodOptionsNoop.graphql document that is
   * imported here and used as the basis for the form below.
   */
  const form = useFormGqlMutationCart<
    AdyenPaymentOptionsAndPlaceOrderMutation,
    AdyenPaymentOptionsAndPlaceOrderMutationVariables & { issuer?: string }
  >(AdyenPaymentOptionsAndPlaceOrderDocument, {
    onBeforeSubmit: (vars) => {
      if (!adyenComponent.current.isValid) {
        setAdyenError(<Trans id='Please fill in the payment form with correct information.' />)
        scrollToPaymentComponent()
        throw new Error('Payment form filled in incorrectly.')
      }

      if (brandCode === 'scheme' && adyenComponent.current.state) {
        return {
          ...vars,
          stateData: JSON.stringify(adyenComponent.current.state),
          brandCode: adyenComponent.current?.state.paymentMethod.brand || '',
          paymentMethodCode: 'adyen_cc',
        }
      }

      return {
        ...vars,
        stateData: adyenComponent.current.state
          ? JSON.stringify(adyenComponent.current.state)
          : JSON.stringify({
              paymentMethod: { type: brandCode, issuer: vars.issuer },
              clientStateDataIndicator: true,
            }),
        brandCode,
        paymentMethodCode: 'adyen_hpp',
      }
    },
    onComplete: async (result) => {
      const merchantReference = result.data?.placeOrder?.order.order_number
      const cartIdResult = result.data?.setPaymentMethodOnCart?.cart.id
      const action = result?.data?.placeOrder?.order.adyen_payment_status?.action
      const isFinal = result?.data?.placeOrder?.order.adyen_payment_status?.isFinal
      const resultCode = result?.data?.placeOrder?.order.adyen_payment_status?.resultCode

      setCartId(cartIdResult)
      setOrderNumber(merchantReference)
      if (isFinal && resultCode && merchantReference) {
        if (resultCode && adyenSuccessStatuses.includes(resultCode)) {
          await onSuccess(merchantReference)
        } else {
          setAdyenError(
            <Trans id='The payment is refused, please try again or select a different payment method.' />,
          )
          throw new Error('Payment refused, try again.')
        }
      } else {
        if (result.errors || !merchantReference || !selectedMethod?.code || !action) return

        const actionParsed = JSON.parse(action)
        if (actionParsed.type === 'redirect' && typeof actionParsed.url === 'string') {
          await lock({ method: selectedMethod.code, adyen: '1', merchantReference })
          await push(actionParsed.url as string)
        } else {
          setAdyenAdditionalAction(actionParsed)
          scrollToPaymentComponent()
          throw new Error('Additional action required')
        }
      }
    },
  })

  const { handleSubmit, muiRegister, formState, required } = form

  const submit = handleSubmit(() => {})

  const key = `PaymentMethodOptions_${code}${brandCode}`
  useFormPersist({ form, name: key, persist: ['issuer'], storage: 'localStorage' })

  const valid = useFormValidFields(form, required)

  /** To use an external Pay button we register the current form to be handled there as well. */
  const { isValid } = useFormCompose({ form, step, submit, key })
  adyenComponent.current.isAllowSubmit = isValid

  useAdyenCreateOnSiteCheckout({
    brandCode,
    cartId,
    orderNumber,
    paymentContainer,
    adyenComponent,
    adyenAdditionalAction,
    setAdyenAdditionalAction,
    adyenError,
    setAdyenError,
    onSuccess,
    submit,
  })

  if (!conf?.issuers?.length)
    return (
      <>
        <form onSubmit={submit} noValidate />
        <Box ref={paymentContainer} id='adyenPaymentContainer' />
        <ErrorSnackbar
          open={!!adyenError}
          onClose={() => {
            setAdyenError(undefined)
          }}
        >
          {adyenError}
        </ErrorSnackbar>
      </>
    )

  /**
   * This is the form that the user can fill in. In this case we don't wat the user to fill in
   * anything.
   */
  return (
    <form key={key} onSubmit={submit} noValidate>
      {conf?.issuers && (
        <FormRow>
          <TextFieldElement
            defaultValue=''
            variant='outlined'
            color='secondary'
            select
            SelectProps={{ native: true, displayEmpty: true }}
            error={formState.isSubmitted && !!formState.errors.issuer}
            helperText={formState.isSubmitted && formState.errors.issuer?.message}
            label={brandCode === 'ideal' ? 'Select your bank' : conf?.name}
            required
            {...muiRegister('issuer', {
              required: { value: true, message: 'Please provide an issuer' },
            })}
            InputProps={{ endAdornment: <InputCheckmark show={valid.issuer} select /> }}
          >
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <option value='' />
            {conf.issuers.map((issuer) => {
              if (!issuer?.id || !issuer.name) return null

              return (
                <option key={issuer.id} value={issuer.id}>
                  {issuer.name}
                </option>
              )
            })}
          </TextFieldElement>
        </FormRow>
      )}
    </form>
  )
}
