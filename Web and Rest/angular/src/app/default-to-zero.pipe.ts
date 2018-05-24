import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultToZero'
})
export class DefaultToZeroPipe implements PipeTransform {

  transform(value: any): any {
    if(value){
		return value;
	}
	return 0;
  }

}
