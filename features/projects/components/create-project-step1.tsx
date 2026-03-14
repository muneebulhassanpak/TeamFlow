"use client"

import type { UseFormReturn } from "react-hook-form"
import { Check } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CreateProjectInput } from "@/features/projects/validations/projects"
import { DEFAULT_PROJECT_COLORS } from "@/features/projects/utils"
import { cn } from "@/lib/utils"



interface CreateProjectStep1Props {
  form: UseFormReturn<CreateProjectInput>
  onNext: () => void
}

export function CreateProjectStep1({ form, onNext }: CreateProjectStep1Props) {
  return (
    <Form {...form}>
      <form
        id="step1-form"
        onSubmit={(e) => {
          e.preventDefault()
          onNext()
        }}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project (optional)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_PROJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "relative size-8 rounded-full border-2 transition-transform hover:scale-110",
                        field.value === color
                          ? "border-foreground"
                          : "border-muted hover:border-muted-foreground"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => field.onChange(color)}
                    >
                      {field.value === color && (
                        <Check className="absolute inset-0 m-auto size-4 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
