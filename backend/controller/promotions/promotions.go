package promotions

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"gorm.io/gorm"
	"fmt"
)

func CreatePromotion(c *gin.Context) {
    var promotion entity.Promotions
    var promotionProducts []entity.PromotionProducts
    var userPromotions []entity.UserPromotions

    // Bind the incoming request JSON data to the Promotions struct
    if err := c.ShouldBindJSON(&promotion); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    db := config.DB()

    // Save the promotion record directly
    if err := db.Create(&promotion).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create promotion"})
        return
    }

    // Create associated PromotionProducts records if not exist
    for _, product := range promotion.Products {
        var existingPromotionProduct entity.PromotionProducts
        if err := db.Where("promotion_id = ? AND product_id = ?", promotion.ID, product.ProductID).First(&existingPromotionProduct).Error; err != nil {
            if err == gorm.ErrRecordNotFound { // If no record found, create a new one
                promotionProduct := entity.PromotionProducts{
                    ProductID:   product.ProductID,
                    PromotionID: promotion.ID,
                    DiscountValue: product.DiscountValue,
                }
                promotionProducts = append(promotionProducts, promotionProduct)
            } else {
                c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to check existing promotion product: %v", err)})
                return
            }
        }
    }

    // Insert PromotionProducts in batch to reduce database calls
    if len(promotionProducts) > 0 {
        if err := db.CreateInBatches(promotionProducts, 100).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create promotion products"})
            return
        }
    }

    // Create associated UserPromotions records if not exist
    for _, user := range promotion.Users {
        var existingUserPromotion entity.UserPromotions
        if err := db.Where("promotion_id = ? AND user_id = ?", promotion.ID, user.UserID).First(&existingUserPromotion).Error; err != nil {
            if err == gorm.ErrRecordNotFound { // If no record found, create a new one
                userPromotion := entity.UserPromotions{
                    UserID:      user.UserID,
                    PromotionID: promotion.ID,
                    UsageCount:  0,
                }
                userPromotions = append(userPromotions, userPromotion)
            } else {
                c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to check existing user promotion: %v", err)})
                return
            }
        }
    }

    // Insert UserPromotions in batch to reduce database calls
    if len(userPromotions) > 0 {
        if err := db.CreateInBatches(userPromotions, 100).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user promotions"})
            return
        }
    }

    // Return success response with the created promotion's ID
    c.JSON(http.StatusCreated, gin.H{
        "message":     "Promotion created successfully",
        "promotion_id": promotion.ID,
    })
}

func UpdatePromotion(c *gin.Context) {
	var promotion entity.Promotions
	var updatedPromotion entity.Promotions

	// Receive the promotion ID from the URL
	id := c.Param("id")

	// Connect to the database
	db := config.DB()

	// Start Transaction
	tx := db.Begin()
	if tx.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	// Rollback transaction in case of panic or errors
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "An unexpected error occurred"})
		}
	}()

	// Find the Promotion by ID
	if err := tx.First(&promotion, id).Error; err != nil {
		tx.Rollback()
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error finding promotion"})
		}
		return
	}

	// Bind the incoming JSON data for updating the promotion
	if err := c.ShouldBindJSON(&updatedPromotion); err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Update the promotion's core fields
	promotion.PromotionName = updatedPromotion.PromotionName
	promotion.Description = updatedPromotion.Description
	promotion.DiscountType = updatedPromotion.DiscountType
	promotion.DiscountValue = updatedPromotion.DiscountValue
	promotion.StartDate = updatedPromotion.StartDate
	promotion.EndDate = updatedPromotion.EndDate
	promotion.UsageLimit = updatedPromotion.UsageLimit

	// Update promotion_status_id if provided
	if updatedPromotion.PromotionStatusID > 0 {
		promotion.PromotionStatusID = updatedPromotion.PromotionStatusID
	}

	// Save the updated promotion
	if err := tx.Save(&promotion).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update promotion"})
		return
	}

	// Handle Products
	if updatedPromotion.Products != nil {
		if len(updatedPromotion.Products) == 0 {
			// Remove all associated products if the list is empty
			if err := tx.Where("promotion_id = ?", promotion.ID).Delete(&entity.PromotionProducts{}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove products from promotion"})
				return
			}
		} else {
			// Remove products that are no longer part of the updated list
			productIDs := make([]uint, 0)
			for _, product := range updatedPromotion.Products {
				if product.ProductID > 0 {
					productIDs = append(productIDs, product.ProductID)
				}
			}

			if err := tx.Where("promotion_id = ? AND product_id NOT IN (?)", promotion.ID, productIDs).
				Delete(&entity.PromotionProducts{}).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove outdated promotion products"})
				return
			}

			// Add new products or update existing ones
			for _, product := range updatedPromotion.Products {
				if product.ProductID == 0 {
					continue // Skip invalid product IDs
				}

				// Use `tx.Where().Assign()` for upsert-like behavior
				newPromotionProduct := entity.PromotionProducts{
					PromotionID:   promotion.ID,
					ProductID:     product.ProductID,
					DiscountValue: promotion.DiscountValue,
				}

				// Insert the new record if it doesn't exist, otherwise update
				if err := tx.Where("promotion_id = ? AND product_id = ?", promotion.ID, product.ProductID).
					Assign(newPromotionProduct).FirstOrCreate(&newPromotionProduct).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add or update product in promotion"})
					return
				}
			}
		}
	}

	// Handle Users (optional)
	if updatedPromotion.Users != nil {
		if err := tx.Where("promotion_id = ?", promotion.ID).Delete(&entity.UserPromotions{}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove existing users from promotion"})
			return
		}

		for _, user := range updatedPromotion.Users {
			newUserPromotion := entity.UserPromotions{
				UserID:      user.UserID,
				PromotionID: promotion.ID,
				UsageCount:  0,
			}
			if err := tx.Create(&newUserPromotion).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add user to promotion"})
				return
			}
		}
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	// Send confirmation response
	c.JSON(http.StatusOK, gin.H{"message": "Promotion updated successfully"})
}

func GetAllPromotion(c *gin.Context) {
	var promotions []entity.Promotions

	db := config.DB()

	if err := db.Find(&promotions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch promotions"})
		return
	}

	c.JSON(http.StatusOK, promotions)
}

func DeletePromotion(c *gin.Context) {
    id := c.Param("id")
    var promotion entity.Promotions

    db := config.DB()

    // Find the promotion with the given id
    if err := db.Where("id = ?", id).First(&promotion).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Promotion not found"})
        return
    }

    // Soft delete related PromotionProducts
    if err := db.Where("promotion_id = ?", id).Delete(&entity.PromotionProducts{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to soft delete promotion products"})
        return
    }

    // Soft delete related UserPromotions
    if err := db.Where("promotion_id = ?", id).Delete(&entity.UserPromotions{}).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to soft delete user promotions"})
        return
    }

    // Soft delete the promotion itself
    if err := db.Delete(&promotion).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to soft delete promotion"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Promotion and its related records successfully soft deleted"})
}

func GetPromotionByID(c *gin.Context) {
	id := c.Param("id")

	var promotion entity.Promotions

	db := config.DB()

	// Fetch the promotion from the database by ID, along with related products (PromotionProducts) and promotion status
	if err := db.Preload("Products").Preload("PromotionStatus").First(&promotion, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"message": "Promotion not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Error fetching promotion", "error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, promotion)
}
