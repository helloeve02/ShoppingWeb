package wallet

import (
	"net/http"
	//"time"
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

func GetWallet(c *gin.Context) {
	// Get the database connection
	db := config.DB()

	// Fetch all cart items
	var wallet []entity.Wallets
	if err := db.Preload("User").Find(&wallet).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch cart items"})
		return
	}

	// Return the cart items
	c.JSON(http.StatusOK, wallet)
}


func GetWalletByID(c *gin.Context) {
    // Get the database connection
    db := config.DB()

    // Get the User ID from the URL parameter
    id := c.Param("id")

    // Fetch all cart items for the user
    var wallet []entity.Wallets
    if err := db.Where("user_id = ?", id).
		Preload("User").
        // Preload("Product.ProductImages").
        Find(&wallet).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No wallet found for this user"})
        return
    }

    // Return the list of cart items
    c.JSON(http.StatusOK, wallet)
}

func CreateWallet(c *gin.Context) {
    var wallet entity.Wallets  // รับข้อมูลเป็น array ของ OrderItems
    db := config.DB()

    // รับข้อมูล JSON จาก client
    if err := c.ShouldBindJSON(&wallet); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ใช้ GORM สร้างหลายรายการคำสั่งซื้อ
    if err := db.Create(&wallet).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "wallet created successfully",
        "wallet": wallet,  // ส่งคืนรายการคำสั่งซื้อที่ถูกสร้าง
    })
}



func DeleteWallet(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM wallets WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func UpdateWalletByID(c *gin.Context) {
	var wallet entity.Wallets
	ID := c.Param("id")
	db := config.DB()

	// ตรวจสอบว่ามี wallet ที่ตรงกับ ID หรือไม่
	result := db.Where("user_id = ?", ID).First(&wallet)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found"})
		return
	}

	// ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา
	if err := c.ShouldBindJSON(&wallet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// บันทึกข้อมูลที่อัปเดตลงในฐานข้อมูล
	result = db.Save(&wallet)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update wallet"})
		return
	}

	// ส่งผลลัพธ์กลับไปเมื่อสำเร็จ
	c.JSON(http.StatusOK, gin.H{
		"message": "Wallet updated successfully",
		"wallet":  wallet,
	})
}
