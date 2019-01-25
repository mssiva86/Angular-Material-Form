import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {DataService} from './services/dataservice';

import {FormControl} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Options } from './Interface/response';
import { catchError, map, startWith, debounce, switchMap, debounceTime } from 'rxjs/operators';
import { Alert } from 'selenium-webdriver';



declare var ActiveXObject: (type: string) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'AMSMSMetaForm';

  public isDataLoaded = false;
  public areasControl = new FormControl();
  public subAreasControl = new FormControl();
  public authorsControl = new FormControl();
  public governingBodiesControl = new FormControl();
  public industriesControl = new FormControl();
  public productsControl = new FormControl();
  public contentTypesControl = new FormControl();
  public contentSubTypesControl = new FormControl();
  public geographyControl = new FormControl();
  public templateTypeControl = new FormControl();
  public citationsControl = new FormControl();
  public effectiveDateControl = new FormControl();
  public purgeDateControl = new FormControl();
  public promotedControl = new FormControl();
  public mandatoryControl = new FormControl();


  //Values from XMETAL
  private attrArea: any = [];
  private attrSubarea;
  private attrCitations;
  private attrContentSubtype;
  private attrContentType;
  private attrEffectivedate;
  private attrGeography;
  private attrGoverningbody;
  private attrIndustries;
  private attrMandatory;
  private attrProduct;
  private attrPromoted;
  private attrPurgedate;
  private attrTemplatetype;
  private attrAuthor;
   
  // Property of the MAT Select 
  private area = null;
  public areas: any = [];
  public authors: any = [];
  public governingBodies: Options[];
  public citations: any = [];
  public fileTypes: any = [];
  public goegraphyTypes: any = [];
  public industries: any = [];
  public subAreas: any = [];
  public products: any = [];
  public sysnonyms: any = [];
  public templateTypes: Options[];
  public contentSubTypes: Options[];
  public contentTypes: Options[];
  public geographies: Options[];
  public loading = false;

  //values for mat select box
  public author_select;
  
// propery for auto filtering select fields
  public filteredGeographies : Observable<Options[]>;
  public filteredGoverningBodies : Observable<Options[]>;
  public filteredContentTypes : Observable<Options[]>;
  public filteredContentSubTypes : Observable<Options[]>;
  public filteredTemplateTypes : Observable<Options[]>;

  constructor (private api: DataService) {

   }

  ngOnInit() {
    this.loading = true;
    this.connectToXmetal();
    this.getResults();
    this.autoCompleteSearchFn(); 
}


  //Connect to XMETAL APP and read all the Metadata tag attribute values.
  connectToXmetal() {
     var xmlApp = new ActiveXObject("XMetaL.Application");
    this.attrArea = xmlApp.Selection.ContainerNode.getAttribute("area");
    this.attrSubarea = xmlApp.Selection.ContainerNode.getAttribute("subarea");
    this.attrAuthor = xmlApp.Selection.ContainerNode.getAttribute("authoredby");
    this.attrCitations = xmlApp.Selection.ContainerNode.getAttribute("citations");
    this.attrContentSubtype = xmlApp.Selection.ContainerNode.getAttribute("contentsubtype");
    this.attrContentType = xmlApp.Selection.ContainerNode.getAttribute("contenttype");
    this.attrEffectivedate = xmlApp.Selection.ContainerNode.getAttribute("effectivedate");
    this.attrGeography = xmlApp.Selection.ContainerNode.getAttribute("geography");
    this.attrGoverningbody = xmlApp.Selection.ContainerNode.getAttribute("governingbody");
    this.attrIndustries = xmlApp.Selection.ContainerNode.getAttribute("industries");
    this.attrMandatory = xmlApp.Selection.ContainerNode.getAttribute("mandatory");
    this.attrPromoted = xmlApp.Selection.ContainerNode.getAttribute("promoted");
    this.attrProduct = xmlApp.Selection.ContainerNode.getAttribute("product");
    this.attrPurgedate = xmlApp.Selection.ContainerNode.getAttribute("purgedate");
    this.attrTemplatetype = xmlApp.Selection.ContainerNode.getAttribute("templatetype");
    console.log("===" + xmlApp.Selection.Range);
  }

  getXml(){
    window.alert("I am getting called");
  }

  // Get data from the rest API
   getResults() {

    this.api.getData().subscribe(results => {
      // set the results of all the fields from forkjoin api call
      this.areas = results[0];
      this.authors = results[1];
      this.governingBodies = results[2];
      this.citations = results[3];
      this.fileTypes = results[4];
      this.goegraphyTypes = results[5];
      this.industries = results[6];
      this.subAreas = results[7];
      this.products = results[8];
      this.sysnonyms = results[9];
      this.templateTypes = results[10];
      this.contentSubTypes = results[11];
      this.contentTypes = results[12];
      this.geographies = results[13];
      this.isDataLoaded = true;
      this.loading = false;
      //call to set the selected value based on xmetal app values
      this.setSingleSeletedValue(this.attrAuthor,this.authorsControl,this.authors);
      this.setSingleSeletedValue(this.attrGoverningbody,this.governingBodiesControl,this.governingBodies);
      this.setSingleSeletedValue(this.attrIndustries,this.industriesControl,this.industries);
      this.setSingleSeletedValue(this.attrProduct,this.productsControl,this.products);
      this.setSingleSeletedValue(this.attrContentType,this.contentTypesControl,this.contentTypes);
      this.setSingleSeletedValue(this.attrContentSubtype,this.contentSubTypesControl,this.contentSubTypes);
      this.setSingleSeletedValue(this.attrGeography,this.geographyControl,this.geographies);
      this.setSingleSeletedValue(this.attrTemplatetype,this.templateTypeControl,this.templateTypes);

      //call to set the multiple selection field based on xmetal App values 
      this.setMultipleSelectedValue(this.attrArea,this.areasControl,this.areas);
      this.setMultipleSelectedValue(this.attrSubarea,this.subAreasControl,this.subAreas);

      //set existing value for data fields from xmetal app.
      this.setDateFieldValue(this.attrEffectivedate,this.effectiveDateControl);
      this.setDateFieldValue(this.attrPurgedate,this.purgeDateControl);

      //set boolean values from xmetal app.
      this.setBooleanFieldValue(this.attrPromoted,this.promotedControl);
      this.setBooleanFieldValue(this.attrMandatory,this.mandatoryControl);

     
    }); 
  } 


  
// This fun will get called for setting values based on user auto search on a field.
autoCompleteSearchFn(){

  this.filteredGeographies = this.geographyControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this._filter(description,this.geographies))
  );

  this.filteredGoverningBodies = this.governingBodiesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this._filter(description,this.governingBodies))
  );

  this.filteredContentTypes = this.contentTypesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this._filter(description,this.contentTypes))
  );

  this.filteredContentSubTypes = this.contentSubTypesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this._filter(description,this.contentSubTypes))
  );

  this.filteredTemplateTypes = this.templateTypeControl.valueChanges.pipe(startWith<string | Options>(''),
  map(value => typeof value === 'string' ? value : value.description),
  map(description => this._filter(description,this.templateTypes))
  );

}

// Filter the results set based on the typed value from select box 
  private _filter(description : string,resultset : Options[]) : Options[] {
    const filtervalue = description.toLowerCase();
  return resultset.filter( option => option.description.toLowerCase().includes(filtervalue));
  }

  // Display the description of the result set object. 
  displayFn(option? : Options) : string | undefined {
  return option ? option.description : undefined;
  }


// Set boolean field values from XMETAL APP.
setBooleanFieldValue(xmlAttr : string, currentFormControl : FormControl) {
   if(xmlAttr)
     currentFormControl.setValue(xmlAttr);
}

//Set date on date fields with the dates from XMETAL App.
setDateFieldValue(xmetalAttr : string, currentFormControl : FormControl){
  if(xmetalAttr){
    var selectedDate = new Date(xmetalAttr);
    currentFormControl.setValue(selectedDate);
  }
}  


// Set Seleted value for multi select field with the values from XMETAL App.
setMultipleSelectedValue(xmetalAttr : string, currentFormControl : FormControl , resultSet : any[]){

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
setSingleSeletedValue(xmetalAttr : string, currentFormControl : FormControl ,resultSet : any[] )
{
   if(xmetalAttr)
   {
     let selectObj = resultSet.find( o => o.id == xmetalAttr);
     currentFormControl.setValue(selectObj);
   }
}
// Show  selected values as tool tip for multi select fields
          getToolTipData(data){
            var result = data.value;
            if(result && result.length){
              let msg = "";
              result.forEach(res => {
                msg+= res.description + ';';
              })
              return msg;
            }
          }
// Show selected values as tool tip for single select fields
          getToolTipSingleValueData(data){
            var result = data.value;
            if(result){
              return result.description;
            }
          }
  
  // Method used to display first value as trigger element in multi select field along with +1,+2 options 
  displayFirstValue(value){
    if(value){
      if(value.length>0)
        return value[0].description;
    }
  }
}