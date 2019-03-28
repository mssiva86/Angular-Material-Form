import { Options } from "../Interface/response";
import { FormControl } from "@angular/forms";

export class Helperclass {

    // Filter the results set based on the typed value from select box 
  public _filter(description : string,resultset : Options[]) : Options[] {
    const filtervalue = description.toLowerCase();
     return resultset.filter( option => option.description.toLowerCase().includes(filtervalue));
  }

  public _filterAutoComplete(result : Options,resultset : Options[]) : Options[] {
    const filtervalue = result.description.toLowerCase();
     return resultset.filter( option => option.description.toLowerCase().includes(filtervalue));
  }
 
 // Set boolean field values from XMETAL APP.
public setBooleanFieldValue(xmlAttr : string, currentFormControl : FormControl) {
    if(xmlAttr)
      currentFormControl.setValue(xmlAttr);
 }

 //Set date on date fields with the dates from XMETAL App.
public setDateFieldValue(xmetalAttr : string, currentFormControl : FormControl){
  if(xmetalAttr){
    var selectedDate = new Date(xmetalAttr);
    currentFormControl.setValue(selectedDate);
  }
} 




// Set Seleted value for multi select field with the values from XMETAL App.
public setMultipleSelectedValue(xmetalAttr : string, currentFormControl : FormControl , resultSet : any[]){

    let selectedValueArrayObj: any = [];  
     if(xmetalAttr){
        let arrString = xmetalAttr.split(" ");
       selectedValueArrayObj = arrString.map( res => {
          return resultSet.find(o => o.id == res);
       });
       currentFormControl.setValue(selectedValueArrayObj);
     }
     
  }


//set selected value on the web App with values from xmetal app
public setSingleSeletedValue(xmetalAttr : string, currentFormControl : FormControl ,resultSet : any[] )
{
   if(xmetalAttr)
   {
     let selectObj = resultSet.find( o => o.id == xmetalAttr);
     currentFormControl.setValue(selectObj);
   }
}

}


