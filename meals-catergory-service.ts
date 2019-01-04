import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'



@Injectable()
export class categoryGridService {
    constructor(private http: HttpClient) { }
    formattedFilters:any = [];

    getApiEndPoint(){
        return this.http.get('/bin/safeway/config-json?id=RecipeServiceConfig').map(res => res)
    }

    getRecipeDataMealsCatergory(cuisineType, filters, endpoint, linkType) {
        var temp :any =  [];
        for (const key in filters) {
            if (filters.hasOwnProperty(key)) {
              if (typeof(filters[key]) !== 'string') {
                filters[key] = filters[key].map((filter)=>{
                    if (typeof(filter)== "string") {
                            return key + "/any(p: p eq '" + filter + "')"
                    }else{
                        return '(' + JSON.stringify(filter)
                        .replace(',', ' and ')
                        .replace(/['"]+/g, '')
                        .replace(/:/g,' ')
                        .replace(/[{}]/g, "") + ')'
                    }
                })
                filters[key] = '('+ filters[key].join(' or ') + ')';
                if (filters[key] !== '()') {
                    temp.push(filters[key])
                }
              }

            }
        }
        temp  = encodeURIComponent(temp.join(' and '))
        var url
        if (temp == '') {
            url = endpoint+'facets?q='+cuisineType+'&sf='+linkType+'&g=totalTime_tk,recipeCuisine_tk,courseType,cookingMethod_tk&count=true'; 
        }else{
            url =  endpoint+'facets?q='+cuisineType+'&sf='+linkType+"&f="+temp+'&g=totalTime_tk,recipeCuisine_tk,courseType,cookingMethod_tk';
        }

        return this.http.get(url).map(res => res); 
    }
}
// https://octopus-dev.apps.np.stratus.albertsons.com/octopus/recipes/filters?q=*&sf=*&g=totalTime_tk,recipeCuisine_tk,courseType,cookingMethod_tk



// const url = "https://octopus.apps.np.stratus.albertsons.com/octopus/recipes/facets?q="+cuisineType+"&sf=recipeCuisine_tk&g=totalTime_tk,recipeCuisine_tk,courseType,cookingMethod_tk&count=true&f=recipeCuisine_tk/any(p: p eq 'Italian')   and courseType_tk/any(p: p eq 'Appetizer')";