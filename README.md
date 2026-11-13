# RavensOrbit Digital website

Built with Eleventy, hosted on Netlify.

## Publish a Journal post
1. Go to https://ravensorbit.com/admin and log in.
2. Click **New Journal post**, fill in the fields, then **Publish**. The site updates in about a minute.

## Where things live
- Page copy: `src/*.njk` (home is `src/index.njk`)
- Styles: `src/assets/site.css` · Scripts: `src/assets/site.js`
- Site-wide settings (domain, email, **social links**): `src/_data/site.js` — edit on GitHub, commit, and Netlify republishes automatically
- Journal posts: `src/journal/posts/` (managed by the editor at /admin)
- Form submissions: Netlify → Forms (email notifications go to the address set there)
