export interface User {
	id: string;
	username: string;
	moderator: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface Channel {
	id: string;
	name: string;
	author: User;
	private: boolean;
	createdAt: number;
	updatedAt: number;
}

export interface Message {
	id: string;
	content: string;
	author: User;
	channel: string;
	createdAt: number;
	updatedAt: number;
}
