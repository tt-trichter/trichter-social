"use client"

import { Funnel, Moon, Sun, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"
import { auth, User } from "@/lib/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export default function Navbar(
    { user }: { user: User | null }
) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()
    const { setTheme, theme } = useTheme()

    const toggleTheme = () => {
        if (theme === "light" || theme === "system") {
            setTheme("dark")
        } else if (theme === "dark") {
            setTheme("light")
        } else {
            console.error("unkown theme is set")
        }
    }

    const onLogout = async () => {
        if (user) await authClient.signOut()
        router.push('/')
    }

    // <header className="flex items-center justify-between px-6 py-3 md:py-4 shadow max-w-5xl rounded-xl mx-auto w-full bg-white">
    return (
        <header className="flex items-center justify-between px-6 py-3 md:py-4 max-w-5xl mx-auto w-full">
            {/* Logo */}
            <Link href="/" className="flex gap-2">
                <Funnel />
                <span className="font-bold">Trichter</span>
            </Link>


            {/* Desktop Menu */}
            <nav
                className={`${isMenuOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full max-md:w-0 transition-[width] backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal`}>
                <Link className="hover:text-indigo-600 text-foreground" href="/" onClick={() => setIsMenuOpen(false)}>
                    Feed
                </Link>
                <Link className="hover:text-indigo-600 text-foreground" href="/" onClick={() => setIsMenuOpen(false)}>
                    Products
                </Link>
                <Link className="hover:text-indigo-600 text-foreground" href="/" onClick={() => setIsMenuOpen(false)}>
                    Something
                </Link>
                <Link className="hover:text-indigo-600 text-foreground" href="/" onClick={() => setIsMenuOpen(false)}>
                    Else
                </Link>

                {/* Close Button (Mobile) */}
                <Button variant="link" className="md:hidden text-gray-600"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </Button>
            </nav>

            {/* Right Side: Theme Button & Sign Up */}
            <div className="flex items-center space-x-4">
                <Button variant="outline" className="size-8 flex items-center justify-center hover:bg-gray-100 transition border border-slate-300 rounded-md" onClick={toggleTheme}>
                    {theme === 'dark' ?
                        <Sun />
                        :
                        <Moon />
                    }
                </Button>
                {user ?
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <UserIcon className="size-6 hover:cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>GitHub</DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuItem disabled>API</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onLogout}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    :
                    <Button asChild>
                        <Link className="" href="/auth/signup">
                            Sign up
                        </Link>
                    </Button>
                }

                {/* Hamburger Button (Mobile) */}
                <Button variant="link" id="openMenu" className="md:hidden text-gray-600"
                    onClick={() => setIsMenuOpen(true)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </Button>
            </div>
        </header >

    )
}
// <script>
//     const openMenu = document.getElementById('openMenu');
//     const closeMenu = document.getElementById('closeMenu');
//     const menu = document.getElementById('menu');
//
//     openMenu.addEventListener('click', () => {
//         menu.classNameList.remove('max-md:w-0');
//         menu.classNameList.add('max-md:w-full');
//     });
//
//     closeMenu.addEventListener('click', () => {
//         menu.classNameList.remove('max-md:w-full');
//         menu.classNameList.add('max-md:w-0');
//     });
// </script>
