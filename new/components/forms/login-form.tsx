"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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
import { useAppForm } from "../hooks/form-hooks"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"

const loginFormOpts = formOptions({
  defaultValues: {
    username: '',
    password: ''
  }
})

const loginFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useAppForm({
    ...loginFormOpts,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.username({
        username: value.username,
        password: value.password
      })

      if (error) {
        alert("Something went wrong: " + error.message)
        console.error(error)
      } else {
        router.push('/')
      }
    }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
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
                  name="username"
                >
                  {(field) => <field.TextField label="Username" placeholder="MaxMustermann100" type="text" />}
                </form.AppField>
                <div className="flex flex-col">
                  <form.AppField
                    name="password"
                  >
                    {(field) => <field.TextField label="Password" type="password" placeholder="" />}
                  </form.AppField>
                  <a
                    href="#"
                    className="ml-1 mt-1 text-gray-700 text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/auth/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div >
  )
}
