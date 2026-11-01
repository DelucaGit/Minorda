"use client";

import {
  formatMoney,
  getFilterRemovalUrl,
  getSortByValue,
  isFilterInputActive,
  parseCollectionParams,
  serializeCollectionParams,
  type AvailableFilter,
  type CollectionState,
  type MoneyV2,
  type ProductFilter,
} from "@shopify/hydrogen";
import { CollectionProvider, useCollection, useCollectionForm } from "@shopify/hydrogen/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, type ChangeEvent, type ReactNode } from "react";

import { ProductCard } from "@/components/ProductCard";
import { LOCALE } from "@/lib/money";
import type { ProductCardData } from "@/lib/product-card";

const COLLECTION_SORT_OPTIONS = [
  { label: "Featured", value: getSortByValue("COLLECTION_DEFAULT", false) },
  { label: "Best selling", value: getSortByValue("BEST_SELLING", false) },
  { label: "Alphabetically, A-Z", value: getSortByValue("TITLE", false) },
  { label: "Alphabetically, Z-A", value: getSortByValue("TITLE", true) },
  { label: "Price, low to high", value: getSortByValue("PRICE", false) },
  { label: "Price, high to low", value: getSortByValue("PRICE", true) },
  { label: "Date, old to new", value: getSortByValue("CREATED", false) },
  { label: "Date, new to old", value: getSortByValue("CREATED", true) },
];

const SEARCH_SORT_OPTIONS = [
  { label: "Relevance", value: getSortByValue("RELEVANCE", false) },
  { label: "Price, low to high", value: getSortByValue("PRICE", false) },
  { label: "Price, high to low", value: getSortByValue("PRICE", true) },
];

type BrowserProps = {
  products: ProductCardData[];
  availableFilters: AvailableFilter[];
  currencyCode: MoneyV2["currencyCode"];
  dataSearch: string;
  endCursor: string | null;
  hasNextPage: boolean;
  header?: ReactNode;
} & ({ mode: "collection"; handle: string } | { mode: "search"; term: string });

function stripPaging(search: string) {
  const params = new URLSearchParams(search);
  params.delete("after");
  params.delete("before");
  return params;
}

export function CollectionBrowser(props: BrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearch = searchParams.toString();
  const handle = props.mode === "collection" ? props.handle : `search:${props.term}`;

  return (
    <CollectionProvider
      data={{ handle, dataSearch: props.dataSearch }}
      urlSearch={urlSearch}
      onChange={(search) => {
        // Filter or sort changes start from the first page and keep the search term.
        const params = stripPaging(search);
        if (props.mode === "search") params.set("q", props.term);
        const query = params.toString();
        const href = `${pathname}${query ? `?${query}` : ""}`;
        if (urlSearch) router.replace(href, { scroll: false });
        else router.push(href, { scroll: false });
        router.refresh();
      }}
    >
      <BrowserContent {...props} />
    </CollectionProvider>
  );
}

function currentSortValue(state: CollectionState, mode: BrowserProps["mode"]) {
  if (!state.sortKey) return mode === "search" ? getSortByValue("RELEVANCE", false) : getSortByValue("COLLECTION_DEFAULT", false);
  return getSortByValue(state.sortKey, state.reverse);
}

function requestFormSubmit(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  event.currentTarget.form?.requestSubmit();
}

function BrowserContent(props: BrowserProps) {
  const state = useCollection();
  const { formProps } = useCollectionForm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoading = state.status === "loading";
  const action = props.mode === "collection" ? `/collections/${props.handle}` : "/search";
  const sortOptions = props.mode === "collection" ? COLLECTION_SORT_OPTIONS : SEARCH_SORT_OPTIONS;
  const basePath = props.mode === "search" ? `/search?q=${encodeURIComponent(props.term)}` : action;

  const nextPage = (() => {
    if (!props.hasNextPage || !props.endCursor) return null;
    const params = stripPaging(searchParams.toString());
    params.set("after", props.endCursor);
    return `${pathname}?${params.toString()}`;
  })();
  const onLaterPage = searchParams.has("after");
  const firstPage = (() => {
    const query = stripPaging(searchParams.toString()).toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  })();

  return (
    <form {...formProps()} method="get" action={action} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {props.mode === "search" ? <input type="hidden" name="q" value={props.term} /> : null}
      <aside className="space-y-6 lg:col-span-3">
        <label className="flex flex-col gap-2">
          <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">Sort by</span>
          <select
            name="sort_by"
            value={currentSortValue(state, props.mode)}
            onChange={requestFormSubmit}
            className="rounded border border-line bg-white px-3 py-2 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {props.availableFilters.map((filter) => (
          <fieldset key={filter.id} className="space-y-2">
            <legend className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700">{filter.label}</legend>
            <FilterGroup filter={filter} activeFilters={state.filters} currencyCode={props.currencyCode} />
          </fieldset>
        ))}
        <noscript>
          <button type="submit" className="rounded bg-ink px-4 py-2 font-heading text-sm font-bold uppercase text-white">
            Apply
          </button>
        </noscript>
      </aside>
      <div className="space-y-6 lg:col-span-9">
        {props.header}
        {state.filters.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Active filters">
            {state.filters.map((filter, index) => {
              const removal = getFilterRemovalUrl(serializeCollectionParams(state), filter);
              const params = stripPaging(removal === "?" ? "" : removal);
              if (props.mode === "search") params.set("q", props.term);
              const query = params.toString();
              return (
                <li key={index}>
                  <Link
                    href={`${pathname}${query ? `?${query}` : ""}`}
                    scroll={false}
                    onClick={() => router.refresh()}
                    className="inline-flex items-center gap-2 rounded-full border border-line bg-slate-100 px-3 py-1 text-sm"
                  >
                    {describeFilter(filter, props.currencyCode)} <span aria-hidden="true">×</span>
                    <span className="sr-only">Remove filter</span>
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href={basePath} scroll={false} onClick={() => router.refresh()} className="inline-block px-2 py-1 text-sm text-brand underline">
                Clear all
              </Link>
            </li>
          </ul>
        ) : null}
        {props.products.length > 0 ? (
          <ul className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 ${isLoading ? "opacity-50" : ""}`} aria-busy={isLoading}>
            {props.products.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-line p-10 text-center text-muted">
            {props.mode === "search" ? "No products match that search." : "No products match these filters."}
          </p>
        )}
        <div className="flex flex-wrap gap-4">
          {onLaterPage ? (
            <Link href={firstPage} onClick={() => router.refresh()} className="rounded border-2 border-slate-900 px-5 py-3 font-heading text-sm font-bold uppercase">
              ← First page
            </Link>
          ) : null}
          {nextPage ? (
            <Link href={nextPage} onClick={() => router.refresh()} className="rounded bg-ink px-5 py-3 font-heading text-sm font-bold uppercase text-white">
              Next page →
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function describeFilter(filter: ProductFilter, currencyCode: MoneyV2["currencyCode"]) {
  if (filter.price) {
    const fmt = (amount: number) => formatMoney({ amount: String(amount), currencyCode }, { locale: LOCALE }).toString();
    const min = filter.price.min != null ? fmt(filter.price.min) : "";
    const max = filter.price.max != null ? fmt(filter.price.max) : "";
    return `Price ${min}–${max}`;
  }
  if (filter.variantOption) return `${filter.variantOption.name}: ${filter.variantOption.value}`;
  if (filter.productType) return filter.productType;
  if (filter.productVendor) return filter.productVendor;
  if (filter.tag) return filter.tag;
  if (filter.available != null) return filter.available ? "In stock" : "Out of stock";
  return "Filter";
}

function FilterGroup({
  activeFilters,
  currencyCode,
  filter,
}: {
  activeFilters: ProductFilter[];
  currencyCode: MoneyV2["currencyCode"];
  filter: AvailableFilter;
}) {
  if (filter.type === "PRICE_RANGE") {
    return <PriceRangeInput activeFilters={activeFilters} currencyCode={currencyCode} />;
  }

  return (
    <div className="space-y-1">
      {filter.values.map((value) => (
        <CheckboxFilterValue key={value.id} activeFilters={activeFilters} value={value} />
      ))}
    </div>
  );
}

function PriceRangeInput({
  activeFilters,
  currencyCode,
}: {
  activeFilters: ProductFilter[];
  currencyCode: MoneyV2["currencyCode"];
}) {
  // One timer for both inputs, so editing min then max submits once.
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minInput = useRef<HTMLInputElement>(null);
  const maxInput = useRef<HTMLInputElement>(null);
  const price = activeFilters.find((filter) => filter.price)?.price;
  const min = price?.min ?? "";
  const max = price?.max ?? "";
  const symbol = formatMoney({ amount: "0", currencyCode }, { locale: LOCALE }).currencyNarrowSymbol;

  useEffect(() => {
    for (const [input, value] of [
      [minInput.current, min],
      [maxInput.current, max],
    ] as const) {
      if (!input) continue;
      const matches = value === "" ? input.value === "" : input.value !== "" && Number(input.value) === value;
      if (!matches) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        input.value = String(value);
      }
    }
  }, [min, max]);

  useEffect(() => {
    function cancelPendingSubmit() {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
    }

    function restoreHistoryPrice() {
      cancelPendingSubmit();
      const { filters } = parseCollectionParams(new URLSearchParams(window.location.search));
      const historyPrice = filters.find((filter) => filter.price)?.price;
      if (minInput.current) minInput.current.value = String(historyPrice?.min ?? "");
      if (maxInput.current) maxInput.current.value = String(historyPrice?.max ?? "");
    }

    const form = minInput.current?.form;
    form?.addEventListener("submit", cancelPendingSubmit);
    window.addEventListener("popstate", restoreHistoryPrice);
    return () => {
      form?.removeEventListener("submit", cancelPendingSubmit);
      window.removeEventListener("popstate", restoreHistoryPrice);
      cancelPendingSubmit();
    };
  }, []);

  function submitAfterTyping(event: ChangeEvent<HTMLInputElement>) {
    if (timer.current) clearTimeout(timer.current);
    const form = event.currentTarget.form;
    timer.current = setTimeout(() => {
      timer.current = null;
      form?.requestSubmit();
    }, 350);
  }

  return (
    <div className="flex items-center gap-2">
      <PriceInput inputRef={minInput} name="filter.v.price.gte" defaultValue={min} label={`Minimum price in ${currencyCode}`} symbol={symbol} onChange={submitAfterTyping} />
      <span aria-hidden="true">–</span>
      <PriceInput inputRef={maxInput} name="filter.v.price.lte" defaultValue={max} label={`Maximum price in ${currencyCode}`} symbol={symbol} onChange={submitAfterTyping} />
    </div>
  );
}

function PriceInput({
  inputRef,
  name,
  defaultValue,
  label,
  symbol,
  onChange,
}: {
  inputRef: React.Ref<HTMLInputElement>;
  name: string;
  defaultValue: number | "";
  label: string;
  symbol: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1 rounded border border-line px-2 py-1">
      <span aria-hidden="true" className="text-sm text-muted">{symbol}</span>
      <input ref={inputRef} type="number" name={name} defaultValue={defaultValue} aria-label={label} min="0" step="any" onChange={onChange} className="w-20 min-w-0 text-sm focus:outline-none" />
    </span>
  );
}

function filterValueInputParamEntries(input: string): Array<{ name: string; value: string }> {
  let filter: ProductFilter;
  try {
    filter = JSON.parse(input) as ProductFilter;
  } catch {
    return [];
  }

  return Array.from(serializeCollectionParams({ filters: [filter], sortKey: undefined, reverse: false }), ([name, value]) => ({ name, value }));
}

function CheckboxFilterValue({
  activeFilters,
  value,
}: {
  activeFilters: ProductFilter[];
  value: AvailableFilter["values"][number];
}) {
  const entries = filterValueInputParamEntries(value.input);
  if (entries.length !== 1) return null;
  const [{ name, value: paramValue }] = entries;

  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        value={paramValue}
        checked={isFilterInputActive(activeFilters, value.input)}
        onChange={(event) => {
          // Single-choice filters (e.g. availability) share one param name.
          if (event.currentTarget.checked) {
            const form = event.currentTarget.form;
            form?.querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${CSS.escape(name)}"]`).forEach((sibling) => {
              if (sibling !== event.currentTarget && name === "filter.v.availability") sibling.checked = false;
            });
          }
          requestFormSubmit(event);
        }}
      />
      <span>
        {value.label} <span className="text-muted">({value.count})</span>
      </span>
    </label>
  );
}
