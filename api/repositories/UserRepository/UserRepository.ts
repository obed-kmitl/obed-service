import db from '_/utils/db';

export default class UserRepository {
	constructor(){

	}

	public createSection = () => {
	
	}

	public createUser = async () => {
		var cols = [
			'teacher2@teacher.com', 
			'teacher2',
			'password',
			'Professor',
			'TeacherTestFN',
			'TeacherTestLN',
			'Teacher'
		];

    await db.query('INSERT INTO users (email,username,password,prefix,firstname,lastname,role) VALUES ($1, $2, $3, $4, $5, $6, $7)', cols)
			.catch((err)=>console.log(err)) 
	}

	public addTeacher = () => {

	}

	public findAllTeachers = async () => {
		const res = await db.query('SELECT * FROM teachers INNER JOIN users ON user_id = teacher_id', []);
		console.log(res.rows);
	}

}