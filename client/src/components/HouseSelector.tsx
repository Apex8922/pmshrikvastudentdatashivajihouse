import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StudentHouse } from "@shared/schema";
import { houseOptions } from "@/lib/data";

interface HouseSelectorProps {
  value: StudentHouse | undefined;
  onChange: (value: StudentHouse) => void;
  error?: string;
}

export function HouseSelector({ value, onChange, error }: HouseSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(val) => onChange(val as StudentHouse)}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1"
    >
      {houseOptions.map((house) => (
        <FormItem key={house.value} className="relative flex">
          <FormControl>
            <RadioGroupItem 
              value={house.value} 
              className="sr-only peer" 
              id={`house-${house.value.toLowerCase()}`}
            />
          </FormControl>
          <FormLabel
            htmlFor={`house-${house.value.toLowerCase()}`}
            className="flex items-center justify-center p-3 border border-neutral-300 rounded-md text-center cursor-pointer hover:bg-neutral-50 w-full h-full peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-50"
          >
            {house.label}
          </FormLabel>
        </FormItem>
      ))}
      {error && <FormMessage className="col-span-full">{error}</FormMessage>}
    </RadioGroup>
  );
}

export default HouseSelector;
