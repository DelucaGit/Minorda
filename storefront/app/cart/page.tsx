import { PreviewCart } from "@/app/components/preview-cart";
import { usesShopifyCatalog } from "@/app/lib/catalog";

export const metadata = {
  title: "Varukorg · Minorda",
};

export default function CartPage() {
  if (usesShopifyCatalog()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold uppercase">Varukorg</h1>
        <p className="mt-3 text-[#707072]">
          I produktion kommer varukorgen från Shopify. Den lokala listan används inte där.
        </p>
      </main>
    );
  }

  return <PreviewCart />;
}
