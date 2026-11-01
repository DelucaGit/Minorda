"use client";

import {
  buildProductSelectionSearchParams,
  canAddToCart,
  type SelectedOption,
} from "@shopify/hydrogen";
import { createProductComponents } from "@shopify/hydrogen/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { shopifyImageUrl, srcSetFor } from "@/lib/image";
import { formatPrice } from "@/lib/money";
import type { ProductData } from "@/lib/product-query";

const { ProductProvider, useProduct, useProductForm } = createProductComponents<ProductData>();

// Module state survives the remount when a cross-product link changes [handle].
let pendingFocus: { handle: string; optionName: string; value: string } | null = null;

function focusIfPending(node: HTMLAnchorElement | null, handle: string, optionName: string, value: string) {
  if (!node || pendingFocus?.handle !== handle || pendingFocus.optionName !== optionName || pendingFocus.value !== value) return;
  pendingFocus = null;
  node.focus();
}

function variantUrl(
  product: { handle: string; options: Array<{ name: string }> },
  selectedOptions: SelectedOption[],
  handle = product.handle,
  base: URLSearchParams | ReturnType<typeof useSearchParams> = new URLSearchParams(),
) {
  const params = buildProductSelectionSearchParams({
    selectedOptions,
    optionNames: product.options.map((option) => option.name),
    base: new URLSearchParams(base?.toString() ?? ""),
  });
  const query = params.toString();
  return `/products/${handle}${query ? `?${query}` : ""}`;
}

export function ProductDetails({ product }: { product: ProductData }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <ProductProvider
      product={product}
      onSelect={(result) => {
        router.replace(
          variantUrl(product, result.selectedOptions, result.selectedVariant?.product?.handle, searchParams),
          { scroll: false },
        );
      }}
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Gallery product={product} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="space-y-2">
            {product.productType ? (
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-brand">{product.productType}</p>
            ) : null}
            <h1 className="font-heading text-3xl font-bold uppercase leading-tight tracking-tight text-slate-950 lg:text-4xl">
              {product.title}
            </h1>
            {product.vendor ? <p className="text-sm text-muted">{product.vendor}</p> : null}
          </div>
          <ProductPrice product={product} />
          <VariantSelector product={product} />
          <AddToCart product={product} />
          {product.description ? (
            <div className="space-y-2 border-t border-line pt-6">
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-slate-950">Description</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted">{product.description}</p>
            </div>
          ) : null}
        </div>
      </div>
    </ProductProvider>
  );
}

function Gallery({ product }: { product: ProductData }) {
  const { selectedVariant } = useProduct();
  const images = product.media.nodes
    .map((node) => (node.__typename === "MediaImage" ? node.image : node.previewImage))
    .filter((image): image is NonNullable<typeof image> => Boolean(image));
  const lead = selectedVariant?.image ?? images[0] ?? null;
  const rest = images.filter((image) => image.url !== lead?.url);

  if (!lead) {
    return <div className="aspect-square w-full rounded-lg border border-line bg-slate-100" />;
  }

  return (
    <div className="space-y-3">
      <div className="aspect-square overflow-hidden rounded-lg border border-line bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params */}
        <img
          src={shopifyImageUrl(lead.url, { width: 900, height: 900, crop: "center" })}
          srcSet={srcSetFor(lead.url, { width: 900, height: 900, crop: "center" })}
          alt={lead.altText ?? product.title}
          width={900}
          height={900}
          className="h-full w-full object-cover"
        />
      </div>
      {rest.length > 0 ? (
        <ul className="grid grid-cols-4 gap-3">
          {rest.map((image) => (
            <li key={image.url} className="aspect-square overflow-hidden rounded border border-line bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params */}
              <img
                src={shopifyImageUrl(image.url, { width: 240, height: 240, crop: "center" })}
                alt={image.altText ?? product.title}
                width={240}
                height={240}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ProductPrice({ product }: { product: ProductData }) {
  const { selectedVariant } = useProduct();
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice;

  return (
    <p className="flex items-baseline gap-3 font-heading text-2xl font-bold text-brand">
      <span>{formatPrice(price)}</span>
      {compareAt && Number(compareAt.amount) > Number(price.amount) ? (
        <s className="text-base font-semibold text-slate-400">{formatPrice(compareAt)}</s>
      ) : null}
    </p>
  );
}

function VariantSelector({ product }: { product: ProductData }) {
  const { options, register } = useProductForm();
  const searchParams = useSearchParams();

  // A product with one "Default Title" variant has nothing to choose.
  if (product.options.length === 1 && product.options[0].optionValues.length === 1) return null;

  return (
    <div className="space-y-5">
      {options.map((option) => (
        <fieldset key={option.name} className="space-y-2">
          <legend className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">
            {option.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const base = "min-w-12 rounded border px-3 py-2 text-center font-heading text-sm font-bold uppercase";
              const state = value.selected
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-line bg-white text-slate-800 hover:border-slate-400";
              const soldOut = value.available ? "" : " line-through opacity-60";

              if (!value.exists) {
                return (
                  <button key={value.name} type="button" disabled className={`${base} cursor-not-allowed border-line bg-slate-50 text-slate-300`}>
                    {value.name}
                    <span className="sr-only"> (Unavailable)</span>
                  </button>
                );
              }

              const href = variantUrl(product, value.selectedOptions, value.handle, searchParams);

              if (value.handle !== product.handle) {
                return (
                  <Link
                    key={value.name}
                    href={href}
                    scroll={false}
                    onNavigate={() => {
                      pendingFocus = { handle: value.handle, optionName: option.name, value: value.name };
                    }}
                    data-available={value.available ? "true" : "false"}
                    className={`${base} ${state}${soldOut}`}
                  >
                    {value.name}
                  </Link>
                );
              }

              return (
                <Link
                  key={value.name}
                  href={href}
                  scroll={false}
                  replace
                  ref={(node) => focusIfPending(node, product.handle, option.name, value.name)}
                  aria-current={value.selected ? "true" : undefined}
                  data-available={value.available ? "true" : "false"}
                  onNavigate={(event) => {
                    // The provider's onSelect owns URL sync; stop Link navigating twice.
                    event.preventDefault();
                    register("optionValue", { optionName: option.name, value: value.name }).onClick();
                  }}
                  className={`${base} ${state}${soldOut}`}
                >
                  {value.name}
                  {!value.available ? <span className="sr-only"> (Sold out)</span> : null}
                </Link>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function AddToCart({ product }: { product: ProductData }) {
  const { options, selectedVariant, register, formProps, pending, errors, matchedLineItem } = useProductForm();
  const addable = canAddToCart(product, options);
  const label = addable ? "Add to cart" : selectedVariant ? "Sold out" : "Select options";

  return (
    <div className="space-y-3">
      <form {...formProps()} className="flex items-end gap-3">
        <input type="hidden" {...register("merchandiseId", {})} />
        <label className="flex flex-col gap-1">
          <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">Qty</span>
          <input
            {...register("quantity", { defaultValue: 1 })}
            type="number"
            min={1}
            className="w-20 rounded border border-line px-3 py-3 font-heading font-bold"
          />
        </label>
        <button
          {...register("addToCart", {})}
          disabled={!addable || pending}
          className="flex-1 rounded bg-brand px-6 py-3.5 font-heading text-lg font-bold uppercase tracking-wider text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {pending ? "Adding…" : label}
        </button>
      </form>
      {errors.userErrors.length > 0 || errors.networkErrors.length > 0 ? (
        <ul role="alert" className="space-y-1 text-sm text-red-700">
          {errors.userErrors.map((error, index) => (
            <li key={`u${index}`}>{error.message}</li>
          ))}
          {errors.networkErrors.map((error, index) => (
            <li key={`n${index}`}>{error.message}</li>
          ))}
        </ul>
      ) : null}
      {matchedLineItem ? (
        <p role="status" className="text-sm text-slate-700">
          In your cart: {matchedLineItem.quantity}.{" "}
          <Link href="/cart" className="font-bold text-brand underline">
            View cart
          </Link>
        </p>
      ) : null}
    </div>
  );
}
