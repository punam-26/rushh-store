"""Builds src/data/products.json: Rushh catalog + demand stats derived from data/sales.csv.
The Kaggle CSV is anonymised (no names/prices), so each product is paired with one CSV row
(deterministic, seed 42) and its 12 monthly outcomes drive units sold, trend, rating and stock.
Run: python scripts/build_catalog.py"""
import json, random, re
import pandas as pd

C = [  # category, brand, name, tag, price, blurb  (from the Lovable design; * = price not visible in screenshots, estimated)
 ("smartphones","Apple","iPhone 15 Pro","Popular pick",129900,"256 GB · 6.1-inch display · A17 Pro"),
 ("smartphones","Samsung","Galaxy S24 Ultra","Flagship",119999,"512 GB · 6.8-inch display · S Pen"),
 ("smartphones","Google","Pixel 8 Pro","Camera first",99999,"128 GB · 6.7-inch display · Tensor G3"),
 ("smartphones","Samsung","Galaxy A54","Best value",38999,"128 GB · 6.4-inch display · 5000 mAh"),
 ("smartphones","Nothing","Phone 2a","Design icon",23999,"128 GB · 6.7-inch display · Glyph"),  # *
 ("smartphones","Apple","iPhone 15","Everyday pick",69900,"128 GB · 6.1-inch display · A16"),  # *
 ("smartphones","Google","Pixel 8a","Smart buy",52999,"128 GB · 6.1-inch display · 7 years of updates"),  # *
 ("smartphones","OnePlus","OnePlus 12","Fast charge",64999,"256 GB · 6.7-inch display · 80W charging"),  # *
 ("laptops","Apple","MacBook Air M3","New arrival",114900,"13-inch · 16 GB memory · 512 GB SSD"),
 ("laptops","Apple","MacBook Pro 14","Power move",199900,"14-inch · M3 Pro · 18 GB memory"),
 ("laptops","Lenovo","ThinkPad X1 Carbon","Workhorse",169990,"14-inch · Core Ultra 7 · 16 GB memory"),
 ("laptops","Dell","Dell XPS 13","Editor's pick",139990,"13.4-inch · Core Ultra 7 · 16 GB memory"),
 ("laptops","ASUS","ROG Zephyrus G14","Gaming ready",179990,"14-inch · Ryzen 9 · RTX 4060"),
 ("laptops","Microsoft","Surface Laptop 6","Everyday essential",119999,"13.5-inch · Core Ultra 5 · 16 GB memory"),
 ("laptops","Acer","Swift Go 14","Best value",74990,"14-inch · Ryzen 7 · 512 GB SSD"),  # *
 ("laptops","Samsung","Galaxy Book4 Pro","Thin & light",149990,"14-inch · Core Ultra 7 · AMOLED display"),
 ("headphones","Sony","WH-1000XM5","Editor's pick",29990,"Noise cancelling · 30-hour battery"),
 ("headphones","Bose","QuietComfort Ultra","Silence mode",32900,"Immersive audio · 24-hour battery"),
 ("headphones","Apple","AirPods Max","Signature",59900,"Spatial audio · USB-C charging"),
 ("headphones","Sennheiser","Sennheiser Momentum 4","Sound purist",29990,"60-hour battery · Adaptive ANC"),
 ("headphones","Beats","Solo 4","Street classic",29999,"Lossless audio · 50-hour battery"),
 ("headphones","JBL","JBL Tune 770NC","Best value",8999,"Adaptive ANC · 70-hour battery"),
 ("headphones","Marshall","Marshall Major V","Retro icon",14999,"Classic design · Wireless charging"),  # *
 ("headphones","Sennheiser","HD 560S","Studio grade",24999,"Open-back · Reference tuning"),
 ("earbuds","Apple","AirPods Pro","Everyday essential",24900,"2nd generation · USB-C · Spatial audio"),
 ("earbuds","Samsung","Galaxy Buds3 Pro","New arrival",19999,"Blade design · 24-bit audio"),
 ("earbuds","Sony","WF-1000XM5","Top noise cancel",24990,"Industry-leading ANC · 36-hour total"),
 ("earbuds","Google","Pixel Buds Pro 2","AI assist",22999,"Gemini built-in · Silent Seal 2.0"),
 ("earbuds","Bose","Bose QuietComfort Earbuds","Silence mode",26900,"Deep ANC · CustomTune sound"),
 ("earbuds","Nothing","Nothing Ear","Design icon",7999,"Transparent design · LDAC audio"),
 ("earbuds","JBL","JBL Live Pro 2","Best value",9999,"40-hour battery · True ANC"),  # *
 ("earbuds","Samsung","Galaxy Buds FE","Budget star",5999,"Active ANC · 30-hour battery"),
]
df = pd.read_csv("data/sales.csv")
cols = [f"Outcome_M{i}" for i in range(1, 13)]
sales = df[cols].fillna(0)
sales["total"] = sales.sum(axis=1)
order = sales.sort_values("total").index.tolist()
n = len(C)
picks = [order[int(i * (len(order) - 1) / (n - 1))] for i in range(n)]
random.Random(42).shuffle(picks)
out = []
for i, (cat, brand, name, tag, price, blurb) in enumerate(C):
    r = sales.loc[picks[i]]
    monthly = [int(round(r[c] / 100)) for c in cols]
    units = sum(monthly)
    q = order.index(picks[i]) / len(order)
    out.append({
        "id": i + 1, "slug": re.sub(r"[^a-z0-9]+", "-", f"{brand}-{name}".lower()).strip("-"),
        "category": cat, "brand": brand, "name": name, "tag": tag, "price": price,
        "mrp": int(round(price * 1.08, -2)) - 1 if price > 20000 else int(round(price * 1.12, -1)) - 1,
        "blurb": blurb, "specs": [s.strip() for s in blurb.split("·")],
        "rating": round(3.9 + 0.9 * q, 1), "reviews": max(24, units // 6),
        "unitsSold": units, "monthlySales": monthly, "stock": 8 + int(q * 90),
    })
json.dump(out, open("src/data/products.json", "w"), indent=1)
print(len(out), "products written")

# ---- dataset-wide insights for the /insights dashboard (all rows of the CSV, not just the 32 catalog items)
tot = sales["total"].sort_values(ascending=False)
k = max(1, int(len(tot) * 0.1))
insights = {
    "products": int(len(df)),
    "monthly": [int(round(sales[c].sum() / 100)) for c in cols],
    "top10Share": round(float(tot.head(k).sum() / tot.sum() * 100), 1),
}
json.dump(insights, open("src/data/insights.json", "w"), indent=1)
print("insights:", insights)
