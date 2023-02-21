import { RemoveItemFromCartProps } from '@graphcommerce/magento-cart-items'
import { PluginProps } from '@graphcommerce/next-config'
import { gtagRemoveFromCart } from '../events/gtagRemoveFromCart/gtagRemoveFromCart'

export const component = 'RemoveItemFromCartFab'
export const exported = '@graphcommerce/magento-cart-items'

/** When a product is added to the Cart, send a Google Analytics event */
function GaAddProductsToCartForm(props: PluginProps<RemoveItemFromCartProps>) {
  const { Prev, onClick, uid, product, quantity, prices } = props

  return (
    <Prev
      {...props}
      onClick={(e) => {
        gtagRemoveFromCart({
          __typename: 'Cart',
          items: [
            {
              uid,
              __typename: 'SimpleCartItem',
              product,
              quantity,
              prices,
            },
          ],
        })
        onClick?.(e)
      }}
    />
  )
}

export const Plugin = GaAddProductsToCartForm
