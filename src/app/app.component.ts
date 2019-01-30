import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {DataService} from './services/dataservice';

import {FormControl} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Options } from './Interface/response';
import { catchError, map, startWith, debounce, switchMap, debounceTime } from 'rxjs/operators';
import { Alert } from 'selenium-webdriver';
import { Helperclass } from './Class/helperclass';



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

  private xmetalArea;
  private xmetalSubarea;
  private xmetalCitations;
  private xmetalContentSubtype;
  private xmetalContentType;
  private xmetalGeography;
  private xmetalGoverningbody;
  private xmetalIndustries;
  private xmetalMandatory;
  private xmetalProduct;
  private xmetalPromoted;
  private xmetalTemplatetype;
  private xmetalAuthor;


  //Values from XMETAL
  private attrArea;
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

  constructor (private api: DataService,private helper : Helperclass) {

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

  //set Hidden input values to get used in xmetal
    this.setHiddenValues();
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
      this.helper.setSingleSeletedValue(this.attrAuthor,this.authorsControl,this.authors);
      this.helper.setSingleSeletedValue(this.attrGoverningbody,this.governingBodiesControl,this.governingBodies);
      this.helper.setSingleSeletedValue(this.attrIndustries,this.industriesControl,this.industries);
      this.helper.setSingleSeletedValue(this.attrProduct,this.productsControl,this.products);
      this.helper.setSingleSeletedValue(this.attrContentType,this.contentTypesControl,this.contentTypes);
      this.helper.setSingleSeletedValue(this.attrContentSubtype,this.contentSubTypesControl,this.contentSubTypes);
      this.helper.setSingleSeletedValue(this.attrGeography,this.geographyControl,this.geographies);
      this.helper.setSingleSeletedValue(this.attrTemplatetype,this.templateTypeControl,this.templateTypes);

      
     

      //call to set the multiple selection field based on xmetal App values 
      this.helper.setMultipleSelectedValue(this.attrArea,this.areasControl,this.areas);
      this.helper.setMultipleSelectedValue(this.attrSubarea,this.subAreasControl,this.subAreas);

      //set existing value for data fields from xmetal app.
      this.helper.setDateFieldValue(this.attrEffectivedate,this.effectiveDateControl);
      this.helper.setDateFieldValue(this.attrPurgedate,this.purgeDateControl);

      //set boolean values from xmetal app.
      this.helper.setBooleanFieldValue(this.attrPromoted,this.promotedControl);
      this.helper.setBooleanFieldValue(this.attrMandatory,this.mandatoryControl);

     
    }); 
  } 



  
// This fun will get called for setting values based on user auto search on a field.
autoCompleteSearchFn(){

  this.filteredGeographies = this.geographyControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this.helper._filter(description,this.geographies))
  );

  this.filteredGoverningBodies = this.governingBodiesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this.helper._filter(description,this.governingBodies))
  );

  this.filteredContentTypes = this.contentTypesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this.helper._filter(description,this.contentTypes))
  );

  this.filteredContentSubTypes = this.contentSubTypesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this.helper._filter(description,this.contentSubTypes))
  );

  this.filteredTemplateTypes = this.templateTypeControl.valueChanges.pipe(startWith<string | Options>(''),
  map(value => typeof value === 'string' ? value : value.description),
  map(description => this.helper._filter(description,this.templateTypes))
  );

}


  // Display the description of the result set object. 
  displayFn(option? : Options) : string | undefined {
  return option ? option.description : undefined;
  }






//This fun will set values from xmetal to the hidden input values to later assign back to xmetal
setHiddenValues(){
  if(this.attrArea)
      this.xmetalArea = this.attrArea;
  if(this.attrSubarea)
      this.xmetalSubarea = this.attrSubarea;
  if(this.attrCitations)
      this.xmetalCitations = this.attrCitations;
  if(this.attrContentSubtype)
      this.xmetalContentSubtype = this.attrContentSubtype;
  if(this.attrContentType)
      this.xmetalContentType = this.attrContentType;
  if(this.attrGeography)
    this.xmetalGeography = this.attrGeography;
  if(this.attrGoverningbody)
    this.xmetalGoverningbody = this.attrGoverningbody;
  if(this.attrIndustries)
    this.xmetalIndustries = this.attrIndustries;
  if(this.attrMandatory)
  this.xmetalMandatory = this.attrMandatory;
  if(this.attrProduct)
  this.xmetalProduct = this.attrProduct;
  if(this.attrPromoted)
    this.xmetalPromoted = this.attrPromoted;
  if(this.attrTemplatetype)
    this.xmetalTemplatetype = this.attrTemplatetype;
  if(this.attrAuthor)
      this.xmetalAuthor = this.attrAuthor;
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
  
// Set hidden field values with Mat Select field to get used in the XMETAL with  getElementById()
  setValueForXmetal(data,attr){
     var result = data.value;
     console.log(result + " : " + attr);
     if(result){
        if(attr == "author")
            this.xmetalAuthor = result.id;
        else if(attr == "industry")
            this.xmetalIndustries = result.id;
        else if(attr == "product")
            this.xmetalProduct = result.id;
        else if(attr == "promoted")
            this.xmetalPromoted = result;
        else if(attr == "mandatory")
            this.xmetalMandatory = result;
        else if(attr == "governing")
            this.xmetalGoverningbody = result.id;
        else if(attr == "contenttype")
            this.xmetalContentType = result.id;
        else if(attr == "contentsubtype")
            this.xmetalContentSubtype = result.id;
        else if(attr == "templatetype")
            this.xmetalTemplatetype = result.id;
        else if(attr == "geography")
            this.xmetalGeography = result.id;
     }
  }

  // set hidden field value of multiple Mat Select to get used in the XMETAL with getElementById()
  setMultiValueForXmetalFields(data,attr){
    var arrObj = data.value;
    var ids = arrObj.map(i => i.id).join(" ");
    if(attr == "subarea")
      this.xmetalSubarea = ids;
    else if(attr == "area")
      this.xmetalArea = ids;
  }

  // Method used to display first value as trigger element in multi select field along with +1,+2 options 
  displayFirstValue(value){
    if(value){
      if(value.length>0)
        return value[0].description;
    }
  }


  
  }
}