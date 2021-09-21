type prefixType = 'PROF_DR'
									|'PROF'
									|'ASSOC_PROF_DR'
									|'ASSOC_PROF'
									|'ASST_PROF_DR'
									|'ASST_PROF'
									|'DR'
									|'INSTRUCTOR'
type roleType = 'ADMIN'|'TEACHER'

export class User {
	user_id: number

	email: string

	username: string

	password: string

	prefix: prefixType

	firstname: string

	lastname: string

	g_auth_code: string

	role: roleType[]

	created_at: Date

	updated_at: Date
}

export class UserDTO extends User {
	constructor(
		user_id: number,
		email: string,
		username: string,
		password: string,
		prefix: prefixType,
		firstname: string,
		lastname: string,
		g_auth_code: string,
		role: roleType[],
		created_at: Date,
		updated_at: Date,
	) {
		super();
		this.user_id = user_id;
		this.email = email;
		this.username = username;
		this.password = password;
		this.prefix = prefix;
		this.firstname = firstname;
		this.lastname = lastname;
		this.g_auth_code = g_auth_code;
		this.role = role;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}

export class UserInputDTO extends User {
	constructor(
		email: string,
		username: string,
		password: string,
		prefix: prefixType,
		firstname: string,
		lastname: string,
		role: roleType[],
	) {
		super();
		this.email = email;
		this.username = username;
		this.password = password;
		this.prefix = prefix;
		this.firstname = firstname;
		this.lastname = lastname;
		this.role = role;
	}
}

export class UserOutputDTO extends User {
	constructor(
		user_id: number,
		email: string,
		username: string,
		prefix: prefixType,
		firstname: string,
		lastname: string,
		g_auth_code: string,
		role: roleType[],
		created_at: Date,
		updated_at: Date,
	) {
		super();
		this.user_id = user_id;
		this.email = email;
		this.username = username;
		this.prefix = prefix;
		this.firstname = firstname;
		this.lastname = lastname;
		this.g_auth_code = g_auth_code;
		this.role = role;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}

export class UserArrayOutputDTO extends User {
	userArray :UserOutputDTO[]

	constructor(userArray :UserOutputDTO[]) {
		super();
		this.userArray = userArray;
	}
}
