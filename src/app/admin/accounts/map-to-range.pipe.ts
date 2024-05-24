import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToRange'
})
export class MapToRangePipe implements PipeTransform {
  transform(value: number): number[] {
    return Array.from({ length: value }, (_, i) => i + 1);
  }
}
