import { LinkOrButton } from '@graphcommerce/next-ui'
import { PaymentButtonProps } from '@graphcommerce/magento-cart-payment-method/Api/PaymentMethod'
import { Trans } from '@lingui/react'

export function AdyenPaymentButton(props: PaymentButtonProps) {
  const methodsWithSeparatePayButton = ['googlepay', 'applepay']
  const isDisabled = methodsWithSeparatePayButton.includes(props?.child)

  return (
    <LinkOrButton {...props.buttonProps} disabled={isDisabled}>
      <Trans id='Pay' />
    </LinkOrButton>
  )
}
