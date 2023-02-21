import { CartStartCheckoutLinkOrButtonProps } from '@graphcommerce/magento-cart'
import { PluginProps } from '@graphcommerce/next-config'
import { useEffect } from 'react'
import { gtagBeginCheckout } from '../events/gtagBeginCheckout/gtagBeginCheckout'
import { gtagViewCart } from '../events/gtagViewCart/gtagViewCart'

export const component = 'CartStartCheckoutLinkOrButton'
export const exported = '@graphcommerce/magento-cart'

export function GaCartStartCheckoutLinkOrButton(
  props: PluginProps<CartStartCheckoutLinkOrButtonProps>,
) {
  const { Prev, onStart, ...rest } = props

  useEffect(() => gtagViewCart({
    items: rest.items,
    prices: rest.prices
  }), [])

  return (
    <Prev
      {...rest}
      onStart={(e, cart) => {
        gtagBeginCheckout(cart)
        return onStart?.(e, cart)
      }}
    />
  )
}

export const Plugin = GaCartStartCheckoutLinkOrButton
