import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  Flex,
  Input,
  Text,
  VStack,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface Option {
  label: string;
  value: string;
  options?: Option[];
}

interface MultiSelectDropdownProps {
  id?: string | null;
  name?: string;
  label?: string;
  value: string[];
  placeholder?: string;
  options: Option[];
  onChange: (value: string[]) => void;
  isMulti?: boolean;
}

export default function MultiSelectDropdown({
  id = null,
  name = "",
  label = "",
  value = [],
  placeholder = "Select",
  options,
  onChange,
  isMulti = true,
}: MultiSelectDropdownProps) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openAccordian, setOpenAccordian] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: Option) => {
    let newVal = [...value];
    const children = option.options?.map((opt) => opt.value) || [];
    const allValues = [option.value, ...children];

    if (value.includes(option.value)) {
      newVal = newVal.filter((val) => !allValues.includes(val));
    } else {
      newVal = [...newVal, ...allValues];
    }
    onChange([...new Set(newVal)]);
  };

  const toggleChildOption = (opt: Option) => {
    let newVal = [...value];
    if (value.includes(opt.value)) {
      newVal = newVal.filter((val) => val !== opt.value);
    } else {
      newVal.push(opt.value);
    }
    onChange([...new Set(newVal)]);
  };

  const selectAll = () => {
    if (value.length === options.flatMap((o) => [o.value, ...(o.options?.map(opt => opt.value) || [])]).length) {
      onChange([]);
    } else {
      const all = options.flatMap((o) => [o.value, ...(o.options?.map(opt => opt.value) || [])]);
      onChange(all);
    }
  };

  const filteredOptions = search
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <Box ref={dropdownRef}>
      {label && <Text mb={2}>{label}</Text>}
      <Box
        border="1px solid"
        borderColor="gray.800"
        p={2}
        borderRadius="md"
        bg="gray.700"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0
          ? `${value.length} Selected`
          : placeholder}
      </Box>

      <Collapse in={isOpen} animateOpacity>
        <Box mt={2} p={2} bg="gray.700" border="1px solid" borderColor="gray.600" borderRadius="md" maxH="300px" overflowY="auto">
          <Input
            placeholder="Search..."
            size="sm"
            mb={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Checkbox
            isChecked={
              value.length ===
              options.flatMap((o) => [o.value, ...(o.options?.map(opt => opt.value) || [])]).length
            }
            onChange={selectAll}
            mb={2}
          >
            Select All
          </Checkbox>

          <VStack align="start" spacing={2}>
            {filteredOptions.map((option) => (
              <Box key={option.value} w="100%">
                <Flex align="center" justify="space-between" w="100%">
                  <Checkbox
                    isChecked={value.includes(option.value)}
                    onChange={() => toggleOption(option)}
                  >
                    {option.label}
                  </Checkbox>
                  {option.options?.length ? (
                    <IconButton
                      icon={
                        openAccordian === option.value ? (
                          <ChevronDownIcon />
                        ) : (
                          <ChevronRightIcon />
                        )
                      }
                      size="xs"
                      aria-label="Toggle"
                      onClick={() =>
                        setOpenAccordian(
                          openAccordian === option.value ? null : option.value
                        )
                      }
                    />
                  ) : null}
                </Flex>
                {option.options?.length && openAccordian === option.value && (
                  <Box pl={4} mt={1}>
                    {option.options.map((opt) => (
                      <Checkbox
                        key={opt.value}
                        isChecked={value.includes(opt.value)}
                        onChange={() => toggleChildOption(opt)}
                        display="block"
                        mt={1}
                      >
                        {opt.label}
                      </Checkbox>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
}
