// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/map'

// @Injectable()
// export class categoryFacetsService {
//     constructor(private http: HttpClient) {
//      }

 
//     getApiEndPoint(){
//         return this.http.get('/bin/safeway/config-json?id=RecipeServiceConfig').map(res => res)
//     }
//     getFacetsData(endpoint) {
//         const url = endpoint+'facets?q=*&sf=*&g=totalTime_tk,recipeCuisine_tk,courseType,cookingMethod_tk&count=true&n=1'
//         return this.http.get(url).map(res => res);
//     }
// }
