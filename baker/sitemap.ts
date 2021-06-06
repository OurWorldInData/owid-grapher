import { Post } from "../db/model/Post"
import { Chart } from "../db/model/Chart"
import { BAKED_BASE_URL, BAKED_GRAPHER_URL } from "../settings/serverSettings"
import dayjs from "../clientUtils/dayjs"
import * as db from "../db/db"
import { countries } from "../clientUtils/countries"
import urljoin from "url-join"
import { countryProfileSpecs } from "../site/countryProfileProjects"

interface SitemapUrl {
    loc: string
    lastmod?: string
}

const xmlify = (url: SitemapUrl) => {
    if (url.lastmod)
        return `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
    </url>`

    return `    <url>
        <loc>${url.loc}</loc>
    </url>`
}

export const makeSitemap = async () => {
    const posts = (await db
        .knexTable(Post.table)
        .where({ status: "publish" })
        .select("slug", "updated_at")) as { slug: string; updated_at: Date }[]
    const charts = (await db
        .knexTable(Chart.table)
        .select(db.knexRaw(`updatedAt, config->>"$.slug" AS slug`))
        .whereRaw('config->"$.isPublished" = true')) as {
        updatedAt: Date
        slug: string
    }[]

    let urls = countries.map((c) => ({
        loc: urljoin(BAKED_BASE_URL, "country", c.slug),
    })) as SitemapUrl[]

    urls = urls
        .concat(
            ...countryProfileSpecs.map((spec) => {
                return countries.map((c) => ({
                    loc: urljoin(BAKED_BASE_URL, spec.rootPath, c.slug),
                }))
            })
        )
        .concat(
            posts.map((p) => ({
                loc: urljoin(BAKED_BASE_URL, p.slug),
                lastmod: dayjs(p.updated_at).format("YYYY-MM-DD"),
            }))
        )
        .concat(
            charts.map((c) => ({
                loc: urljoin(BAKED_GRAPHER_URL, c.slug),
                lastmod: dayjs(c.updatedAt).format("YYYY-MM-DD"),
            }))
        ) as SitemapUrl[]

    const sitemap = `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => xmlify(url)).join("\n")}
</urlset>`

    return sitemap
}
