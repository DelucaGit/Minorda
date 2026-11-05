import Link from "next/link";

export const metadata = {
  title: "Varukorg · Minorda",
};

export default function CartPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-4xl font-bold uppercase">Varukorg</h1>
      <p className="mt-3 text-[#707072]">
        Varukorgen är tom. Betalning sker senare hos Shopify, inte på den här sidan.
      </p>
      <Link
        href="/collections"
        className="font-display mt-8 inline-block rounded-full bg-[#111] px-7 py-3 text-[14px] font-bold text-white uppercase"
      >
        Fortsätt handla
      </Link>
    </main>
  );
}
