export class Assignment {
	assignment_id: number;
	NAME: string;
	START_DATE: Date;
	DUE_DATE: Date;
	NOTES: string;
	book_id: number;
	lesson_id: number;
	employees?: any[] = [];
	percent_complete?: Number = 0;
	TIME_TO_COMPLETE: number;
}
