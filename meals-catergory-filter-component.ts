import { Component, OnInit, Output, EventEmitter, HostListener, Input, OnChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';


declare var $: any;

@Component({
  selector: 'meals-category-filter',
  templateUrl: './meals-catergory-filter-component.html',
})
export class MealsCategoryFilterComponent implements OnInit, OnChanges, AfterViewInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 768) {
      this.showDropdownOnLoad = true;
    } else if (this.windowWidth > 768) {
      this.showDropdownOnLoad = false;
    }
  }
  public constructor(private cd: ChangeDetectorRef) {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth < 768) {
      this.showDropdownOnLoad = true;
      this.filterMobileDisplay = false;
    }
  }
  ngAfterViewInit(){
    // this.cd.detectChanges()
  }

  @HostListener('window:keydown', ['$event'])
  onSpaceDown(event) {
    // console.log(event.target)
    event.code == "Space" && event.target.classList.contains('squaredThree') ? event.preventDefault() : true
    event.code == "Space" && event.target.classList.contains('more-options-link') ? event.preventDefault() : true
  }
  @Input() fromSearchPage;
  @Input() searchData;

  @Output() setFilters = new EventEmitter();


  selectedCuisineIndex: number = 0;
  selectedFilterIndex: number;
  newSubfacetLimit: number;
  windowWidth: number;
  showDropdownOnLoad: boolean = false;
  facetLimit: number;
  subfacetLimit: number = 5;
  filterMobileDisplay: boolean = true;
  selectedFilters = [];
  cuisines = [];
  facets = [];
  filtersToCards = {};
  selectedcuisine: string;
  facetsRawData;
  APIendpoint: string;
  linksType: string;
  UrlParam: string;
  dataPrefix: string;
  activeElement: any;


  ngOnInit() {
    // this.cd.detectChanges()

    if (!this.fromSearchPage) {
      this.linksType = document.getElementById('meals-category-grid').getAttribute('data-sf');
      this.selectedcuisine = document.getElementById('meals-category-grid').getAttribute('data-q');
      this.UrlParam = document.getElementById('meals-category-grid').getAttribute('data-cat');
      this.dataPrefix = document.getElementById('meals-category-grid').getAttribute('data-urlprefix');
    }

    if (this.fromSearchPage) {
      this.facetLimit = 5
    } else {
      this.facetLimit = 3
    }
  }

  ngOnChanges() {
    this.cd.detectChanges()

  }


  sortingFacetData(data) {
    this.facetsRawData = data;

    var filters = {
      totalTime_tk: [],
      courseType: [],
      cookingMethod_tk: [],
      recipeCuisine_tk: []
    };


    if (this.selectedFilters != undefined && this.selectedFilters.length > 0) {
      for (let i = 0; i < this.selectedFilters.length; i++) {
        var temp = JSON.parse(this.selectedFilters[i])
        if (temp.facetName == "totalTime_tk") {
          filters.totalTime_tk.push(temp.filters)
        } else if (temp.facetName == "courseType") {
          filters.courseType.push(temp.filters)
        } else if (temp.facetName == "cookingMethod_tk") {
          filters.cookingMethod_tk.push(temp.filters)
        } else if (temp.facetName == "recipeCuisine_tk") {
          filters.recipeCuisine_tk.push(temp.filters)
        }
      }
    }


    this.cuisines = this.facetsRawData[this.linksType];

    var totalTime = this.facetsRawData['totalTime_tk'].map((object) => {
      // this.cd.detectChanges()

      var gt = object.from
      var lt = object.to
      var temp;
      if (gt && !lt) {
        temp = filters['totalTime_tk'].filter((obj) => {
          return obj["totalTime_tk ge"] == gt
        })
      } else if (!gt && lt) {
        temp = filters['totalTime_tk'].filter((obj) => {
          return obj["totalTime_tk lt"] == lt
        })
      } else {
        temp = filters['totalTime_tk'].filter((obj) => {
          return obj["totalTime_tk ge"] == gt && obj["totalTime_tk lt"] == lt
        })
      }

      temp.length !== 0 ? object.checked = true : object.checked = false;
      return object;
    })
    var courseType = this.facetsRawData['courseType'].map((object) => {

      filters['courseType'].indexOf(object.value) !== -1 ? object.checked = true : object.checked = false;
      return object;
    })

    var cookingMethod = this.facetsRawData['cookingMethod_tk'].map((object) => {
      filters['cookingMethod_tk'].indexOf(object.value) !== -1 ? object.checked = true : object.checked = false;
      return object;
    })

    var cusineType = this.facetsRawData['recipeCuisine_tk'].map((object) => {
      filters['recipeCuisine_tk'].indexOf(object.value) !== -1 ? object.checked = true : object.checked = false;
      return object;
    });

    this.facets = [
      {
        name: "Cuisine Type",
        value: "recipeCuisine_tk",
        subFacets: cusineType
      },
      {
        name: "Total Cook Time",
        value: "totalTime_tk",
        subFacets: totalTime
      },
      {
        name: "Course Type",
        value: "courseType",
        subFacets: courseType
      },
      {
        name: "Cooking type",
        value: "cookingMethod_tk",
        subFacets: cookingMethod
      }
    ]
   
    
    if (this.activeElement) {
      setTimeout(() => {
        var classname = this.activeElement.classList[1];
        var select: any = document.getElementsByClassName(classname)[0];
        // console.log(select);
        select.focus()
      }, 0);
    }
  }


  showMobileFilters() {
    this.filterMobileDisplay = true;
    document.body.style.overflow = "hidden"
    var filmobview: any = document.querySelector('.filterMobileView')
    filmobview.style.display = "block"

  }
  closeMobileFilters() {
    this.filterMobileDisplay = false;
    document.body.style.overflow = "auto";
    var filmobview: any = document.querySelector('.filterMobileView')
    filmobview.style.display = "none"
  }
  refreshFilter() {
    this.filtersToCards = {
      filters: this.selectedFilters
    };
    this.setFilters.emit(this.filtersToCards)
  }


  viewMoreSubFilters(index, type) {
    this.newSubfacetLimit = this.facets[index].subFacets.length;
    this.selectedFilterIndex = index;

    // this.facetFocus.nativeElement.focus()
    setTimeout(function () { document.getElementById(type + '-5').focus() }, 0)
    // ele.focus()
    // $('#' + type + '-6').focus()
    // console.log('#'+type+'-6', 'rohith')
  }

  viewLessSubFilters(index) {
    this.newSubfacetLimit = 5;
    this.selectedFilterIndex = index;
  }
  viewMoreFilters() {
    this.facetLimit += 1;
  }





  uncheckAllFilters() {
    for (let i = 0; i < this.facets.length; i++) {
      for (let j = 0; j < this.facets[i].subFacets.length; j++) {
        this.facets[i].subFacets[j].checked = false;
      }
    }
    this.selectedFilters = []
    this.refreshFilter()
  }




  clearFacetGroup(facetValue, i) {
    for (let j = 0; j < this.facets[i].subFacets.length; j++) {
      this.facets[i].subFacets[j].checked = false;
    }

    for (var k = this.selectedFilters.length - 1; k >= 0; k--) {
      if (JSON.parse(this.selectedFilters[k]).facetName == facetValue) {
        var filterIndex = this.selectedFilters.indexOf(this.selectedFilters[k]);
        if (filterIndex !== -1) this.selectedFilters.splice(filterIndex, 1);
      }
    }
    this.refreshFilter()
  }




  addFilter(filter, facet, checkbox, event, i) {
    if (event.type == 'keydown') {
      this.activeElement = document.activeElement;
      var ele: any = document.getElementById(facet.value + '-' + i).getElementsByTagName('INPUT');
      ele[0].checked == true ? ele[0].checked = false : ele[0].checked = true;
      // setTimeout(function () {
      //   document.getElementById(facet.value + '-' + i).focus()
      //   var Sele: any;
      //   if (filter.value) {
      //     Sele = document.getElementsByClassName(facet.value + '-' + filter.value)[0];
      //   } else {
      //     Sele = document.getElementsByClassName(facet.value + '-' + filter.from + '-' + filter.to)[0]
      //   }
      //   Sele.focus()
      //   console.log(document.activeElement);
        
      // }, 1500)
    }
    let filterTemp
    if (filter.value) {
      filterTemp = {
        facetName: facet.value,
        filters: filter.value
      }
      window['AB']['DATALAYER'].activeCuisines(filterTemp.filters, facet.name);
    } else {
      filterTemp = {
        facetName: facet.value,
        filters: { [facet.value + ' ge']: filter.from, [facet.value + ' lt']: filter.to }
      }

      if (filter.from && filter.to) {
        window['AB']['DATALAYER'].activeCuisines(filter.from + ' to ' + filter.to + ' min', facet.name);
      } else if (filter.from && !filter.to) {
        window['AB']['DATALAYER'].activeCuisines('More than ' + filter.from + ' min', facet.name);
      } else if (!filter.from && filter.to) {
        window['AB']['DATALAYER'].activeCuisines('Less than ' + filter.to + ' min', facet.name);
      }
    }

    if (checkbox.checked) {
      this.selectedFilters.push(JSON.stringify(filterTemp))
    }
    else if (!checkbox.checked) {
      this.selectedFilters = this.selectedFilters.filter(function (item) {
        return item != JSON.stringify(filterTemp)
      })
    }
    this.refreshFilter();
  }


}
