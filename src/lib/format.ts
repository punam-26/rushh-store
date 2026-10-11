export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const inrCompact = (n: number) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : inr(n));
export const num = (n: number) => Math.round(n).toLocaleString("en-IN");
