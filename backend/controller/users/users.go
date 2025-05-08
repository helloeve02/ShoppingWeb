package users

import (
	"net/http"
	"github.com/sut67/team17/entity"
	"github.com/sut67/team17/config"
	"github.com/gin-gonic/gin"
	"errors"  // เพิ่ม import สำหรับ package errors
	"gorm.io/gorm" // เพิ่ม import สำหรับ gorm
)

// POST /users
func CreateUser(c *gin.Context) {
	var user entity.Users

	// bind เข้าตัวแปร user
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()


	// เข้ารหัสลับรหัสผ่านที่ผู้ใช้กรอกก่อนบันทึกลงฐานข้อมูล
	hashedPassword, _ := config.HashPassword(user.Password)

	// สร้าง User
	u := entity.Users{
		Email: user.Email, 
		UserName:  user.UserName,  
		Password:  hashedPassword,     
		Role:  "User",
		FirstName:  "ไม่ได้ระบุ",
		LastName:  "ไม่ได้ระบุ",
		Phone:  "ไม่ได้ระบุ",
		Seller: true,
	}

	// บันทึก
	if err := db.Create(&u).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": u})
}


// GET /user/:id
func GetUserByID(c *gin.Context) {
    ID := c.Param("id")
	var user entity.Users

    db := config.DB() // Assuming you have a function to get the DB connection

    // Query the user by ID
    results := db.Preload("Gender").
	Preload("Wallets").
	Preload("Order").
	Preload("Cartitem").
	Preload("Orderitem").
	Preload("Product").
	Preload("HelpCenters").
	Preload("Favorites").
	Preload("Reviews").
	Where("id = ?", ID).First(&user)
    if results.Error != nil {
        if errors.Is(results.Error, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": results.Error.Error()})
        }
        return
    }

    // Return the user data as JSON
    c.JSON(http.StatusOK, user)
}

// GET /users
func ListUsers(c *gin.Context) {

	// Define a slice to hold user records
	var users []entity.Users

	// Get the database connection
	db := config.DB()

	// Query the user table for basic user data
	results := db.Select("id, email, user_name, password, role, first_name, last_name ,seller , phone").Find(&users)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, users)
}


// DELETE /users/:id
func DeleteUser(c *gin.Context) {

	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM users WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})

}

// PATCH /users
func UpdateUser(c *gin.Context) {
	var user entity.Users

	UserID := c.Param("id")

	db := config.DB()
	result := db.First(&user, UserID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&user)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// PUT update user ใช้อันนี้นะจ๊ะ
func UpdateUserByid(c *gin.Context) {


	var user entity.Users
 
 
	UserID := c.Param("id")
 
 
	db := config.DB()
 
	result := db.First(&user, UserID)
 
	if result.Error != nil {
 
		c.JSON(http.StatusNotFound, gin.H{"error": "NameUser not found"})
 
		return
 
	}
 
 
	if err := c.ShouldBindJSON(&user); err != nil {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
 
		return
 
	}
 
 
	result = db.Save(&user)
 
	if result.Error != nil {
 
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
 
		return
 
	}
 
 
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
 
 }