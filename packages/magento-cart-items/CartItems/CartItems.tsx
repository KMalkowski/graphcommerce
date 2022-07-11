import { useCartQuery } from '@graphcommerce/magento-cart'
import { RenderType, TypeRenderer } from '@graphcommerce/next-ui'
import React from 'react'
import { CartItemsFragment } from '../Api/CartItems.gql'
import { CartItemsQueryDocument } from './CartItemsQuery.gql'

export type CartItemRenderer = TypeRenderer<NonNullable<NonNullable<CartItemsFragment['items']>[0]>>

export type CartProps = { renderer: CartItemRenderer }

export function CartItems(props: CartProps) {
  const { data } = useCartQuery(CartItemsQueryDocument)
  const { renderer } = props

  return (
    <>
      {data?.cart?.items?.map((item) => {
        if (!item?.uid || !data.cart?.id) return null
        return <RenderType key={item.uid} renderer={renderer} {...item} />
      })}
    </>
  )
}
