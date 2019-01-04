import { LoaderService } from '../loading-spinner/loading-spinner.service';
import { Component,ViewChild , OnInit, HostListener, Input} from '@angular/core';
import { categoryGridService } from './meals-catergory-service';
import { MealsCategoryFilterComponent } from "../meals-category-filter/meals-catergory-filter-component";

@Component({
  selector: 'meals-category-grid',
  templateUrl: './meals-catergory-grid-component.html',
  providers:  [categoryGridService]
})
export class MealsCategoryGridComponent implements OnInit{
  public sm='480px';
  public md='768px';
 
  public constructor(private CGService: categoryGridService,private loaderService:LoaderService){
  }
  @HostListener("window:scroll")
  onScroll(): void {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight-200) {
      if (this.showLimit >= this.cardsRawData.length) {
         this.loaderService.hide();
      }else{
        this.loaderService.show();
        setTimeout(() => {
          this.showLimit += 6
          this.loaderService.hide();
        }, 100);
      }
    }
  }


  @ViewChild('filterComponent') filterComponent: MealsCategoryFilterComponent;

   cardsRawData = [];
   showLimit = 6;
   cuisineType;
   facetFilters = [];
   filters = {
          totalTime_tk: [],
          courseType: [],
          cookingMethod_tk: [],
          recipeCuisine_tk: []

  };
  screenMessage;
  APIendpoint:string;
  linksType:string;
  dataPrefix:string;

  facetShowDuringFiltering = true;
  filterErrorMessages = [
    'Please change your filters, no results found for your criteria'
  ]
  facetData: any;

  ngOnInit(){ 
    this.linksType = document.getElementById('meals-category-grid').getAttribute('data-sf');
    this.cuisineType = document.getElementById('meals-category-grid').getAttribute('data-q');
    this.dataPrefix = document.getElementById('meals-category-grid').getAttribute('data-urlprefix');

    this.CGService.getApiEndPoint().subscribe((res)=>{
      this.APIendpoint = res['recipe.service.endpoint'];
      this.getCardsData()
      })
    }

    getCardsData(){
      this.cardsRawData = [];
      this.loaderService.show();
      this.screenMessage = "";
      this.CGService.getRecipeDataMealsCatergory(this.cuisineType, this.filters, this.APIendpoint, this.linksType).subscribe((res)=>{
        this.facetData = res['result']['@search.facets']
        this.filterComponent.sortingFacetData(this.facetData)
        // console.log(res['@search.facet'],this.facetData, 'rohith')

          this.cardsRawData = res['result']['value'];
          if (this.cardsRawData.length == 0) {
            this.facetShowDuringFiltering = false
       }else{
         this.facetShowDuringFiltering = true
       }
          this.loaderService.hide();
      },(err)=>{
        console.log(err);
        if (err.status == 404) {
          this.cardsRawData = undefined;
          this.screenMessage = "No Results Found";
        }
        this.loaderService.hide();
      })
    }

    filterResults(event){
      this.screenMessage = "";
        this.showLimit = 6
        this.filters = {
          totalTime_tk: [],
          courseType: [],
          cookingMethod_tk: [],
          recipeCuisine_tk: []
        };
        if (event.filters.length > 0) {
          for (let i = 0; i < event.filters.length; i++) {
            var temp = JSON.parse(event.filters[i])
            if(temp.facetName == "totalTime_tk"){
              this.filters.totalTime_tk.push(temp.filters)
            }else if(temp.facetName == "courseType"){
              this.filters.courseType.push(temp.filters)
            }else if(temp.facetName == "cookingMethod_tk"){
              this.filters.cookingMethod_tk.push(temp.filters)
            }else if(temp.facetName == "recipeCuisine_tk"){
              this.filters.recipeCuisine_tk.push(temp.filters)
            }
          }
        }
        this.getCardsData()
    }
}


