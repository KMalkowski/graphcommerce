import {
  configToEnvSchema,
  formatAppliedEnv,
  mergeEnvIntoConfig,
} from '../../../src/config/utils/mergeEnvIntoConfig'
import { GraphCommerceConfig, GraphCommerceConfigSchema } from '../../../src/generated/config'
import { removeColor } from './rewriteLegancyEnv'

const env = {
  GC_ADVANCED_FILTERS: '0',
  GC_CUSTOMER_REQUIRE_EMAIL_CONFIRMATION: 'false',
  GC_DEMO_MODE: '1',
  GC_SINGLE_PRODUCT_ROUTE: '1',
  GC_I18N_0_LOCALE: 'en',
  GC_I18N_0_DEFAULT_LOCALE: 'true',
  GC_I18N_0_HYGRAPH_LOCALES_0: 'en',
  GC_I18N_0_MAGENTO_STORE_CODE: 'en_us',
  GC_I18N_1_LOCALE: 'de',
  GC_I18N_1_HYGRAPH_LOCALES_0: 'de',
  GC_I18N_1_MAGENTO_STORE_CODE: 'de_de',
  GC_I18N: `[{"locale": "en", "defaultLocale": true, "hygraphLocales": ["en"], "magentoStoreCode": "en_us"}]`,
}

it('traverses a schema and returns a list of env variables that match', () => {
  const [envSchema] = configToEnvSchema(GraphCommerceConfigSchema())
  expect(Object.keys(envSchema.shape)).toMatchSnapshot()
})

it('parses an env config object', () => {
  const [envSchema] = configToEnvSchema(GraphCommerceConfigSchema())
  const result = envSchema.parse(env)
  expect(result).toMatchSnapshot()
})

it('correctly validates if a value is JSON', () => {
  const [envSchema] = configToEnvSchema(GraphCommerceConfigSchema())
  const result = envSchema.safeParse({ ...env, GC_I18N: 'not json', GC_I18N_0: 'not json' })
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(result.error.errors).toMatchInlineSnapshot(`
      [
        {
          "code": "custom",
          "message": "Invalid JSON",
          "path": [
            "GC_I18N",
          ],
        },
        {
          "code": "custom",
          "message": "Invalid JSON",
          "path": [
            "GC_I18N_0",
          ],
        },
      ]
    `)
  }
})

it('converts an env schema to a config schema', () => {
  const configFile: GraphCommerceConfig = {
    i18n: [{ locale: 'en', hygraphLocales: ['en'], magentoStoreCode: 'en_us' }],
    customerRequireEmailConfirmation: false,
    singleProductRoute: true,
    productFiltersPro: false,
    canonicalBaseUrl: 'https://example.com',
    hygraphEndpoint: 'https://example.com',
    magentoEndpoint: 'https://example.com',
    previewSecret: 'secret',
  }

  const environmentVariables = {
    GC_ADVANCED_FILTERS: '1',
    GC_I18N: `[{"defaultLocale": true }]`,
    GC_I18N_0_LOCALE: 'de',
    GC_SINGLE_PRODUCT_ROUTE: '1',
  }

  const [mergedConfig, applied] = mergeEnvIntoConfig(
    GraphCommerceConfigSchema(),
    configFile,
    environmentVariables,
  )

  expect(removeColor(formatAppliedEnv(applied))).toMatchInlineSnapshot(`
    "info   - Loaded GraphCommerce env variables
     ~ GC_ADVANCED_FILTERS='1' => productFiltersPro: false => true
     + GC_I18N='[{"defaultLocale": true }]' => i18n: [{"defaultLocale":true}]
     ~ GC_I18N_0_LOCALE='de' => i18n.[0].locale: "en" => "de"
     = GC_SINGLE_PRODUCT_ROUTE='1' => singleProductRoute: (ignored, no change/wrong format)"
  `)

  // Validate the resulting configuration
  const parsed = GraphCommerceConfigSchema().safeParse(mergedConfig)

  expect(parsed.success).toBe(true)

  if (parsed.success) {
    expect(parsed.data.productFiltersPro).toBe(true)
    expect(parsed.data.i18n[0].defaultLocale).toBe(true)
    expect(parsed.data.i18n[0].locale).toBe('de')
    expect(parsed.data.singleProductRoute).toBe(true)
  }
})
