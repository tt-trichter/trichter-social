'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SocialLoginButton } from "./social-login-button"
import { fieldContext, formContext, useFormContext } from "./hooks/form-context"
import { createFormHook, formOptions, revalidateLogic, useForm } from "@tanstack/react-form"
import TextField from "./form/text-field"
import z from "zod"
import { authClient } from "@/lib/auth/auth-client"


function SignUpButton() {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) =>
        <Button type="submit" className="w-full" disabled={!canSubmit}>
          {isSubmitting ? '...' : 'SignUp'}
        </Button>
      }
    </form.Subscribe>
  )
}

const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SignUpButton
  },
  fieldContext,
  formContext
})

export const signUpFormOpts = formOptions({
  defaultValues: {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const sigUpFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.email('Valid email is required'),
  password: z.string()
    .min(8, 'Password needs to be at least 8 characters long')
    .max(128, 'Password can not be longer then 128 characters'),
  confirmPassword: z.string(),
})

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useAppForm({
    ...signUpFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: sigUpFormSchema,
      onSubmitAsync: async ({ value }) => {
        const { data: response } = await authClient.isUsernameAvailable({ username: value.username })
        if (!response?.available) {
          return {
            form: 'Invalid data',
            fields: {
              username: 'Username is taken'
            }
          }
        }
        return null;
      }
    },
    onSubmit: async ({ value }) => {
      console.log("hi")
      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.username,
        username: value.username
      })
      if (error) {
        console.error(error)
      } else {
        // form.reset()
      }
    }
  })
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create a new Account</CardTitle>
          <CardDescription>
            Continue with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              console.log("on submit")
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}>
            <div className="grid gap-6">
              <SocialLoginButton />
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <form.AppField
                    name="username"
                  >
                    {(field) => <field.TextField label="Username" placeholder="MaxMustermann" type="text" />}
                  </form.AppField>
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name="email"
                  >

                    {(field) => <field.TextField label="Email" placeholder="max@example.com" type="email" />}
                  </form.AppField>
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name="password"
                  >
                    {(field) => <field.TextField label="Password" type="password" placeholder="" />}
                  </form.AppField>
                </div>
                <div className="grid gap-3">
                  <form.AppField
                    name="confirmPassword"
                    validators={{
                      onChangeListenTo: ['password'],
                      onChange: ({ value, fieldApi }) => {
                        if (value !== fieldApi.form.getFieldValue('password')) {
                          return 'Passwords do not match'
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => <field.TextField label="Confirm Password" type="password" placeholder="" />}
                  </form.AppField>
                </div>
                <form.AppForm>
                  <form.SignUpButton />
                </form.AppForm>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div >
  )
}
