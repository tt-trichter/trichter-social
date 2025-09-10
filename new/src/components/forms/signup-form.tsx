'use client'
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SocialLoginButton } from "./buttons/social-login-button"
import { formOptions, revalidateLogic } from "@tanstack/react-form"
import z from "zod"
import { authClient } from "@/lib/auth/auth-client"
import { useAppForm } from "../hooks/form-hooks"
import { useRouter } from "next/navigation"


const signUpFormOpts = formOptions({
  defaultValues: {
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const sigUpFormSchema = z.object({
  fullName: z.string(),
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
  const router = useRouter();
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
      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.fullName || value.username,
        username: value.username
      })
      if (error) {
        alert("Something went wrong...")
        console.error(error)
      } else {
        window.history.pushState(null, '', '/')
        router.push('/')
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
                <form.AppField
                  name="fullName"
                >
                  {(field) => <field.TextField label="Full Name" placeholder="Max Mustermann" type="text" />}
                </form.AppField>
                <form.AppField
                  name="username"
                >
                  {(field) => <field.TextField label="Username" placeholder="MaxMustermann161" type="text" />}
                </form.AppField>
                <form.AppField
                  name="email"
                >

                  {(field) => <field.TextField label="Email" placeholder="max@example.com" type="email" />}
                </form.AppField>
                <form.AppField
                  name="password"
                >
                  {(field) => <field.TextField label="Password" type="password" placeholder="" />}
                </form.AppField>
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
                <form.AppForm>
                  <form.SubmitButton label="SignUp" />
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
