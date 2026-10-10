# Rushh. Power your pace

Electronics store (smartphones, laptops, headphones, earbuds) built with Next.js 14 (App Router), TypeScript and Tailwind CSS. Light and dark themes, search, filters, sorting, wishlist, bag, coupon, checkout, accounts and order history.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Images
`public/products/<slug>.jpg` holds one photo per product (cropped from the Lovable design) and `public/hero/` the hero slides. To swap one, drop in a file with the same name (slugs are in `src/data/products.json`).

## Data
`data/sales.csv` is the anonymised Kaggle sales file (no names or prices). `scripts/build_catalog.py` pairs each product with one CSV row and uses its 12 monthly outcomes for units sold, demand chart, rating and stock. Names, tags and prices come from the Lovable design; prices marked `*` in the script were hidden in the screenshots and are estimates. Edit the list at the top of the script, then run `npm run catalog`.

## Demo behaviour
Cart, wishlist, account and orders are stored in the browser (localStorage). Payment is simulated. Coupon: `RUSHH10` (10% off). Next step for a real store: Supabase for auth and orders, Razorpay for payments.

## Deploy
```bash
git init && git add . && git commit -m "Rushh store"
git branch -M main
git remote add origin https://github.com/<you>/rushh-store.git
git push -u origin main
```
Then on vercel.com choose **Add New, Project**, import the repo and click **Deploy**. No environment variables are needed.
