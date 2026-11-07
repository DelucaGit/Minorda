import { PreviewFavorites } from "@/app/components/preview-favorites";
import { usesShopifyCatalog } from "@/app/lib/catalog";

export const metadata = {
  title: "Favoriter · Minorda",
};

export default function FavoritesPage() {
  if (usesShopifyCatalog()) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold uppercase">Favoriter</h1>
        <p className="mt-3 text-[#707072]">
          I produktion kan favoriter kopplas till ett Shopify-konto. Den lokala listan används inte där.
        </p>
      </main>
    );
  }

  return <PreviewFavorites />;
}
