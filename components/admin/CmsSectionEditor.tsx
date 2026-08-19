"use client";

// Generic CMS section editor. Introspects the shape of a CMS section's
// content object at runtime and renders:
//  - string/number fields as text inputs
//  - arrays of primitive strings as a repeatable single-input list
//  - arrays of objects as a repeatable card list (one input per field),
//    with add / remove / move-up / move-down controls
// This lets a single component drive editing for all CMS sections
// (Home, About, Programs, Teachers, Facilities, Gallery, Events,
// Testimonials, FAQs, Curriculum, Footer, Navigation, Admissions Steps,
// Blog) without writing bespoke forms for each one.

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/lib/hooks/useToast";
import { useCmsMutation } from "@/lib/hooks/useCmsSection";
import type { CmsSectionKey, CmsSectionMap } from "@/lib/types/cms";

type AnyRecord = Record<string, any>;

function isPlainObject(v: unknown): v is AnyRecord {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function ArrayOfObjectsField({ control, name, sample }: { control: any; name: string; sample: AnyRecord }) {
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const keys = Object.keys(sample);

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <Card key={field.id} className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-heading text-xs font-semibold text-[#3a2e4d]/50">Item {index + 1}</span>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Move up"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
                className="rounded-full p-1.5 text-[#3a2e4d]/60 hover:bg-lavender/20 disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={index === fields.length - 1}
                onClick={() => move(index, index + 1)}
                className="rounded-full p-1.5 text-[#3a2e4d]/60 hover:bg-lavender/20 disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Remove item"
                onClick={() => remove(index)}
                className="rounded-full p-1.5 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {keys.map((key) => (
              <Controller
                key={key}
                control={control}
                name={`${name}.${index}.${key}` as const}
                render={({ field: f }) => (
                  <Input
                    label={key}
                    value={f.value ?? ""}
                    onChange={(e) => f.onChange(typeof sample[key] === "number" ? Number(e.target.value) : e.target.value)}
                    type={typeof sample[key] === "number" ? "number" : "text"}
                  />
                )}
              />
            ))}
          </div>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append(sample)}>
        <Plus className="h-4 w-4" /> Add item
      </Button>
    </div>
  );
}

function ArrayOfStringsField({ control, name }: { control: any; name: string }) {
  const { fields, append, remove, move } = useFieldArray({ control, name: name as any });
  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            control={control}
            name={`${name}.${index}` as const}
            render={({ field: f }) => <Input value={f.value ?? ""} onChange={f.onChange} className="flex-1" />}
          />
          <button
            type="button"
            aria-label="Move up"
            disabled={index === 0}
            onClick={() => move(index, index - 1)}
            className="rounded-full p-1.5 text-[#3a2e4d]/60 hover:bg-lavender/20 disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Remove"
            onClick={() => remove(index)}
            className="rounded-full p-1.5 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => append("")}>
        <Plus className="h-4 w-4" /> Add
      </Button>
    </div>
  );
}

export function CmsSectionEditor<K extends CmsSectionKey>({
  section,
  initialData,
}: {
  section: K;
  initialData: CmsSectionMap[K];
}) {
  const toast = useToast();
  const mutation = useCmsMutation(section);
  const { control, handleSubmit, register } = useForm<AnyRecord>({ defaultValues: initialData as AnyRecord });
  const [saving, setSaving] = useState(false);

  const topLevelKeys = Object.keys(initialData as AnyRecord);

  const onSubmit = async (data: AnyRecord) => {
    setSaving(true);
    try {
      await mutation.mutateAsync(data as CmsSectionMap[K]);
      toast.success("Content saved. The site will reflect these changes on next load.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" data-testid="cms-section-editor-form">
      {topLevelKeys.map((key) => {
        const value = (initialData as AnyRecord)[key];

        if (Array.isArray(value)) {
          if (value.length > 0 && isPlainObject(value[0])) {
            return (
              <div key={key}>
                <h3 className="mb-2 font-heading text-sm font-bold capitalize text-[#3a2e4d]">{key}</h3>
                <ArrayOfObjectsField control={control} name={key} sample={value[0]} />
              </div>
            );
          }
          return (
            <div key={key}>
              <h3 className="mb-2 font-heading text-sm font-bold capitalize text-[#3a2e4d]">{key}</h3>
              <ArrayOfStringsField control={control} name={key} />
            </div>
          );
        }

        if (isPlainObject(value)) {
          return (
            <div key={key}>
              <h3 className="mb-2 font-heading text-sm font-bold capitalize text-[#3a2e4d]">{key}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.keys(value).map((sub) => (
                  <Input key={sub} label={sub} {...register(`${key}.${sub}`)} />
                ))}
              </div>
            </div>
          );
        }

        const isLong = typeof value === "string" && value.length > 60;
        return (
          <div key={key}>
            {isLong ? (
              <div className="w-full">
                <label className="mb-1.5 block font-heading text-sm font-semibold capitalize text-[#3a2e4d]">{key}</label>
                <textarea
                  {...register(key)}
                  rows={3}
                  className="w-full rounded-2xl border-2 border-lavender/40 bg-white px-4 py-2.5 font-body text-[#3a2e4d] focus:outline-none focus:ring-2 focus:ring-candy focus:border-candy"
                />
              </div>
            ) : (
              <Input label={key} {...register(key)} />
            )}
          </div>
        );
      })}

      <div className="sticky bottom-0 flex justify-end border-t border-black/5 bg-white/90 py-4 backdrop-blur">
        <Button type="submit" isLoading={saving} data-testid="cms-save-changes">
          <Save className="h-4 w-4" /> Save changes
        </Button>
      </div>
    </form>
  );
}
