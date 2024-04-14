import config from "../config";

export interface User {
	id: number;
	name: string;
	phone: string;
	email: string;
	website: string;
}

interface UserList {
	data?: User[];
	error?: Error;
}

interface UserData {
	data?: User;
	error?: Error;
}

export const getUserList = async (): Promise<UserList> => {
	try {
		const res = await fetch(`${config.API_URL}/users`);
		const data = await res.json();

		return { data };
	} catch (error) {
		return { error: error as Error };
	}
};

export const getUserData = async (id: string): Promise<UserData> => {
	try {
		const res = await fetch(`${config.API_URL}/users/${id}`);
		const data = await res.json();
		return { data };
	} catch (error) {
		return { error: error as Error };
	}
};
