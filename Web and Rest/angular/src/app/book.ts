import {Lesson} from "./lesson";

export class Book {
	NAME: string;
	PDF_FILE: string;
    TOTAL_PAGES?: number;
	ID: number;
}

export class BookNew {
	NAME: string;
	PDF_FILE: string;
    TOTAL_PAGES?: number;
	ID: number;
	LESSONS: Lesson[] = [];
}
