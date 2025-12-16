export default function robots() {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
      sitemap: "https://televora.in/sitemap.xml",
    };
  }
  