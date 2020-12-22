// Do not edit this file: autogenerated by graphql-code-generator
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as Types from '@reachdigital/magento-graphql'

import {
  CustomizableOption_CustomizableAreaOption_Fragment,
  CustomizableOption_CustomizableDateOption_Fragment,
  CustomizableOption_CustomizableDropDownOption_Fragment,
  CustomizableOption_CustomizableMultipleOption_Fragment,
  CustomizableOption_CustomizableFieldOption_Fragment,
  CustomizableOption_CustomizableFileOption_Fragment,
  CustomizableOption_CustomizableRadioOption_Fragment,
  CustomizableOption_CustomizableCheckboxOption_Fragment,
  CustomizableOptionFragmentDoc,
} from './CustomizableOption.gql'

export const CustomizableMultipleOptionFragmentDoc: DocumentNode<
  CustomizableMultipleOptionFragment,
  unknown
> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'CustomizableMultipleOption' },
      typeCondition: {
        kind: 'NamedType',
        name: { kind: 'Name', value: 'CustomizableMultipleOption' },
      },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'FragmentSpread', name: { kind: 'Name', value: 'CustomizableOption' } },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'multipleValue' },
            name: { kind: 'Name', value: 'value' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'option_type_id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price_type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sku' } },
                { kind: 'Field', name: { kind: 'Name', value: 'sort_order' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'uid' } },
              ],
            },
          },
        ],
      },
    },
    ...CustomizableOptionFragmentDoc.definitions,
  ],
}
export type CustomizableMultipleOptionFragment = {
  multipleValue?: Types.Maybe<
    Array<
      Types.Maybe<
        Pick<
          Types.CustomizableMultipleValue,
          'option_type_id' | 'price' | 'price_type' | 'sku' | 'sort_order' | 'title' | 'uid'
        >
      >
    >
  >
} & CustomizableOption_CustomizableMultipleOption_Fragment