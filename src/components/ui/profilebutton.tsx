import {
	DropdownMenu,
	DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@src/components/ui/avatar";

const ProfileButton = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar></Avatar>
			</DropdownMenuTrigger>
		</DropdownMenu>
	);
};
