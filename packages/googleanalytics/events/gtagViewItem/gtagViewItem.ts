import { GtagViewItemFragment } from './GtagViewItem.gql'

export function gtagViewItem<C extends GtagViewItemFragment>(item?: C | null) {
  if (!item) return

  globalThis.gtag?.('event', 'view_item', {
    currency: item.price_range.minimum_price.final_price.currency,
    value: item.price_range.minimum_price.final_price.value,
    items: [
      {
        item_id: item.sku,
        item_name: item.name,
        discount: item.price_range.minimum_price.discount?.amount_off,
        price: item.price_range.minimum_price.final_price.value,
        quantity: 1,
      },
    ],
  })
}
