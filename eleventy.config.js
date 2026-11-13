export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addFilter("head", (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : arr));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readableDate", (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }));
  eleventyConfig.ignores.add("src/journal/posts/.gitkeep");
  return { dir: { input: "src", output: "_site", includes: "_includes", data: "_data" }, templateFormats: ["njk", "md"], htmlTemplateEngine: "njk", markdownTemplateEngine: "njk" };
}
