"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Shield, ShieldOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/lib/auth"
import { UserWithRole } from "better-auth/plugins"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<UserWithRole>[] = [
    {
        accessorKey: "displayUsername",
        header: "Username",
    },
    {
        accessorKey: "name",
        header: "Full Name",
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role")
        },

    },
    {
        accessorKey: "emailVerified",
        header: "Verified",
        cell: ({ row }) => {
            const isVerified = row.getValue("emailVerified") as boolean
            if (isVerified) {
                return <Badge variant="default" className="bg-green-500"><Shield /></Badge>
            } else {
                return <Badge variant="default" className="bg-red-500"><ShieldOff /></Badge>
            }
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
