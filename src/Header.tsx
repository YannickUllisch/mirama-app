import React from "react";
import Container from "./components/ui/container";
import Link from "next/link";
import mirageLogo from "@public/logo/mirage-logo-black.png";
import Image from "next/image";
import { Button } from "./components/ui/button";
import { Moon, Settings, SettingsIcon, Sun } from "lucide-react";

const Header = () => {
	const routes = [
		{
			href: "/",
			label: "Overview",
			id: 1,
		},
		{
			href: "/",
			label: "Gantt",
			id: 2,
		},
	];

	return (
		<header className="sm: flex sm: justify-between py-1 px-4 border-b">
			<Container>
				<div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
					<div className="flex items-center">
						<Link href={"/"} className="ml-4 lg:ml-0">
							<Image height={"30"} src={mirageLogo} alt={"Logo"} />
						</Link>
					</div>
					<nav className="mx-6 flex items-center space-x-4 lg:space-x-6 md:block">
						{routes.map((route) => (
							<Button asChild variant={"ghost"} key={route.id}>
								<Link
									href={route.href}
									className="text-sm font-medium transition-colors"
								>
									{route.label}
								</Link>
							</Button>
						))}
					</nav>
					<div className="flex items-center">
						<Button
							variant={"ghost"}
							size={"icon"}
							className="mr-2"
							aria-label="Settings"
						>
							<Settings className="h-6 w-6" />
						</Button>
						<Button
							variant={"ghost"}
							size={"icon"}
							className="mr-6"
							aria-label="Toggle Theme"
						>
							<Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
						</Button>
					</div>
				</div>
			</Container>
		</header>
	);
};

export default Header;
