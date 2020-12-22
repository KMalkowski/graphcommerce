// Do not edit this file: autogenerated by graphql-code-generator
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as Types from '@reachdigital/magento-graphql'

import { MoneyFragment, MoneyFragmentDoc } from '../../magento-store/Money.gql'

export const AvailableShippingMethodFragmentDoc: DocumentNode<
  AvailableShippingMethodFragment,
  unknown
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AvailableShippingMethod' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'AvailableShippingMethod' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'amount' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Money' } }],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'available' } },
          { kind: 'Field', name: { kind: 'Name', value: 'carrier_code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'carrier_title' } },
          { kind: 'Field', name: { kind: 'Name', value: 'error_message' } },
          { kind: 'Field', name: { kind: 'Name', value: 'method_code' } },
          { kind: 'Field', name: { kind: 'Name', value: 'method_title' } },
        ],
      },
    },
    ...MoneyFragmentDoc.definitions,
  ],
}
export type AvailableShippingMethodFragment = Pick<
  Types.AvailableShippingMethod,
  'available' | 'carrier_code' | 'carrier_title' | 'error_message' | 'method_code' | 'method_title'
> & { amount: MoneyFragment }