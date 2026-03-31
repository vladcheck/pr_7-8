import FlexContainer from "@/shared/ui/FlexContainer";
import LabelInputBlock from "@/shared/ui/LabelInputBlock";
import { Dispatch, SetStateAction } from "react";
import { Filters } from "../types";
import { FILTER_CONFIG } from "../const";

export default function Sidebar({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
}) {
  return (
    <aside className="p-2 flex h-min flex-col min-w-50 border border-gray-200">
      <FlexContainer flexDir="col" className="gap-2">
        <LabelInputBlock htmlFor="min-price" label="Минимальная цена">
          <span>{filters.price.min}</span>
          <input
            type="range"
            name="min-price"
            id="min-price"
            value={filters.price.min}
            onChange={(e) =>
              setFilters({
                ...filters,
                price: { ...filters.price, min: parseInt(e.target.value) },
              })
            }
            min={FILTER_CONFIG.price.min}
            max={filters.price.max}
            step={FILTER_CONFIG.price.step}
          />
        </LabelInputBlock>
        <LabelInputBlock htmlFor="min-price" label="Максимальная цена">
          <span>{filters.price.max}</span>
          <input
            type="range"
            name="min-price"
            id="min-price"
            value={filters.price.max}
            onChange={(e) =>
              setFilters({
                ...filters,
                price: { ...filters.price, max: parseInt(e.target.value) },
              })
            }
            min={filters.price.min}
            max={FILTER_CONFIG.price.max}
            step={FILTER_CONFIG.price.step}
          />
        </LabelInputBlock>
      </FlexContainer>
    </aside>
  );
}
