# my-fake-api
Demo API written in Express to replace the API site used for the Pluralsight course Angular HTTP Playbook. Some Pluralsight Angular courses
by Jim Cooper contain a simple API server to provide data for the Angular project being used for the course material. This project was made in the same vein as
those simple API projects, but is not yet set up in the same way.

The https://fake-coffee-api.vercel.app/api site has been down for at least two months as of October 28, 2025. I added an issue to the
site's GitHub repository (https://github.com/ArvidGardebo/fake-coffee-brand-api) and attempted to add a message to the course's 
discussion.

The fake coffee api project is written in React and uses MongoDB for data storage. I forked the project and got it to run, but my
MongoDB-fu is not very strong. I created a free account on https://mongodb.com to create a hosted database, but for some reason
the computer I'm using for the project can't connect to it - even with its IP address added to the list of addresses that can
access the hosted database.

In an attempt to continue working through the course, I created this project. 

Pictures are served from the 'images' path: `http://localhost:8081/images/<<image filename>>`. I'm not sure if the image names are correct for the Pluralsight course, will update them as needed. You can tell I used a sample image and modified them for use with this project - be gentle. :)

The product data in index.js was shown in the module 2 video "Demo: Get Your App Ready for HTTP" at the 3:27 time index and the module 2 video "Demo: Requesting JSON Date" at the 6:00 time index. 
Additional coffee product data added from the Module 2 video "Demo: Creating and Modifying Data Using Request Entities".

## Using this project
- clone the project to your computer
- from a terminal prompt (Command Prompt/PowerShell/bash/etc.) navigate to the repository folder
- type in 'npm install' to restore Node packages used in the project
- to start the project, type in 'npm start' - it will listen on port 8081.

## API Endpoints

Any POST/PUT/PATCH/DELETE API requests will not affect the original list of products.

### HTTP GET
- /api - gets all products, optional query parameters of `limit=<<number>>` and `sort=<<'asc'|'desc'>>`
- /api/1 - get product by ID

### HTTP POST
- /api - add new product, will 'create' a new product and return it. Product data to add is in the body of the request.

### HTTP PUT
- /api - update existing product. Product data to update is in the body of the request. Properties not in the body will be set to null. Updated product is returned.

### HTTP PATCH
- /api - update existing product. Product data to update is in the body of the request. Properties not in the body will remain untouched. Updated product is returned.

### HTTP DELETE
- /api/1 - delete existing product. Deleted product is returned.

## Using this project within an Angular project
- copy the my-fake-api folder to the Angular project folder
- within the Angular project, create the file `proxy.conf.json` witin the `/src` folder
- paste the following JSON markup into the file:

```
{
  "/api": {
    "target": "http://localhost:8081",
    "secure": false
  }
}
```

- in the angular.json file, go to the `serve` section and add the following line under "configuration:development":
`"proxyConfig": "src/proxy.conf.json"`

- run the my-fake-api project by opening a terminal, navigating to the folder and runing `npm start`
- run the Angular application by opening a terminal, navigating to the Angular project folder and running `npm start`
- when attempting to use an API call, use the URL `/api` to access the my-fake-api server

### November 10, 2025
When attempting to post data from the source code of the Angular HTTP Playbook course, I was getting HTTP 500 errors.
In the file `coffee-api-service.ts`, when the createCoffee method was called it converted the coffee object to a string
using JSON.stringify() before making the API request. Just sending the coffee object as-is worked. 

The instructor mentioned that JSON.stringify was used specifically for the fake-coffee-api site and that most API sites
would not need it.

Does not work:
```
return this.http
      .post<{success: boolean, added: Coffee }>(
        this.apiURL,
        JSON.stringify(coffee)
      )
      .pipe(map(res => res.added), retry(1), catchError(this.handleError));
```

Works:
```
return this.http
      .post<{success: boolean, added: Coffee }>(
        this.apiURL,
        coffee
      )
      .pipe(map(res => res.added), retry(1), catchError(this.handleError));
```

### November 11, 2025
To make it easier to maintain the fake coffee product data, I moved the data to a JSON file, which is 
then read when performing API requests.

I have also included `Angular HTTP Playbook.postman_collection.json`, which is an exported collection of API calls from Postman that tests the API endpoints for this project.
