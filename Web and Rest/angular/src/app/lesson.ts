export class Lesson {
    ID: number;
    NAME: string;
    BOOK_ID: number;
    START_PAGE: number = 0;
    END_PAGE: number = 0;
    PDF_FILE?: string = '';
    is_checked?: boolean = false;
    ASSIGNMENTS_GROUP_IDS?: string;
    is_assigned?: boolean = false;
    changed_state?: boolean = false;
    is_valid?: boolean = false;
    ASSIGNMENT_GROUPS?: number[] = [];

    constructor(id: number, name: string, book_id: number, start: number, end: number, PDF_FILE: string, groupIds?: string) {
        this.ID = id;
        this.NAME = name;
        this.BOOK_ID = book_id;
        this.PDF_FILE = PDF_FILE;
        this.START_PAGE = start;
        this.END_PAGE = end;
        this.ASSIGNMENTS_GROUP_IDS = groupIds ? groupIds : '';
        if (groupIds) {
            this.ASSIGNMENT_GROUPS = this.groupIdStringToNumber(groupIds);
        }
        this.is_valid = this.validationCheck();
    }

    groupIdStringToNumber(groupIds) {
        let groupIdList = groupIds.split(',');
        if (groupIdList.length > 0) {
            groupIdList = groupIdList.map((item) => {
                return Number(item);
            });
            return groupIdList;
        }
        return [];
    }

    toggle() {
        this.is_checked = !this.is_checked;
    }

    changed() {
        this.changed_state = true;
    }

    setIsAssigned(status: boolean) {
        if (this.is_assigned != status) {
            this.is_assigned = status;
        }
    }

    isAssignedByGroupId(groupId: number) {
        const s = this.ASSIGNMENT_GROUPS.length > 0 && this.ASSIGNMENT_GROUPS.indexOf(groupId) > -1;
        this.setIsAssigned(s);
        return s;
    }


    validationCheck(total_pages: number = 0) {
        return this.is_valid = this.NAME != '' && this.END_PAGE && this.START_PAGE &&
            (this.START_PAGE <= this.END_PAGE) && (this.END_PAGE <= total_pages && this.START_PAGE <= total_pages);
    }

    setGroup(groupId) {
        this.setIsAssigned(true);
        if (this.ASSIGNMENTS_GROUP_IDS) {
            this.ASSIGNMENTS_GROUP_IDS = this.ASSIGNMENT_GROUPS.join(',');
        }
        this.ASSIGNMENT_GROUPS.push(groupId);
    }

    removeAssingGroup(group_id: number) {
        const index = this.ASSIGNMENT_GROUPS.indexOf(group_id);
        console.log('index', index);

        if (this.ASSIGNMENT_GROUPS.hasOwnProperty(index)) {
            this.ASSIGNMENT_GROUPS.splice(index, 1);
            this.ASSIGNMENTS_GROUP_IDS = this.ASSIGNMENT_GROUPS.join(',');
            console.log('this.ASSIGNMENTS_GROUP_IDS', this.ASSIGNMENTS_GROUP_IDS);
        }
        //
        // this.ASSIGNMENT_GROUPS = [];
        // this.ASSIGNMENTS_GROUP_IDS = '';
    }
}
