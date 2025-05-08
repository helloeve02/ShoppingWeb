package shipping

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"log"
)

func GetShipping(c *gin.Context) {
    // Get the database connection
    db := config.DB()

    // Check if the DB connection is valid
    if db == nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
        return
    }

    // Fetch all shipping records
    var shipping []entity.Shipping
    if err := db.Preload("ShippingStatus").Find(&shipping).Error; err != nil {
        log.Printf("Error fetching shipping: %v", err) // Log error for debugging
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch shipping"})
        return
    }

    // Return the shipping records
    c.JSON(http.StatusOK, shipping)
}
