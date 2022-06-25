//ONE HELL OF AN ELEVENTY CONFIG. CALLOUT TO TEMPER TEMPER AND GOOGLE FOR THE FILTERS IN THE _11TY FOLDER.
const { DateTime } = require("luxon");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const hasha = require("hasha");
const touch = require("touch");
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const execFile = promisify(require("child_process").execFile);
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const localImages = require("eleventy-plugin-local-images");
const CleanCSS = require("clean-css");
// const GA_ID = require(".src/site/_data/metadata.json").googleAnalyticsId;
const embeds = require("eleventy-plugin-embed-everything");
module.exports = eleventyConfig => {
    eleventyConfig.setUseGitIgnore(false);

  /* Date filter */
  eleventyConfig.addFilter("date", require("./lib/filters/dates.js") );
    eleventyConfig.addFilter("isoDate", require("./lib/filters/isoDate.js"));
    //dev env var
    require('dotenv').config()
    const { ELEVENTY_ENV } = process.env
    
    
  /* Markdown Plugins */
  var uslug = require('uslug');
  var uslugify = s => uslug(s);
  var anchor = require('markdown-it-anchor');
  var markdownIt = require("markdown-it");
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    typographer: true
  }).use(anchor, {slugify: uslugify, tabIndex: false}));
  var mdIntro = markdownIt({
    typographer: true
  });
  eleventyConfig.addFilter("markdown", markdown => mdIntro.render(markdown));

  const slugify = require("slugify");
  eleventyConfig.addFilter("slugify", str => {
    return slugify(str, {
      customReplacements: [
        ['+', ' plus '],
        ['@', ' at ']
      ],
      remove: /[*~.,–—()'"‘’“”!?:;]/g,
      lower: true
    });
  });
    //_11ty config files courtasy of Google.
eleventyConfig.addPlugin(require("./_11ty/img-dim.js"));
  eleventyConfig.addPlugin(require("./_11ty/json-ld.js"));
  eleventyConfig.addPlugin(require("./_11ty/optimize-html.js"));
    // We need to rebuild on CSS change to inline it.
      eleventyConfig.addWatchTarget("./js/");
    eleventyConfig.addWatchTarget("./css/");
    eleventyConfig.addPlugin(embeds);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addNunjucksAsyncFilter(
    "addHash",
    function (absolutePath, callback) {
      readFile(path.join(".", absolutePath), {
        encoding: "utf-8",
      })
        .then((content) => {
          return hasha.async(content);
        })
        .then((hash) => {
          callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
        })
        .catch((error) => {
          callback(
            new Error(`Failed to addHash to '${absolutePath}': ${error}`)
          );
        });
    }
  );

  async function lastModifiedDate(filename) {
    try {
      const { stdout } = await execFile("git", [
        "log",
        "-1",
        "--format=%cd",
        filename,
      ]);
      return new Date(stdout);
    } catch (e) {
      console.error(e.message);
      // Fallback to stat if git isn't working.
      const stats = await stat(filename);
      return stats.mtime; // Date
    }
  }
  // Cache the lastModifiedDate call because shelling out to git is expensive.
  // This means the lastModifiedDate will never change per single eleventy invocation.
  const lastModifiedDateCache = new Map();
  eleventyConfig.addNunjucksAsyncFilter(
    "lastModifiedDate",
    function (filename, callback) {
      const call = (result) => {
        result.then((date) => callback(null, date));
        result.catch((error) => callback(error));
      };
      const cached = lastModifiedDateCache.get(filename);
      if (cached) {
        return call(cached);
      }
      const promise = lastModifiedDate(filename);
      lastModifiedDateCache.set(filename, promise);
      call(promise);
    }
  );

  eleventyConfig.addFilter("encodeURIComponent", function (str) {
    return encodeURIComponent(str);
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
  /* Twitter URL from Twitter handle */
  eleventyConfig.addFilter("twitterLink", str => "https://twitter.com/" + str.replace("@", ""));

  /* Code syntax highlighting */
  const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["njk", "md"]
  });
//RSS
    const pluginRss = require("@11ty/eleventy-plugin-rss");
    eleventyConfig.addPlugin(pluginRss);
    
  /* OPTIONAL TAGS */
  eleventyConfig.addFilter("tags", collection => {
    const notRendered = ['all', 'post', 'resource', 'testimonial', 'case-study', 'skills'];
    return Object.keys(collection)
      .filter(d => !notRendered.includes(d))
      .sort();
  });

  /* List tags belonging to a page */
  eleventyConfig.addFilter("tagsOnPage", tags => {
    const notRendered = ['all', 'post', 'resource', 'testimonial', 'case-study', 'skills'];
    return tags
      .filter(d => !notRendered.includes(d))
      .sort();
  });
    //filter by year
    eleventyConfig.addFilter("ordered", collection => {
    return collection.sort((a, b) => a.data.order - b.data.order);
    });
    eleventyConfig.addFilter("filterByYear", (arr, year) => {
    return arr.filter(item => {
      return item.date.getFullYear() == year;
    })
    });
    //promote posts
    eleventyConfig.addFilter("promote", (arr, year) => {
    return arr.filter(item => {
      return item.data.promote == true;
    })
    });
    //filter by tag
    eleventyConfig.addFilter("filterByTag", (arr, tag) => {
    return arr.filter(item => {
      return item.data.tags.includes(tag);
    })
    }
    );
    //footer year
      eleventyConfig.addFilter("getCurrentYear", () => new Date().getFullYear());
 /* Get current date */
  eleventyConfig.addFilter("getCurrentDate", () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return yyyy + '/' + mm + '/' + dd;
  });
    
    const fs = require("fs");
  eleventyConfig.setBrowserSyncConfig({
    port: 3000,
    watch: true,
    server: {
      baseDir: "./dist/",
      serveStaticOptions: {
        extensions: ["html"]
      }
    },
    open: false,
    notify: false,
    callbacks: {
      ready: function(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('dist/404.html');
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: "src/site",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats : ["njk", "html", "md", "txt", "webmanifest", "ico"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk"
  };
};