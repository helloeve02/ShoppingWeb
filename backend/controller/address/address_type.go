package address


import (

   "net/http"

   "github.com/sut67/team17/config"

   "github.com/sut67/team17/entity"

   "github.com/gin-gonic/gin"

)


func GatAll(c *gin.Context) {
	// Get the database connection
	db := config.DB()

	// Fetch all cart items
	var types []entity.AddressType
	if err := db.Find(&types).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch cart items"})
		return
	}

	// Return the cart items
	c.JSON(http.StatusOK, types)
}



