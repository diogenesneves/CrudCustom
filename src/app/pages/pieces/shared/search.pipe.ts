import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerNomeFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      console.log(value)
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = (val.codigo.toLocaleLowerCase().includes(args)) 
      || (val.nome.toLocaleLowerCase().includes(args))
      || (val.valor.toLocaleLowerCase().includes(args));
      return rVal;
    })

  }

}