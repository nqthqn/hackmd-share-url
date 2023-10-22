export interface ReadAllComments {
	comments: Comment[];
	users: Profile[];
	reactions: { [key: string]: unknown };
	commentAnchors: Array<Array<number | string>>;
	permission: boolean;
}

export interface Comment {
	content: string;
	authorName: string;
	id: string;
	userId: string;
	noteId: string;
	replyToId: null | string;
	mentionAnchors: null;
	resolvedAt: null;
	hiddenAt: null;
	selectionRemovedAt: null;
	deletedAt: null;
	plainExcerpt: null | string;
	excerpt: null | string;
	anchor: Array<number | null>;
	createdAt: string;
	updatedAt: string;
	pinned: null;
	mentions: unknown;
}

export interface User {
	id: string;
	email: null | string;
	username: null;
	displayName: string;
	avatar: string;
	userpath: string;
}

enum TeamVisibilityType {
	PUBLIC = "public",
	PRIVATE = "private",
}

enum NotePublishType {
	EDIT = "edit",
	VIEW = "view",
	SLIDE = "slide",
	BOOK = "book",
}

type Team = {
	id: string;
	ownerId: string;
	name: string;
	logo: string;
	path: string;
	description: string;
	hardBreaks: boolean;
	visibility: TeamVisibilityType;
	createdAt: Date;
};

export type Profile = {
	id: string;
	email: string | null;
	name: string;
	userPath: string;
	photo: string;
	teams: Team[];
};

type SimpleUserProfile = {
	name: string;
	userPath: string;
	photo: string;
	biography: string | null;
	createdAt: Date;
};

enum NotePermissionRole {
	OWNER = "owner",
	SIGNED_IN = "signed_in",
	GUEST = "guest",
}

export type Note = {
	id: string;
	title: string;
	tags: string[];
	lastChangedAt: string;
	createdAt: string;
	lastChangeUser: SimpleUserProfile | null;
	publishType: NotePublishType;
	publishedAt: string | null;
	userPath: string | null;
	teamPath: string | null;
	permalink: string | null;
	shortId: string;
	publishLink: string;
	readPermission: NotePermissionRole;
	writePermission: NotePermissionRole;
};
