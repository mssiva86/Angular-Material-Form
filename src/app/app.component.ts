import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import {DataService} from './services/dataservice';

import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { Options } from './Interface/response';
import { map, startWith } from 'rxjs/operators';
import { Helperclass } from './Class/helperclass';
import { citation } from './Interface/citation';
import { ArrayClass } from './Class/ArrayClass';



declare var ActiveXObject: (type: string) => void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'AMSMSMetaForm';

  public authorsControl = new FormControl();
  public languageControl = new FormControl();
  public isDataLoaded = false;
  public areasControl = new FormControl();
  public topicsControl = new FormControl();
  public governingBodiesControl = new FormControl();
  public industriesControl = new FormControl();
  public productsControl = new FormControl();
  public contentTypesControl = new FormControl();
  public typesControl = new FormControl();
  public geographyControl = new FormControl();
  public templateTypeControl = new FormControl();
  public citationsControl = new FormControl();
  public effectiveDateControl = new FormControl();
  public purgeDateControl = new FormControl();
  public promotedControl = new FormControl();
  public mandatoryControl = new FormControl();
 
  


  private xmetalAuthor;
  private xmetalLanguage;
  private xmetalArea;
  private xmetalTopic;
  private xmetalCitation;
  private xmetalType;
  private xmetalContentType;
  private xmetalGeography;
  private xmetalGoverningbody;
  private xmetalIndustries;
  private xmetalMandatory;
  private xmetalProduct;
  private xmetalPromoted;
  private xmetalTemplatetype;
  


  //Values from XMETAL
  private attrAuthor;
  private attrLanguage;
  private attrArea;
  private attrTopics;
  private attrCitations;
  private attrType;
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
  
   
  // Property of the MAT Select 
  public authors: any = [];
  public languages: any = [];
  public areas: any = [];
  public governingBodies: Options[];
  public citations: citation[];
  public fileTypes: any = [];
  public industries: any = [];
  public topics: any = [];
  public products: any = [];
  public sysnonyms: any = [];
  public templateTypes: Options[];
  public types: Options[];
  public contentTypes: Options[];
  public geographies: Options[];


  public loading = false;
  public disabled = false;
  public checkboxDisabled = false;
  public citationDisabled = false;

  //values for mat select box
  //public author_select;
  
// propery for auto filtering select fields
  public filteredGeographies : Observable<Options[]>;
  public filteredTypes : Observable<Options[]>;

  constructor (private api: DataService,private helper : Helperclass,
               private arrayClass : ArrayClass) {

   }

  ngOnInit() {
    this.loading = true;
   this.connectToXmetal();
    this.getResults();
    this.autoCompleteSearchFn(); 
    this.disableEnableControls(false);
}


  //Connect to XMETAL APP and read all the Metadata tag attribute values.
  connectToXmetal() {
     var xmlApp = new ActiveXObject("XMetaL.Application");
    this.attrAuthor = xmlApp.Selection.ContainerNode.getAttribute("authoredby");
    this.attrLanguage = xmlApp.Selection.ContainerNode.getAttribute("language");
    this.attrArea = xmlApp.Selection.ContainerNode.getAttribute("area");
    this.attrTopics = xmlApp.Selection.ContainerNode.getAttribute("topic");
    this.attrCitations = xmlApp.Selection.ContainerNode.getAttribute("citations");
    this.attrType = xmlApp.Selection.ContainerNode.getAttribute("type");
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
     
      this.authors = results[0];
      this.languages = results[1];
      this.areas = results[2];
      this.governingBodies = results[3];
      this.citations = results[4];
      this.fileTypes = results[5];
      this.industries = results[6];
      this.topics = results[7];
      this.products = results[8];
      this.sysnonyms = results[9];
      this.templateTypes = results[10];
      this.types = results[11];
      this.contentTypes = results[12];
      this.geographies = results[13];

     
      this.isDataLoaded = true;
      this.loading = false;
      //call to set the selected value based on xmetal app values
      this.helper.setSingleSeletedValue(this.attrAuthor,this.authorsControl,this.authors);
      this.helper.setSingleSeletedValue(this.attrLanguage,this.languageControl,this.languages);
      this.helper.setSingleSeletedValue(this.attrContentType,this.contentTypesControl,this.contentTypes);
      this.helper.setSingleSeletedValue(this.attrType,this.typesControl,this.types);
      this.helper.setSingleSeletedValue(this.attrGeography,this.geographyControl,this.geographies);
      this.helper.setSingleSeletedValue(this.attrTemplatetype,this.templateTypeControl,this.templateTypes);

      
     

      //call to set the multiple selection field based on xmetal App values 
      this.helper.setMultipleSelectedValue(this.attrArea,this.areasControl,this.areas);
      this.helper.setMultipleSelectedValue(this.attrTopics,this.topicsControl,this.topics);
      this.helper.setMultipleSelectedValue(this.attrProduct,this.productsControl,this.products);
      this.helper.setMultipleSelectedValue(this.attrGoverningbody,this.governingBodiesControl,this.governingBodies);
      this.helper.setMultipleSelectedValue(this.attrIndustries,this.industriesControl,this.industries);
      this.helper.setMultipleSelectedValue(this.attrCitations, this.citationsControl,this.citations);

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

  this.filteredTypes = this.typesControl.valueChanges.pipe(
    startWith<string | Options>(''),
    map(value => typeof value === 'string' ? value : value.description),
    map(description => this.helper._filter(description,this.types))
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
  if(this.attrTopics)
      this.xmetalTopic = this.attrTopics;
  if(this.attrCitations)
      this.xmetalCitation = this.attrCitations;
  if(this.attrType)
      this.xmetalType = this.attrType;
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
    if(this.attrCitations)
       this.xmetalCitation = this.attrCitations;
}



  
// Set hidden field values with Mat Select field to get used in the XMETAL with  getElementById()
  setValueForXmetal(data,attr){
     var result = data.value;
     if(result){
        if(attr == "author")
            this.xmetalAuthor = result.id;
        else if(attr == "promoted")
            this.xmetalPromoted = result;
        else if(attr == "mandatory")
            this.xmetalMandatory = result;
        else if(attr == "contenttype")
            this.xmetalContentType = result.id;
        else if(attr == "geography")
            this.xmetalGeography = result.id;
        else if(attr == "language")
            this.xmetalLanguage = result.id;
        else if(attr == "type")
            this.xmetalType = result.id;
        else if(attr == "templateType")
            this.xmetalTemplatetype = result.id;
     }
  }

  
  // set hidden field value of multiple Mat Select to get used in the XMETAL with getElementById()
  setMultiValueForXmetalFields(data,attr){
    var arrObj = data.value;
    var ids = arrObj.map(i => i.id).join(" ");
    if(attr == "topic")
      this.xmetalTopic = ids;
    else if(attr == "area")
      this.xmetalArea = ids;
    else if(attr == "product")
      this.xmetalProduct = ids;
    else if(attr == "governing")
    this.xmetalGoverningbody = ids;
    else if(attr == "industry")
    this.xmetalIndustries = ids;
  }

  /* Set values for Content types and template types based on the Type field selection by the user*/
  setXmetalAndTypeRelatedFields(data){
    var result = data.value;
    if(typeof result == 'object'){

            this.xmetalType = result.id;
            let contentTypeObj = this.contentTypes.find( o => o.id == result.contentId);
            let templateTypeObj = this.templateTypes.find( o => o.id == result.templateId );
            this.contentTypesControl.setValue(contentTypeObj);
            this.xmetalContentType = contentTypeObj.id;
            this.templateTypeControl.setValue(templateTypeObj);
            this.xmetalTemplatetype = templateTypeObj.id;
    }
    else{
      this.contentTypesControl.setValue(result);
      this.xmetalContentType = result;
      this.templateTypeControl.setValue(result);
      this.xmetalTemplatetype = result;
    }
  }





   
 


  // Set values for Topics,Area, Industry , Product and GoverningBodies automatically by selecting Citations
  setXmetalAndCitationRelatedFields(data){
    var result = data.value;
    if(result && result.length){
  
       this.checkboxDisabled = true;
      // Set the xmetal value for citations
    this.xmetalCitation = this.arrayClass.setMultivalues(result);
    
    let areasObjectArray : any = [];
    let governingBodiesObjArray : any = [];
    let industriesObjectArray : any = [];
    let productsObjectArray : any = [];
    let topicsObjectArray : any = [];

    let cfrareaArray : any = [];
    let cfrgoverningBodiesArray : any = [];
    let cfrindustriesArray : any = [];
    let cfrproductArray : any = [];
    let cfrTopicsArray : any = [];

    let listofIds = this.arrayClass.createArrayofIds(result);
    this.api.getCFRRelatedIDs("cfrareas",listofIds).subscribe( cfrarea => {
      this.loading = true;
       cfrareaArray = Array.from(new Set(cfrarea));
       cfrareaArray.forEach( areaId => {
          areasObjectArray.push(this.areas.find(o => o.id == areaId));
       });
       this.areasControl.setValue(areasObjectArray);
       this.xmetalArea = this.arrayClass.setMultivalues(areasObjectArray); 
       this.loading  = false;
    });

    this.api.getCFRRelatedIDs("cfrgoverningbodies",listofIds).subscribe(cfrGovBody => {
      this.loading = true;
      cfrgoverningBodiesArray = Array.from(new Set(cfrGovBody));
      cfrgoverningBodiesArray.forEach( govId => {
        governingBodiesObjArray.push(this.governingBodies.find(o => o.id == govId));
      });
      this.governingBodiesControl.setValue(governingBodiesObjArray);
      this.xmetalGoverningbody = this.arrayClass.setMultivalues(governingBodiesObjArray);
      this.loading = false;
    });

    this.api.getCFRRelatedIDs("cfrindustries", listofIds).subscribe(cfrindustry => {
      this.loading = true;
      cfrindustriesArray = Array.from(new Set(cfrindustry));
      cfrindustriesArray.forEach( indId => {
        industriesObjectArray.push(this.industries.find( o=> o.id == indId));
      });

      this.industriesControl.setValue(industriesObjectArray);
      this.xmetalIndustries = this.arrayClass.setMultivalues(industriesObjectArray);
      this.loading = false;
    })

    this.api.getCFRRelatedIDs("cfrproducts", listofIds).subscribe(cfrproduct => {
      this.loading = true;
      cfrproductArray = Array.from(new Set(cfrproduct));
      cfrproductArray.forEach( prdId => {
        productsObjectArray.push(this.products.find(o => o.id == prdId));
      });

      this.productsControl.setValue(productsObjectArray);
      this.xmetalProduct = this.arrayClass.setMultivalues(productsObjectArray);
      this.loading = false;
    })


    this.api.getCFRRelatedIDs("cfrtopics", listofIds).subscribe( cfrtopic => {
      this.loading = true;
      cfrTopicsArray = Array.from(new Set(cfrtopic));
      cfrTopicsArray.forEach( topicId => {
          topicsObjectArray.push(this.topics.find( o=> o.id == topicId));
      });
      this.topicsControl.setValue(topicsObjectArray);
      this.xmetalTopic = this.arrayClass.setMultivalues(topicsObjectArray);
      this.loading = false;
    })

  }
  else{

    this.citationsControl.setValue(result);
    this.xmetalCitation = result;
    this.areasControl.setValue(result);
    this.xmetalArea = result;
    this.governingBodiesControl.setValue(result);
    this.xmetalGoverningbody = result;
    this.industriesControl.setValue(result);
    this.xmetalIndustries = result;
    this.productsControl.setValue(result);
    this.xmetalProduct = result;
    this.topicsControl.setValue(result);
    this.xmetalTopic = result;
    this.checkboxDisabled = false;
  }
  }
 
 
 

// Based on Citations selection/ Citation Check box selection, enable/disable Areas,Topics,Industries,Governing Bodies and Industries.
  disableEnableControls(value){
    if(value){
      this.governingBodiesControl.enable();
      this.areasControl.enable();
      this.topicsControl.enable();
      this.industriesControl.enable();
      this.productsControl.enable();
      this.citationsControl.disable();
    }
    else 
    {
      this.templateTypeControl.disable();
      this.governingBodiesControl.disable();
      this.areasControl.disable();
      this.topicsControl.disable();
      this.industriesControl.disable();
      this.productsControl.disable(); 
      this.contentTypesControl.disable();
      this.citationsControl.enable();
      this.checkboxDisabled = true;
    }
  }

   // Method used to display first value as trigger element in multi select field along with +1,+2 options 
   displayFirstValue(value){
  
    if(value){
   if(value.length>1){
     var desc = value[0].description;
       if(desc.length>35)
       return desc.substring(0,35) + "...";
       else
       return desc;
   }
   else if(value.length>0){
     return value[0].description;
   }
    }
  }

//Method used to display first value as trigger element in multi select CFR Citation field along with +1,+2 options.
  displayFirstValueForCFR(value){
    if(value){
      if(value.length > 0)
      return value[0].cfrid;
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

//Show selected values as tool tip for multi select Citations field
  getToolTipForCFR(result){
    if(result && result.length){
      let msg = "";
      result.forEach(res => {
        msg+= res.cfrid + ';';
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
  
  }
