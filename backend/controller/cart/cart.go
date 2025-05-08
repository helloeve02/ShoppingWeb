package cart

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
    "fmt"
)

// POST /Collections
func CreateCart(c *gin.Context) {
    var cartItem entity.CartItems

    // Bind JSON to struct
    if err := c.ShouldBindJSON(&cartItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input: " + err.Error()})
        return
    }

    // Validate that Quantity is greater than 0
    if cartItem.Quantity <= 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity must be greater than 0"})
        return
    }

    db := config.DB()
    tx := db.Begin() // Start a new transaction

    // Ensure the transaction is committed or rolled back properly
    defer func() {
        if r := recover(); r != nil {
            tx.Rollback() // Rollback if panic occurs
        }
    }()

    // Check if the product exists
    var product entity.Products
    if err := tx.First(&product, cartItem.ProductID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    // Check if the user exists
    var user entity.Users
    if err := tx.First(&user, cartItem.UserID).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Check if the cart item already exists, including soft-deleted items
    var existingCartItem entity.CartItems
    if err := tx.Where("user_id = ? AND product_id = ? AND deleted_at IS NULL", cartItem.UserID, cartItem.ProductID).First(&existingCartItem).Error; err == nil {
        // If item exists, update the quantity
        existingCartItem.Quantity += cartItem.Quantity
        if err := tx.Save(&existingCartItem).Error; err != nil {
            tx.Rollback()
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
            return
        }

        // Log successful update
        tx.Commit()
        c.JSON(http.StatusOK, gin.H{"message": "Cart updated successfully", "data": existingCartItem})
        return
    }

    // If no existing cart item, create a new one
    if err := tx.Create(&cartItem).Error; err != nil {
        tx.Rollback()
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart item"})
        return
    }

    // Log successful creation
    tx.Commit()
    c.JSON(http.StatusCreated, gin.H{"message": "Cart item created successfully", "data": cartItem})
}


// func GetCartitem(c *gin.Context) {
// 	type CartItemWithProduct struct {
// 		ID            uint    `json:"id"`
// 		Quantity      int     `json:"quantity"`
// 		Price         float64 `json:"price"`
// 		TotalPrice    float64 `json:"total_price"`
// 		UserID        uint    `json:"user_id"`
// 		UserName      string  `json:"user_name"`
// 		ProductID     uint    `json:"product_id"`
// 		ProductName   string  `json:"product_name"`
// 		ProductDesc   string  `json:"product_description"`
// 		ProductPrice  float64 `json:"product_price"`
// 		ProductStock  uint    `json:"product_stock"`
// 	}

// 	var cartItems []CartItemWithProduct
// 	db := config.DB()

// 	query := db.Table("cart_items").
// 		Select(`
// 			cart_items.id,
// 			cart_items.quantity,
// 			cart_items.price,
// 			(cart_items.quantity * cart_items.price) as total_price,
// 			cart_items.user_id,
// 			users.first_name as user_name,
// 			products.id as product_id,
// 			products.products_name as product_name,
// 			products.description as product_description,
// 			products.price as product_price,
// 			products.stock as product_stock
// 		`).
// 		Joins("LEFT JOIN users ON users.id = cart_items.user_id").
// 		Joins("LEFT JOIN products ON products.id = cart_items.product_id").
// 		Scan(&cartItems)

// 	if query.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch cart items", "details": query.Error.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{
// 		"data":  cartItems,
// 		"count": len(cartItems),
// 	})
// }

// // mmm
// func GetCartItemByID(c *gin.Context) {
// 	// Get the CartItem ID from the request parameters
// 	CartitemID := c.Param("id")

// 	// Define the structure to hold the query results
// 	type CartItem struct {
// 		ID         uint
// 		Quantity   int
// 		Price      float64
// 		TotalPrice float64
// 	}

// 	var cartItem CartItem

// 	// Get the database connection
// 	db := config.DB()

// 	// Query the CartItems table, including necessary joins if needed
// 	result := db.Table("cart_items").
// 		Select("cart_items.id, cart_items.quantity, cart_items.price, (cart_items.quantity * cart_items.price) as total_price").
// 		Joins("JOIN products ON cart_items.products_id = products.id").
// 		Where("cart_items.id = ?", CartitemID).
// 		Scan(&cartItem)

// 	// Check for errors in the query
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found: " + result.Error.Error()})
// 		return
// 	}

// 	// Return the results as JSON
// 	c.JSON(http.StatusOK, cartItem)
// }

func UpdateCart(c *gin.Context) {
	type UpdateCartPayload struct {
		Quantity int 
	}

	var payload UpdateCartPayload
	CartItemID := c.Param("id")

	db := config.DB()
	tx := db.Begin() // เริ่ม Transaction
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var cartItem entity.CartItems
	result := tx.First(&cartItem, CartItemID)
	if result.Error != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item ID not found"})
		return
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
		return
	}

	cartItem.Quantity = payload.Quantity
	if err := tx.Save(&cartItem).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart item"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Update successful", "data": cartItem})
}

func DeleteCartitem(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	result := db.Where("id = ?", id).Delete(&entity.CartItems{})

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Cart item not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func GetCartitem(c *gin.Context) {
	// Get the database connection
	db := config.DB()

	// Fetch all cart items
	var cartItems []entity.CartItems
	if err := db.Preload("Product").Preload("User").
	Preload("Product.ProductImages").Find(&cartItems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch cart items"})
		return
	}

	// Return the cart items
	c.JSON(http.StatusOK, cartItems)
}

// GetCartItemByID fetches a cart item by its ID
// func GetCartItemByID(c *gin.Context) {
// 	// Get the database connection
// 	db := config.DB()

// 	// Get the CartItem ID from the URL parameter
// 	id := c.Param("id")

// 	// Fetch the cart items by ID
// 	var cartItems []entity.CartItems
// 	if err := db.Preload("Product").
// 		Preload("User").
// 		Preload("Product.ProductImages").
// 		Where("id = ?", id).Find(&cartItems).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Cart items not found"})
// 		return
// 	}

// 	// Return the cart items
// 	c.JSON(http.StatusOK, cartItems)
// }


func GetCartItemByID(c *gin.Context) {
    // Get the database connection
    db := config.DB()

    // Get the User ID from the URL parameter
    id := c.Param("id")

    // Fetch all cart items for the user
    var cartItems []entity.CartItems
    if err := db.Where("user_id = ?", id).
        Preload("Product").
		Preload("User").
        Preload("Product.ProductImages").
        Find(&cartItems).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No cart items found for this user"})
        return
    }

    // Return the list of cart items
    c.JSON(http.StatusOK, cartItems)
}

func DeleteCartitemByProductID(c *gin.Context) {
    productID := c.Param("productID") // Get productID from URL parameter
    id := c.Param("id")
    db := config.DB()
    fmt.Println("productID:", productID, "id:", id)


    // Correct the query syntax and use a 'Where' clause properly
    result := db.Where("user_id = ? AND product_id = ?", id, productID).Delete(&entity.CartItems{}) // Adjust 'userID' to match your logic

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Cart item with the specified product ID not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

