package products

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
    "gorm.io/gorm"
    "strconv"
)

func CreateProduct(c *gin.Context) {
    var product entity.Products

    // Bind JSON data
    if err := c.ShouldBindJSON(&product); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data", "details": err.Error()})
        return
    }

    // Create database connection
    db := config.DB()

    // Validate required fields
    if product.CategoryID == 0 || product.UserID == 0 || product.ProductStatusID == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Category, User, and Product Status fields must have valid IDs"})
        return
    }

    // If BrandID is provided, validate it
    if product.BrandID != 0 {
        var brand entity.Brands
        if err := db.First(&brand, product.BrandID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Brand not found"})
            return
        }
    }

    // Validate Category
    var category entity.Categories
    if err := db.First(&category, product.CategoryID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
        return
    }

    // Validate User
    var user entity.Users
    if err := db.First(&user, product.UserID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Validate Product Status
    var productStatus entity.ProductStatus
    if err := db.First(&productStatus, product.ProductStatusID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product status not found"})
        return
    }

    // Validate product details
    if product.ProductsName == "" || product.Price <= 0 || product.Stock < 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product details"})
        return
    }

    // Create the product record
    p := entity.Products{
        ProductsName:    product.ProductsName,
        Description:     product.Description,
        Price:           product.Price,
        Stock:           product.Stock,
        BrandID:         product.BrandID, // This may be 0
        ProductStatusID: product.ProductStatusID,
        UserID:          product.UserID,
        CategoryID:      product.CategoryID,
    }

    // Save the product to the database
    if err := db.Create(&p).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product", "details": err.Error()})
        return
    }

    // Save the product images if provided
    if len(product.ProductImages) > 0 {
        for _, img := range product.ProductImages {
            img.ProductID = p.ID // Link the image to the created product

            // Ensure the image is a valid Base64 string before saving
            if img.Image == "" {
                c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image data"})
                return
            }

            if err := db.Create(&img).Error; err != nil {
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save product image", "details": err.Error()})
                return
            }
        }
    }

    // Return success response
    c.JSON(http.StatusCreated, gin.H{
        "message":    "Product created successfully",
        "product_id": p.ID,
    })
}

func processBase64Image(image string) string {

    if image == "" {
        return ""
    }

    mimeType := "image/jpeg"
    if len(image) > 20 && image[:20] == "iVBORw0KGgo" {
        mimeType = "image/png"
    }

    return "data:" + mimeType + ";base64," + image
}

func UpdateProduct(c *gin.Context) {
    var productInput entity.Products

    // Get product ID from the URL parameters
    productID := c.Param("id")
    if productID == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Product ID is required"})
        return
    }

    // Bind the input JSON to the productInput struct
    if err := c.ShouldBindJSON(&productInput); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data", "details": err.Error()})
        return
    }

    // Create a database connection
    db := config.DB()

    // Find the existing product
    var existingProduct entity.Products
    if err := db.First(&existingProduct, productID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    // Update product details
    existingProduct.ProductsName = productInput.ProductsName
    existingProduct.Description = productInput.Description
    existingProduct.Price = productInput.Price
    existingProduct.Stock = productInput.Stock
    existingProduct.BrandID = productInput.BrandID
    existingProduct.CategoryID = productInput.CategoryID
    existingProduct.ProductStatusID = productInput.ProductStatusID

    // Validate Category
    if productInput.CategoryID != 0 {
        var category entity.Categories
        if err := db.First(&category, productInput.CategoryID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Category not found"})
            return
        }
    }

    // Validate Brand (if provided)
    if productInput.BrandID != 0 {
        var brand entity.Brands
        if err := db.First(&brand, productInput.BrandID).Error; err != nil {
            c.JSON(http.StatusNotFound, gin.H{"error": "Brand not found"})
            return
        }
    }

    // Save updated product details
    if err := db.Save(&existingProduct).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product", "details": err.Error()})
        return
    }

    // Update product images
    if len(productInput.ProductImages) > 0 {
        // Remove existing images for this product
        if err := db.Where("product_id = ?", productID).Delete(&entity.ProductImages{}).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete existing product images", "details": err.Error()})
            return
        }

        // Add new images
        for _, img := range productInput.ProductImages {
            if len(img.Image) > 0 {
                // Ensure the image string does not contain "data:image/...;base64,"
                if len(img.Image) > 22 && (img.Image[:22] == "data:image/jpeg;base64," || img.Image[:22] == "data:image/png;base64,") {
                    img.Image = img.Image[22:]
                }

                img.ProductID = existingProduct.ID
                if err := db.Create(&img).Error; err != nil {
                    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save product image", "details": err.Error()})
                    return
                }
            }
        }
    }

    // Return success response
    c.JSON(http.StatusOK, gin.H{
        "message": "Product updated successfully",
        "product": existingProduct,
    })
}

func GetAllProducts(c *gin.Context) {
    var products []entity.Products

    result := config.DB().
        Preload("ProductImages").
        Preload("Reviews").
        Find(&products)

    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }

    if len(products) == 0 {
        c.JSON(http.StatusOK, gin.H{"message": "No products found"})
        return
    }

    c.JSON(http.StatusOK, products)
}

func DeleteProduct(c *gin.Context) {
    // Extract the product ID from URL parameters
    productIDParam := c.Param("id")
    productID, err := strconv.Atoi(productIDParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    db := config.DB()
    
    // Check if the product exists in the database
    var product entity.Products
    result := db.First(&product, productID)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        }
        return
    }
    
    // Soft delete related product images (if necessary)
    var productImages []entity.ProductImages
    if err := db.Where("product_id = ?", productID).Find(&productImages).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find product images", "details": err.Error()})
        return
    }
    
    for _, img := range productImages {
        // Soft delete the product image
        if err := db.Delete(&img).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product image", "details": err.Error()})
            return
        }
    }
    
    // Soft delete the product
    if err := db.Delete(&product).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to soft delete product", "details": err.Error()})
        return
    }
    
    // Return success response
    c.JSON(http.StatusOK, gin.H{
        "message":    "Product soft deleted successfully",
        "product_id": productID,
    })
}

func GetProductByID(c *gin.Context) {
    // Extract product ID from URL parameters
    productIDParam := c.Param("id")
    productID, err := strconv.Atoi(productIDParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }
    
    // Create a database connection
    db := config.DB()
    
    // Query the database for the product by ID, preloading related entities
    var product entity.Products
    result := db.Preload("ProductImages").First(&product, productID)
    
    // Handle errors (e.g., product not found)
    if result.Error != nil {
        if result.Error == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
            } else {
                c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        }
        return
    }

    // Process base64 image data for ProductImages if available
    for i := range product.ProductImages {
        if product.ProductImages[i].Image != "" {
            mimeType := "image/jpeg" // Default to JPEG
            if len(product.ProductImages[i].Image) > 20 && product.ProductImages[i].Image[:20] == "iVBORw0KGgo" {
                mimeType = "image/png" // Adjust for PNG
            }
            product.ProductImages[i].Image = "data:" + mimeType + ";base64," + product.ProductImages[i].Image
        }
    }
    
    // Return the product details as a JSON response
    c.JSON(http.StatusOK, product)
}

func GetProductsByUserID(c *gin.Context) {
    var products []entity.Products

    // Extract and validate user ID from URL parameters
    userIDParam := c.Param("id")
    userID, err := strconv.Atoi(userIDParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    // Check if the user exists in the database
    var user entity.Users
    if err := config.DB().First(&user, userID).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user data", "details": err.Error()})
        }
        return
    }

    // Query the database for products related to the user by user_id
    result := config.DB().
        Where("user_id = ?", userID).  // Ensure filtering by user_id
        Preload("Promotions").
        Preload("CartItems").
        Preload("OrderItems").
        Preload("ProductImages").
        Find(&products)

    // Handle potential errors from database query
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve products", "details": result.Error.Error()})
        return
    }

    // If no products found, return a specific message
    if len(products) == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No products found for this user"})
        return
    }

    // Process base64 image data for each product's images if available
    for i := range products {
        // Include product ID in the response explicitly if not already there
        for j, img := range products[i].ProductImages {
            // Process each image to send both base64 and URL link
            processedImage := processImage(img.Image)
            products[i].ProductImages[j].Image = processedImage
        }
    }

    // Return the products with processed data as a JSON response
    c.JSON(http.StatusOK, products)
}

// Process image to return a string (either Base64 or URL)
func processImage(image string) string {
    // Check if the image is Base64 encoded
    if len(image) > 0 && image[:5] == "data:" {
        return image // Return as Base64
    } else {
        return image // Return as URL
    }
}
