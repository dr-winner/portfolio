import type { StackItem } from "@prisma/client";
import { ICON_KEYS } from "@/lib/icons";
import { Field, Input, Select, SubmitButton } from "../_components/Form";

export function ItemForm({
  item,
  action,
}: {
  item?: StackItem;
  action: (formData: FormData) => Promise<void> | void;
}) {
  return (
    <form action={action} className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_2fr_1.2fr_0.6fr_auto] md:items-end">
      <Field label="Name">
        <Input name="name" defaultValue={item?.name} required />
      </Field>
      <Field label="Icon">
        <Select name="iconKey" defaultValue={item?.iconKey ?? "Sparkles"}>
          {ICON_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Level">
        <Select name="level" defaultValue={item?.level ?? "working"}>
          <option value="core">core</option>
          <option value="working">working</option>
          <option value="learning">learning</option>
        </Select>
      </Field>
      <Field label="Order">
        <Input type="number" name="order" defaultValue={item?.order ?? 0} />
      </Field>
      <SubmitButton>{item ? "Save" : "Add"}</SubmitButton>
    </form>
  );
}
