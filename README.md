# my-fake-api
Demo API written in Express to replace the API site used for the Pluralsight course Angular HTTP Playbook.

The https://fake-coffee-api.vercel.app/api site has been down for at least two months as of October 28, 2025. I added an issue to the
site's GitHub repository (https://github.com/ArvidGardebo/fake-coffee-brand-api) and attempted to add a message to the course's 
discussion.

The fake coffee api project is written in React and uses MongoDB for data storage. I forked the project and got it to run, but my
MongoDB-fu is not very strong. I created a free account on https://mongodb.com to create a hosted database, but for some reason
the computer I'm using for the project can't connect to it - even with its IP address added to the list of addresses that can
access the hosted database.

In an attempt to continue working through the course, I created this project. 

Pictures are served from the 'images' path: `http://localhost:8081/images/<<image filename>>`. I'm not sure if the image names are correct for the Pluralsight course, will update them as needed. You can tell I used a sample image and modified them for use with this project - be gentle. :)

The product data in index.js was shown in the module 2 video "Demo: Get Your App Ready for HTTP" at the 3:27 time index. 

## Using this project
- clone the project to your computer
- from a terminal prompt (Command Prompt/PowerShell/bash/etc.) navigate to the repository folder
- type in 'npm install' to restore Node packages used in the project
- to start the project, type in 'npm start'

## API Endpoints

Any POST/PUT/PATCH/DELETE API requests will not affect the original list of products.

### HTTP GET
- /api - gets all products, optional query parameters of `limit=<<number>>` and `sort=<<'asc'|'desc'>>`
- /api/<id> - get product by ID

### HTTP POST
- /api - add new product, will 'create' a new product and return it. Product data to add is in the body of the request.

### HTTP PUT
- /api - update existing product. Product data to update is in the body of the request. Properties not in the body will be set to null. Updated product is returned.

### HTTP PATCH
- /api - update existing product. Product data to update is in the body of the request. Properties not in the body will remain untouched. Updated product is returned.

### HTTP DELETE
- /api/<id> - delete existing product. Deleted product is returned.
