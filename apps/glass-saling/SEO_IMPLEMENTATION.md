# SEO Implementation Guide

This document outlines the SEO improvements made to the website and how to
configure them.

## ✅ Completed SEO Features

### 1. **Enhanced Metadata System**

- Comprehensive metadata generation utility (`src/lib/seo.ts`)
- Open Graph tags for social media sharing
- Twitter Card support
- Canonical URLs for all pages
- Dynamic metadata based on settings from CMS

### 2. **Structured Data (JSON-LD)**

- Organization schema markup
- LocalBusiness schema markup
- WebPage schema for individual pages
- Automatically injected into pages

### 3. **Dynamic Sitemap**

- Automatic sitemap generation (`src/app/sitemap.ts`)
- Includes all static pages
- Dynamically includes categories from the database
- Updates automatically when content changes

### 4. **Improved robots.txt**

- Properly configured for search engines
- References sitemap location
- Blocks admin and API routes

### 5. **Page-Specific SEO**

- Home page metadata
- About Us page metadata
- Contact Us page metadata
- Gallery page metadata
- Services/Categories page metadata
- Dynamic category detail page metadata

## 🔧 Configuration Required

### 1. Set Environment Variable

Add to your `.env.local` or production environment:

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Replace `https://yourdomain.com` with your actual domain (e.g.,
`https://crestal-glass.com`).

### 2. Update robots.txt

Edit `public/robots.txt` and replace:

```
Sitemap: https://yourdomain.com/sitemap.xml
```

With your actual domain:

```
Sitemap: https://yourdomain.com/sitemap.xml
```

### 3. Configure SEO Settings in CMS

In your admin CMS, configure the following SEO settings:

- **SEO Meta Title**: Main site title (e.g., "Crestal - Premium Glass
  Solutions")
- **SEO Meta Description**: Main site description
- **SEO Keywords**: Comma-separated keywords
- **Meta Image**: Open Graph image (recommended: 1200x630px)

These settings will be used across all pages as defaults, with page-specific
metadata taking precedence where applicable.

## 📊 SEO Checklist

### Technical SEO

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Mobile-friendly (already implemented)
- ✅ Fast loading (optimize images, use Next.js Image component)

### Content SEO

- ✅ Unique page titles
- ✅ Unique meta descriptions
- ✅ Semantic HTML structure
- ✅ Alt text for images (ensure all images have alt text)
- ⚠️ Internal linking (review and improve)
- ⚠️ External linking (add relevant external links)

### On-Page SEO

- ✅ H1 tags on each page
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Descriptive URLs
- ⚠️ Image optimization (ensure all images are optimized)
- ⚠️ Content quality and keyword usage

## 🚀 Next Steps for Better SEO

### 1. Content Optimization

- Ensure all images have descriptive alt text
- Add more internal links between related pages
- Create blog/content section for fresh content
- Add FAQ sections to relevant pages

### 2. Performance Optimization

- Optimize images (use WebP format, proper sizing)
- Implement lazy loading for below-the-fold content
- Minimize JavaScript bundle size
- Use Next.js Image component (already in use)

### 3. Local SEO (if applicable)

- Add Google Business Profile
- Add location-specific content
- Get local citations
- Encourage customer reviews

### 4. Analytics & Monitoring

- Set up Google Search Console
- Set up Google Analytics
- Monitor Core Web Vitals
- Track keyword rankings

### 5. Additional Features

- Add breadcrumbs with structured data
- Create FAQ page with FAQ schema
- Add review schema if you have testimonials
- Implement hreflang tags if multi-language

## 📝 Testing Your SEO

### 1. Test Metadata

Use these tools to verify your metadata:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 2. Test Structured Data

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### 3. Test Sitemap

- Visit `https://yourdomain.com/sitemap.xml`
- Submit to Google Search Console
- Submit to Bing Webmaster Tools

### 4. Test robots.txt

- Visit `https://yourdomain.com/robots.txt`
- Use
  [robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)

## 🔍 Monitoring & Maintenance

### Regular Tasks

1. **Weekly**: Check Google Search Console for errors
2. **Monthly**: Review and update meta descriptions
3. **Quarterly**: Update sitemap if new pages added
4. **Quarterly**: Review and optimize content

### Key Metrics to Track

- Organic search traffic
- Keyword rankings
- Page load speed
- Core Web Vitals
- Click-through rates (CTR)
- Bounce rate

## 📚 Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

## 🐛 Troubleshooting

### Metadata not showing?

- Clear browser cache
- Check if settings are properly fetched from API
- Verify environment variable is set correctly

### Sitemap not generating?

- Check if categories API is working
- Verify database connection
- Check server logs for errors

### Structured data errors?

- Validate JSON-LD syntax
- Check required fields are present
- Use Google Rich Results Test

## 📞 Support

If you encounter any issues with the SEO implementation, check:

1. Environment variables are set correctly
2. API endpoints are accessible
3. Settings are configured in CMS
4. No TypeScript/compilation errors

---

**Last Updated**: $(date) **Version**: 1.0.0
