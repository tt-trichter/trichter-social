import { useFieldContext } from '@/components/hooks/form-hooks';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@tanstack/react-form'
import { HTMLInputTypeAttribute } from 'react';

export default function TextField({ label, placeholder = "", type = "text" }: { label: string, placeholder: string | undefined, type: HTMLInputTypeAttribute }) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (

    <div className="grid gap-3">
      <Label htmlFor={field.name}
      >{label}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {errors.map((error: string | { message: string }) => (
        <div key={typeof error === 'string' ? error : error.message} className="text-red-500 text-sm">
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </div>
  )
}

