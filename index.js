const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");
const app = express();

// serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

/* 
    API endpoints of fake-coffee-api site:
    --------------------------------------
    [GET] /api              - retrieves all products
    [GET] /api?limit=1      - limits results
    [GET] /api?sort=desc    - sorts results
    [GET] /api/1            - retrieves product by ID
    [PUT] /api/1            - updates a product
                                data to update will be in the body of the request
                                fields not in the body will be set to empty
    [PATCH] /api/1          - updates a product
                                data to update will be in the body of the request
                                fields not in the body will not change
    [POST] /api             - adds a new product
                                product to add will be in the body of the request
                                convert to JSON using JSON.stringify
    [DELETE] /api/1         - deletes a product

    Product structure:
    ------------------
    {
        id:             Number,
        name:           String,
        description:    String,
        price:          Number,
        region:         String,
        weight:         Number,
        flavor_profile: Array of strings,
        grind_option:   Array of strings,
        roast_level:    Number,
    }

    Individual objects
    - flavor_profile: String
      - examples from the video: 'Citrus', 'Dark Chocolate', 'Black Cherry'
    - grind_option: String
      - examples from the video: 'Whole Bean', 'Cafetiere', 'Filter', 'Espresso'

    fake-coffee-api project uses MongoDB for data storage,
    but I the structure of the collections/tables is not in 
    the repository.

    Images
    ------
    Images are now served from the path http://localhost:8081/images.
    There are three images to match the sample product data:
    - golden_sunrise.png
    - rainforest_rhapsody.png
    - signature_blend.png

*/

// get products, optional limit and sort
app.get("/api", (req, res) => {
  let productsArray = fetchProductsFromDatabase();

  // additional query parameters:
  // limit = 1
  // sort = asc|desc

  const queryParameters = req.queryParameters;
  let sortOrder = req.query.sort ?? "asc";
  let data = [...productsArray];
  let limit = parseInt(req.query.limit);

  // console.log(req.query);
  console.log("---------");
  console.log("sortOrder ", sortOrder);
  console.log("limit ", limit);

  // console.log(data);

  // sort the data
  if (sortOrder === "asc") {
    data = productsArray.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "desc") {
    data = productsArray.sort((a, b) => b.name.localeCompare(a.name));
  }

  // limit the data if the value is greater than 0
  if (limit > 0) {
    console.log("limiting data");
    data = data.slice(0, limit);
    // console.log(data);
  }

  res.status(200).json(data);
});

// get a single product
app.get("/api/:id", (req, res) => {
  let productsArray = fetchProductsFromDatabase();
  const id = parseInt(req.params.id);
  let data = [...productsArray];

  console.log(`Type of id: ${typeof id}`);

  if (id) {
    console.log(`id is ${id}, filter for product`);
    data = data.filter(function (product) {
      console.log(`product ID: ${product.id}`);
      return product.id === id;
    });
    // console.log("product matching id: ", data);
  }

  res.status(200).json(data);
});

// add new product
app.post("/api", (req, res) => {
  // let product = JSON.parse(req.body);
  let product = req.body;

  try {
    // product name is required
    if (product.name) {
      let productsArray = fetchProductsFromDatabase();
      const id = productsArray.length + 1;
      product.id = id;
      productsArray.push(product);

      console.log("----- in api post method");
      // console.log(body);
      // console.log(productsArray.length);

      return res.status(200).json({
        success: true,
        added: product,
      });
    } else {
      return res.status(405).json({
        success: false,
        message: "Method not allowed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Is it a valid JSON object you sent in?" });
  }
});

// update product, clearing properties not passed to the API endpoint
app.put("/api/:id", (req, res) => {
  let product = req.body;
  const id = parseInt(req.params.id);

  if (id) {
    // get existing product
    const productToUpdate = fetchProductsFromDatabase().filter(
      (p) => p.id == id
    );

    console.log("----- in api put method");
    console.log(product);

    if (productToUpdate) {
      // with put, if a field is not in the body it will be set to null
      console.log("BEFORE - product to update: ");
      console.log(productToUpdate);

      product.name
        ? (productToUpdate[0].name = product.name)
        : (productToUpdate[0].name = null);
      product.description
        ? (productToUpdate[0].description = product.description)
        : (productToUpdate[0].description = null);
      product.price
        ? (productToUpdate[0].price = product.price)
        : (productToUpdate[0].price = null);
      product.region
        ? (productToUpdate[0].region = product.region)
        : (productToUpdate[0].region = null);
      product.weight
        ? (productToUpdate[0].weight = product.weight)
        : (productToUpdate[0].weight = null);
      product.flavor_profile
        ? (productToUpdate[0].flavor_profile = product.flavor_profile)
        : (productToUpdate[0].flavor_profile = null);
      product.grind_option
        ? (productToUpdate[0].grind_option = product.grind_option)
        : (productToUpdate[0].grind_option = null);
      product.roast_level
        ? (productToUpdate[0].roast_level = product.roast_level)
        : (productToUpdate[0].roast_level = null);

      console.log("AFTER - product to update: ");
      console.log(productToUpdate);

      return res.status(200).json({
        success: true,
        message: "Coffee updated (put) successfully",
        update: productToUpdate[0],
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Coffee not found" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
});

// update product, leaving properties not passed to the API untouched
app.patch("/api/:id", (req, res) => {
  let product = req.body;
  const id = parseInt(req.params.id);

  if (id) {
    // get existing product
    const productToUpdate = fetchProductsFromDatabase().filter(
      (p) => p.id == id
    );

    console.log("----- in api put method");
    console.log(product);

    if (productToUpdate) {
      // with patch, if a field is not in the body the existing product's field will not
      // be changed

      product.name ? (productToUpdate[0].name = product.name) : null;
      product.description
        ? (productToUpdate[0].description = product.description)
        : null;
      product.price ? (productToUpdate[0].price = product.price) : null;
      product.region ? (productToUpdate[0].region = product.region) : null;
      product.weight ? (productToUpdate[0].weight = product.weight) : null;
      product.flavor_profile
        ? (productToUpdate[0].flavor_profile = product.flavor_profile)
        : null;
      product.grind_option
        ? (productToUpdate[0].grind_option = product.grind_option)
        : null;
      product.roast_level
        ? (productToUpdate[0].roast_level = product.roast_level)
        : null;

      return res.status(200).json({
        success: true,
        message: "Coffee updated (patch) successfully",
        update: productToUpdate[0],
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Coffee not found" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
});

// delete product
app.delete("/api/:id", (req, res) => {
  const id = parseInt(req.params.id);

  if (id) {
    // get existing product
    const productToDelete = fetchProductsFromDatabase().filter(
      (p) => p.id == id
    );

    console.log("----- in api put method");
    // console.log(product);

    if (productToDelete) {
      return res.status(200).json({
        success: true,
        message: "Coffee has been deleted",
        coffee: productToDelete,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Coffee not found" });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
});

function fetchProductsFromDatabase() {
  return [
    {
      id: 1,
      name: "Signature Blend",
      description:
        "A rich, full-bodied coffee with notes of dark chocolate and black cherry. Grown on the slopes of a mist-covered mountain in Centeral America.",
      price: 12.99,
      region: "Central America",
      weight: 500,
      flavor_profile: ["Dark Chocolate", "Black Cherry"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 3,
      image_url: "http://localhost:8081/images/signature_blend.png"
    },
    {
      id: 2,
      name: "Golden Sunrise",
      description:
        "A smooth and bright coffee with a citrusy kick. Sourced from the rolling hills of Africa.",
      price: 10.99,
      region: "Africa",
      weight: 500,
      flavor_profile: ["Citrus"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 2,
      image_url: "http://localhost:8081/images/golden_sunrise.png"
    },
    {
      id: 3,
      name: "Rainforest Rhapsody",
      description:
        "An earthy and comples coffee with notes of toasted nuts and caramel. Sustainably grown in the forests of South America.",
      price: 14.99,
      region: "South America",
      weight: 500,
      flavor_profile: ["Citrus"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 2,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 4,
      name: "Harvest Moon",
      description:
        "A smooth and earthy blend with notes of cocoa and hazelnut.",
      price: 9.99,
      region: "Central America",
      weight: 500,
      flavor_profile: ["Cocoa", "Hazelnut"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 3,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 5,
      name: "Wildfire",
      description:
        "A bold and smoky blend with notes of chocolate and molasses.",
      price: 12.99,
      region: "Africa",
      weight: 500,
      flavor_profile: ["Dark Chocolate", "Molasses"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 5,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 6,
      name: "Walnut Wonder",
      description:
        "A smooth and nutty coffee from the slopes of South America",
      price: 9.99,
      region: "South America",
      weight: 500,
      flavor_profile: ["Nutty", "Smooth"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 3,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 7,
      name: "Breezy Beans",
      description:
        "This coffee blend is made from beans sourced from Honduras and Costa Rica. It is a light roast coffee with a bright and citrusy flavor profile. It is perfect for pour-over and drop coffee brewing methods.",
      price: 11.99,
      region: "Central America",
      weight: 500,
      flavor_profile: ["Citrusy"],
      grind_option: ["Whole Bean", "Filter"],
      roast_level: 1,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 8,
      name: "Indo-Viet Roast",
      description:
        "This coffee blend is made from beans sourced from Indonesia and Vietnam. It is a medium-dark roast coffee with a spicy and earthy flavor profile, with notes of cinnamon and clove. It is perfect for drip and French press brewing methods.",
      price: 13.99,
      region: "Asia Pacific",
      weight: 500,
      flavor_profile: ["Spicy", "Earthy", "Cinnamon", "Clove"],
      grind_option: ["Whole Bean", "Filter", "French press"],
      roast_level: 4,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 11,
      name: "Andean Almond",
      description:
        "A smooth and mellow coffee from the mountains of South America, with hints of almond and toffee.",
      price: 10.99,
      region: "South America",
      weight: 500,
      flavor_profile: ["Almond", "Toffee"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter"],
      roast_level: 3,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 12,
      name: "Savanna Noir",
      description:
        "A bold and rich coffee from the African savanna, with notes of dark chocolate and blackcurrent.",
      price: 12.99,
      region: "Africa",
      weight: 500,
      flavor_profile: ["Dark Chocolate", "Blackcurrent"],
      grind_option: ["Whole Bean", "Filter", "Espresso"],
      roast_level: 4,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 14,
      name: "Arabian Nights",
      description:
        "A bold and spicy coffee from the Middle East, with notes of cardamom and cinnamon",
      price: 13.99,
      region: "Middle East",
      weight: 500,
      flavor_profile: ["Cardamon", "Cinnamon"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 1,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 16,
      name: "Himalayan Heights",
      description:
        "Grown on the steep slopes of the Himalayan Mountains, this coffee is known for its bright acidity and delicate floral notes. This light roast is perfect for those who prefer a more delicate flavor profile.",
      price: 12.99,
      region: "Asia Pacific",
      weight: 500,
      flavor_profile: ["Floral", "Citrus", "Honey"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 1,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 17,
      name: "Sumatra Blend",
      description:
        "Get your day started with the bold and earthy flavors of Sumatra. Grown on the lush tropical slopes of the Gayo Highlands, this coffee is known for its full body, low acidity, and notes of dark chocolate and smoke.",
      price: 8.99,
      region: "Asia Pacific",
      weight: 500,
      flavor_profile: ["Dark Chocolate", "Smoke"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 5,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
    {
      id: 18,
      name: "Bali Bliss",
      description:
        "Escape to the tropical paradise of Bali with this smooth and mellow blend. Grown on small family farms, this coffee is shade-grown and handpicked for a rich and nuanced flavor profile. Notes of milk chocolate, hazelnut, and a hint of tropical fruit.",
      price: 11.99,
      region: "Asia Pacific",
      weight: 500,
      flavor_profile: ["Milk Chocolate", "Hazelnut", "Tropical Fruit"],
      grind_option: ["Whole Bean", "Cafetiere", "Filter", "Espresso"],
      roast_level: 3,
      image_url: "http://localhost:8081/images/rainforest_rhapsody.png"
    },
  ];
}

app.listen(8081, () => console.log("API Server listening on port 8081!"));
