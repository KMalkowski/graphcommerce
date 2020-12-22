// Do not edit this file: autogenerated by graphql-code-generator
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as Types from '@reachdigital/magento-graphql'

export const PickupLocationFragmentDoc: DocumentNode<PickupLocationFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PickupLocation' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PickupLocation' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'city' } },
          { kind: 'Field', name: { kind: 'Name', value: 'contact_name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'country_id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'email' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fax' } },
          { kind: 'Field', name: { kind: 'Name', value: 'latitude' } },
          { kind: 'Field', name: { kind: 'Name', value: 'longitude' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
          { kind: 'Field', name: { kind: 'Name', value: 'postcode' } },
          { kind: 'Field', name: { kind: 'Name', value: 'region' } },
          { kind: 'Field', name: { kind: 'Name', value: 'region_id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'street' } },
        ],
      },
    },
  ],
}
export type PickupLocationFragment = Pick<
  Types.PickupLocation,
  | 'city'
  | 'contact_name'
  | 'country_id'
  | 'description'
  | 'email'
  | 'fax'
  | 'latitude'
  | 'longitude'
  | 'name'
  | 'phone'
  | 'postcode'
  | 'region'
  | 'region_id'
  | 'street'
>