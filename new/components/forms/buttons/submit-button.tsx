import { useFormContext } from "@/components/hooks/form-hooks"
import { Button } from "@/components/ui/button"

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) =>
        <Button type="submit" className="w-full" disabled={!canSubmit}>
          {isSubmitting ? '...' : label}
        </Button>
      }
    </form.Subscribe>
  )
}
