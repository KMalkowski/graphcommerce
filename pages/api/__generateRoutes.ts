import { Rewrite, Header, Redirect } from 'next/dist/lib/check-custom-routes'
import { NextApiResponse, NextApiRequest } from 'next'
import { promises as fs } from 'fs'
import { join } from 'path'

type Manifest = {
  version: number
  pages404: boolean
  basePath: string
  redirects: Redirect[]
  rewrites: Rewrite[]
  headers: Header[]
  dynamicRoutes: {
    page: string
    regex: string
  }[]
  dataRoutes: {
    page: string
    dataRouteRegex: string
  }[]
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    // todo(paales) actually extract the routes instead of using a build artifact
    const manifest: Manifest = (await import('lib/routes-manifest.json')).default

    const pages = manifest.dataRoutes.map(({ page }) => ({ page }))
    const bla = pages
      .map(({ page }): [string, string] => {
        const dynamicRoute = manifest.dynamicRoutes.find((dyn) => dyn.page === page)
        return dynamicRoute ? [dynamicRoute.regex, dynamicRoute.page] : [page, page]
      })
      .sort(([, a], [, b]) => (a < b ? 1 : -1))

    await fs.writeFile(join(process.cwd(), 'components/Link/routes.json'), JSON.stringify(bla))

    res.status(200).end()
  } catch (error) {
    res.status(500).end()
    console.error(error)
  }
}