import { useCartQuery } from '@reachdigital/magento-cart'
import AnimatedRow from '@reachdigital/next-ui/AnimatedRow'
import RenderType, { TypeRenderer } from '@reachdigital/next-ui/RenderType'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { CartItemsFragment } from '../Api/CartItems.gql'
import { CartItemsQueryDocument } from './CartItemsQuery.gql'

export type CartItemRenderer = TypeRenderer<NonNullable<NonNullable<CartItemsFragment['items']>[0]>>

export type CartProps = { renderer: CartItemRenderer }

export default function CartItems(props: CartProps) {
  const { data } = useCartQuery(CartItemsQueryDocument)
  const { renderer } = props

  return (
    <AnimatePresence initial={false}>
      {data?.cart?.items?.map((item) => {
        if (!item?.uid || !data.cart?.id) return null
        return (
          <AnimatedRow key={item.uid}>
            <RenderType renderer={renderer} {...item} />
          </AnimatedRow>
        )
      })}
    </AnimatePresence>
  )
}