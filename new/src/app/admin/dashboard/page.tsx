import { auth, User } from "@/lib/auth"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { headers } from "next/headers"
import { UserWithRole } from "better-auth/plugins"

async function getUsers(): Promise<UserWithRole[]> {
    const { users } = await auth.api.listUsers({
        query: {
            limit: 100
        },
        headers: await headers()
    })

    return users
}

export default async function DemoPage() {
    const users = await getUsers()

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={users} />
        </div>
    )
}
