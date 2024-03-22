import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { Metadata } from "next";
import { NextSeo } from "next-seo";

export const metadata: Metadata = {
	title: "Portfolio",
	description: "Porfolio Homepage",
};

const HomePage = () => {
	return (
		<>
			<Box
				sx={{ marginTop: 10, height: "500px" }}
				display={"flex"}
				justifyContent={"center"}
			/>
		</>
	);
};

export default HomePage;
