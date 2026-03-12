import { PropsWithChildren } from "react";

type SupportedCurrencies = "RUB";

const currencyNameToCurrencySumbolMap = new Map<SupportedCurrencies, string>();
currencyNameToCurrencySumbolMap.set("RUB", "₽");

function getCurrencySymbolFromCurrencyName(
  currency: SupportedCurrencies,
): string {
  return currencyNameToCurrencySumbolMap.get(currency) || "CURRENCY_NOT_FOUND";
}

export default function Price({
  children,
  currency = "RUB",
}: PropsWithChildren & { currency?: SupportedCurrencies }) {
  return (
    <div className="price">
      {children}
      <span className="ml-1">
        {getCurrencySymbolFromCurrencyName(currency)}
      </span>
    </div>
  );
}
