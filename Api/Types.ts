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

enum CommentPermissionType {
	DISABLED = "disabled",
	FORBIDDEN = "forbidden",
	OWNERS = "owners",
	SIGNED_IN_USERS = "signed_in_users",
	EVERYONE = "everyone",
}

type CreateNoteOptions = {
	title?: string;
	content?: string;
	readPermission?: NotePermissionRole;
	writePermission?: NotePermissionRole;
	commentPermission?: CommentPermissionType;
	permalink?: string;
};

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

type SingleNote = Note & {
	content: string;
};

// User
type GetMe = Profile;

// User notes
type GetUserNotes = Note[];
type GetUserNote = SingleNote;
type GetUserHistory = Note[];
type CreateUserNote = SingleNote;
type UpdateUserNote = void;
type DeleteUserNote = void;

// Teams
type GetUserTeams = Team[];

// Team notes
type GetTeamNotes = Note[];
type CreateTeamNote = SingleNote;
type UpdateTeamNote = void;
type DeleteTeamNote = void;

// await fetch("https://hackmd.io/@_mC1_D9aRTyypZIy9SJiSA/HJmHAqS-6/readAllComment", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0",
//         "Accept": "application/json, text/plain, */*",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin",
//         "Sec-GPC": "1",
//         "If-None-Match": "W/\"2150-X3Z57d8YvqwctRc39buQbtRv2ew\""
//     },
//     "referrer": "https://hackmd.io/@_mC1_D9aRTyypZIy9SJiSA/HJmHAqS-6",
//     "method": "GET",
//     "mode": "cors"
// });
