import { DAY_TYPES, type DayType } from "@/lib/constants/day-types";

type DayTypeSelectorProps = {
  id?: string;
  name?: string;
  defaultValue?: DayType;
};

export function DayTypeSelector({
  id = "day-type",
  name = "dayType",
  defaultValue = "normal",
}: DayTypeSelectorProps) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {DAY_TYPES.map((dayType) => (
        <option key={dayType.value} value={dayType.value}>
          {dayType.label}
        </option>
      ))}
    </select>
  );
}
