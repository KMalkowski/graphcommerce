import {
  PaymentMethodContextProviderProps,
  PaymentModule,
} from '@graphcommerce/magento-cart-payment-method'
import { AdyenPaymentButton } from '../components/AdyenPaymentButton/AdyenPaymentButton'
import type { PluginProps } from '@graphcommerce/next-config'
import { AdyenPaymentActionCard } from '../components/AdyenPaymentActionCard/AdyenPaymentActionCard'
import { AdyenPaymentHandler } from '../components/AdyenPaymentHandler/AdyenPaymentHandler'
import { HppOptions } from '../components/AdyenPaymentOptionsAndPlaceOrder/AdyenPaymentOptionsAndPlaceOrder'
import { adyenHppExpandMethods } from '../hooks/adyenHppExpandMethods'

export const adyen_hpp: PaymentModule = {
  PaymentOptions: HppOptions,
  PaymentPlaceOrder: () => null,
  PaymentHandler: AdyenPaymentHandler,
  PaymentActionCard: AdyenPaymentActionCard,
  expandMethods: adyenHppExpandMethods,
  PaymentButton: AdyenPaymentButton,
}

export const component = 'PaymentMethodContextProvider'
export const exported = '@graphcommerce/magento-cart-payment-method'

function AddAdyenMethods(props: PluginProps<PaymentMethodContextProviderProps>) {
  const { modules, Prev, ...rest } = props
  return <Prev {...rest} modules={{ ...modules, adyen_hpp }} />
}

export const Plugin = AddAdyenMethods
