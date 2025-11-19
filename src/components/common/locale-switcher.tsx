"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { setUserLocale } from "@/actions/locale";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  language: z
    .string({
      error: "Please select a language.",
    })
    .min(1, "Please select a language."),
});

export function LocaleSwitcher({
  languages,
  className,
}: {
  languages?: Array<{ label: string; value: string }>;
  className?: string;
}) {
  const t = useTranslations("locale-switcher");
  const defaultLocale = useLocale();

  languages ??= [
    { label: t("english"), value: "en" },
    { label: t("indonesia"), value: "id" },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      language: defaultLocale,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(`${data.language}`);
    const locale = data.language as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className={cn("mx-3", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn("w-[70px] justify-between", !field.value && "text-muted-foreground")}
                      >
                        {field.value
                          ? languages.find((language) => language.value === field.value)?.value.toUpperCase()
                          : defaultLocale.toUpperCase()}
                        <Globe className="ml-1" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search language..." className="h-9" />
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.value}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("language", language.value, { shouldValidate: true });
                              onSubmit({ language: language.value });
                            }}
                          >
                            {language.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                language.value === field.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button type="submit">Submit</Button> */}
        </form>
      </Form>
    </div>
  );
}
