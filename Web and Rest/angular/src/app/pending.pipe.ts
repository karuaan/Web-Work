import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pending'
})
export class PendingPipe implements PipeTransform {

  transform(value: string): string {
    if(value === undefined || value === null || value == ""){
		return "[Pending]";
	}
	else{
		return value;
	}
  }

}
