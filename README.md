# my-fake-api
Demo API written in Express to replace the API site used for the Pluralsight course Angular HTTP Playbook

The https://fake-coffee-api.vercel.app/api site has been down for at least two months as of October 28, 2025. I added an issue to the
site's GitHub repository (https://github.com/ArvidGardebo/fake-coffee-brand-api) and attempted to add a message to the course's 
discussion.

The fake coffee api project is written in React and uses MongoDB for data storage. I forked the project and got it to run, but my
MongoDB-fu is not very strong. I created a free account on https://mongodb.com to create a hosted database, but for some reason
the computer I'm using for the project can't connect to it - even with its IP address added to the list of addresses that can
access the hosted database.

In an attempt to continue working through the course, I created this project. It does not return product images since its
data is stored within index.js.

The product data in index.js was shown in the module 2 video "Demo: Get Your App Ready for HTTP" at the 3:27 time index. 
