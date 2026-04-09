# Fleur en Fleur Website Starter

This is a responsive static website for Fleur en Fleur's flower order business.

## Files
- `index.html` - main website page
- `styles.css` - design and layout
- `script.js` - mobile menu and WhatsApp order form behavior
- `assets/` - catalog images extracted from the 2026 collection PDF

## What the website includes
- Hero section for the brand
- "By Occasions" section
- Signature collections with catalog-based pricing ranges
- Flower customization guide
- Step-by-step order process
- WhatsApp-ready custom order form
- Contact section

## Important setup note
The WhatsApp button currently uses this number format in `script.js`:

```js
const whatsappNumber = '6289609338889';
```

If you want to change the destination number or format, edit that line.

## How to open locally
Double click `index.html`, or upload the whole folder to your hosting.

## Easy ways to publish
### GitHub Pages
1. Upload all files to a GitHub repository.
2. Go to repository Settings > Pages.
3. Set the branch to `main` and folder to `/root`.
4. Save and wait for the site to publish.

### Hostinger
1. Open File Manager in Hostinger.
2. Upload all website files into `public_html`.
3. Keep the folder structure the same.
4. Make sure `index.html` stays in the main folder.

## Recommended next improvements
- Add your own product photos instead of catalog page images if you want a cleaner shop look.
- Add a testimonials section.
- Add delivery area and FAQ.
- Add Bahasa Indonesia version.
