import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html suppressHydrationWarning lang="en">
			<body className="bg-stone-900 dark:bg-black">
				<main> {children}</main>
			</body>
		</html>
	);
};
export default RootLayout;
