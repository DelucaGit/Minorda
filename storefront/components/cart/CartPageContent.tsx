"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart, useCartForm } from "@/lib/cart";
import { shopifyImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/money";

type CartLine = ReturnType<typeof useLines>[number];

function useLines() {
  return useCart((state) => state.data.lines.nodes);
}

export function CartPageContent() {
  const loading = useCart((state) => state.loading);
  const lines = useLines();

  if (loading) {
    return (
      <div role="status" aria-label="Loading cart" className="space-y-4">
        {[0, 1].map((key) => (
          <div key={key} className="h-28 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="space-y-6">
        <ErrorBanner />
        <div className="rounded-lg border border-dashed border-line p-10 text-center">
          <p className="mb-6 text-lg text-muted">Your cart is empty.</p>
          <Link href="/collections" className="rounded bg-brand px-6 py-3 font-heading font-bold uppercase text-white">
            Shop all
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <ErrorBanner />
        <ul className="divide-y divide-line rounded-lg border border-line">
          {lines.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </ul>
      </div>
      <CartSummary />
    </div>
  );
}

function CartLineItem({ line }: { line: CartLine }) {
  const { formProps, register } = useCartForm();
  const pendingLines = useCart((state) => state.pending.lines);
  const lineErrors = useCart((state) => state.errors.lines);
  const pending = pendingLines.has(line.id);
  const errorGroup = lineErrors.get(line.id);
  const messages = [...(errorGroup?.userErrors ?? []), ...(errorGroup?.warnings ?? [])].map((error) => error.message);
  const merchandise = line.merchandise;
  const title = merchandise?.product?.title ?? merchandise?.title ?? "Product";
  const handle = merchandise?.product?.handle;
  const options = (merchandise?.selectedOptions ?? []).filter((option) => option.value !== "Default Title");
  const attributes = (line.attributes ?? []).filter((attribute) => !attribute.key.startsWith("_"));
  const safeId = line.id.replace(/[^a-zA-Z0-9]/g, "");
  const errorId = `line-error-${safeId}`;
  const quantityId = `qty-${safeId}`;

  return (
    <li className="flex gap-4 p-4">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded border border-line bg-slate-50">
        {merchandise?.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- Hydrogen image skill: plain <img> with Shopify CDN sizing params
          <img
            src={shopifyImageUrl(merchandise.image.url, { width: 192, height: 192, crop: "center" })}
            alt={merchandise.image.altText ?? title}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {handle ? (
              <Link href={`/products/${handle}`} className="font-heading font-bold uppercase hover:text-brand">
                {title}
              </Link>
            ) : (
              <span className="font-heading font-bold uppercase">{title}</span>
            )}
            {options.length > 0 ? (
              <p className="text-sm text-muted">{options.map((option) => `${option.name}: ${option.value}`).join(" · ")}</p>
            ) : null}
            {attributes.map((attribute) => (
              <p key={attribute.key} className="text-sm text-muted">
                {attribute.key}: {attribute.value}
              </p>
            ))}
          </div>
          <p className={`shrink-0 font-heading font-bold ${pending ? "opacity-30" : ""}`}>
            {line.cost?.totalAmount ? formatPrice(line.cost.totalAmount) : null}
          </p>
        </div>
        <form {...formProps()} className="flex flex-wrap items-center gap-2">
          <button {...register("set")} />
          <input type="hidden" {...register("lineId", { value: line.id })} />
          <button
            type="submit"
            {...register("decrease")}
            aria-label={`Decrease quantity of ${title}`}
            className="h-9 w-9 rounded border border-line font-bold hover:border-slate-400"
          >
            −
          </button>
          <label htmlFor={quantityId} className="sr-only">
            Quantity of {title}
          </label>
          <input
            id={quantityId}
            {...register("quantity", { value: line.quantity, interactive: true })}
            aria-invalid={messages.length > 0 ? "true" : undefined}
            aria-describedby={messages.length > 0 ? errorId : undefined}
            className={`h-9 w-16 rounded border border-line text-center font-heading font-bold ${pending ? "opacity-30" : ""}`}
          />
          <button
            type="submit"
            {...register("increase")}
            aria-label={`Increase quantity of ${title}`}
            className="h-9 w-9 rounded border border-line font-bold hover:border-slate-400"
          >
            +
          </button>
          <button type="submit" {...register("remove")} className="ml-2 text-sm text-muted underline hover:text-red-700">
            Remove
          </button>
        </form>
        {messages.length > 0 ? (
          <ul id={errorId} role="alert" className="text-sm text-red-700">
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function CartSummary() {
  const cost = useCart((state) => state.data.cost);
  const checkoutUrl = useCart((state) => state.data.checkoutUrl);
  const totalsPending = useCart((state) => state.pending.cost === true || state.revalidating === true);

  return (
    <aside className="h-fit space-y-4 rounded-lg border border-line bg-slate-50 p-6 lg:col-span-4" aria-busy={totalsPending}>
      <h2 className="font-heading text-lg font-bold uppercase">Summary</h2>
      <dl className={`space-y-2 ${totalsPending ? "opacity-30" : ""}`}>
        {cost?.subtotalAmount ? (
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-heading font-bold">{formatPrice(cost.subtotalAmount)}</dd>
          </div>
        ) : null}
        {cost?.totalAmount ? (
          <div className="flex justify-between border-t border-line pt-2">
            <dt className="font-bold">Total</dt>
            <dd className="font-heading text-xl font-bold">{formatPrice(cost.totalAmount)}</dd>
          </div>
        ) : null}
      </dl>
      <p className="text-xs text-muted">Taxes and shipping are calculated at checkout.</p>
      {checkoutUrl ? (
        <a
          href={checkoutUrl}
          className="block rounded bg-brand px-6 py-3.5 text-center font-heading text-lg font-bold uppercase tracking-wider text-white hover:bg-blue-700"
        >
          Checkout
        </a>
      ) : null}
    </aside>
  );
}

function ErrorBanner() {
  const errors = useCart((state) => state.errors);
  const lines = useLines();
  const [dismissedAt, setDismissedAt] = useState(0);

  const lineIds = new Set(lines.map((line) => line.id));
  const messages = [
    ...errors.network.map((entry) => entry.message),
    ...errors.cart.userErrors.map((error) => error.message),
    ...errors.cart.warnings.map((warning) => warning.message),
    ...[...errors.lines.entries()]
      .filter(([lineId]) => !lineIds.has(lineId))
      .flatMap(([, group]) => [...group.userErrors, ...group.warnings].map((error) => error.message)),
  ];

  if (messages.length === 0 || errors.lastUpdatedAt <= dismissedAt) return null;

  return (
    <div role="alert" className="flex items-start justify-between gap-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <ul className="space-y-1">
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <button type="button" onClick={() => setDismissedAt(errors.lastUpdatedAt)} className="font-bold underline">
        Dismiss
      </button>
    </div>
  );
}
