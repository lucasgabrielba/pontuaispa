import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectOption {
  label: string
  value: string
}

interface CustomSelectProps {
  id?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  items: SelectOption[]
  onValueChange?: (value: string) => void
  disabled?: boolean
}

export function CustomSelect({
  id,
  name,
  value,
  defaultValue,
  placeholder,
  items,
  onValueChange,
  disabled,
}: CustomSelectProps) {
  return (
    <Select name={name} value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value || "none"} value={item.value || "none"}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
