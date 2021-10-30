import {
	IsNotEmpty, IsNumber, IsArray,
} from 'class-validator';

export class MapSubStandard {
	@IsNotEmpty()
	@IsNumber()
	main_sub_std_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	relative_sub_std_id : number=-1;
}

export class CreateMapStandardRequestDTO {
	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	main_std_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	relative_std_id : number=-1;

	@IsArray()
	map_sub_standards : MapSubStandard[] = [];
}

export class MapStandardInputDTO {
	@IsNotEmpty()
	@IsNumber()
	curriculum_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	main_std_id : number=-1;

	@IsNotEmpty()
	@IsNumber()
	relative_std_id : number=-1;
}
