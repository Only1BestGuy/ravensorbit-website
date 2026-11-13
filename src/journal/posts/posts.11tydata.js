export default {
  layout: "post.njk",
  tags: ["post"],
  permalink: (data) => `/journal/${data.page.fileSlug}/`,
  eleventyComputed: {
    articleSchema: (data) => ({
      "@context": "https://schema.org", "@type": "BlogPosting",
      headline: data.title, description: data.description,
      datePublished: data.page.date, author: { "@type": data.author ? "Person" : "Organization", name: data.author || "RavensOrbit Digital" },
      publisher: { "@type": "Organization", name: "RavensOrbit Digital", logo: { "@type": "ImageObject", url: data.site.url + "/assets/img/logo-color.png" } },
      image: data.site.url + (data.cover || "/assets/img/og-image.png"),
      mainEntityOfPage: data.site.url + data.page.url
    }),
    ogImage: (data) => data.cover || "/assets/img/og-image.png"
  }
};
