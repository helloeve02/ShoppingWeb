package users

import (
	"errors"
	"net/http"
	"regexp"
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"github.com/sut67/team17/services"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type (
	Authen struct {
		UserName string
		Password string
	}

	signUp struct {
		UserName string
		Email    string
		Password string
	}

	ResetPassword struct {
		UserName string
		Email    string
		Password string
	}

	ChangePassword struct {
		UserID  uint
		Password string
		NewPassword string
	}
)

func ResetPasswordUser(c *gin.Context) {
	var payload ResetPassword
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user entity.Users
	db := config.DB()

	// ค้นหาผู้ใช้ด้วย Username และ Email
	result := db.Where("user_name = ? AND email = ?", payload.UserName, payload.Email).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	// แฮชรหัสผ่านใหม่
	hashedPassword, err := config.HashPassword(payload.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// อัปเดตรหัสผ่านในฐานข้อมูล
	user.Password = hashedPassword
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}

func SignUp(c *gin.Context) {
	var payload signUp
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบความถูกต้องของ username
	if !isValidUserName(payload.UserName) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid username format"})
		return
	}

	db := config.DB()
	var userCheck entity.Users


	if userCheck.ID != 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Username is already registered"})
		return
	}

	// แฮชรหัสผ่าน
	hashedPassword, err := config.HashPassword(payload.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// สร้างผู้ใช้ใหม่
	user := entity.Users{
		Email:     payload.Email,
		UserName:  payload.UserName,
		Password:  hashedPassword,
		Role:      "User",
		FirstName: "",
		LastName:  "",
		Phone:     "",
		Seller:    true,
	}

	// บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Sign-up successful"})
}

func isValidUserName(username string) bool {
	match, _ := regexp.MatchString("^[a-zA-Z0-9_]{3,}$", username)
	return match
}


// Sign-in (Login)
func SignIn(c *gin.Context) {
    var payload Authen
    var user entity.Users

    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหา user ด้วย Username ที่กรอก
    if err := config.DB().Where("user_name = ?", payload.UserName).First(&user).Error; err != nil {
        if errors.Is(err, gorm.ErrRecordNotFound) {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query error"})
        }
        return
    }

    // ตรวจสอบรหัสผ่าน
    err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password))
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Password is incorrect"})
        return
    }

    // สร้าง JWT Token
    jwtWrapper := services.JwtWrapper{
        SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
        Issuer:          "AuthService",
        ExpirationHours: 24,
    }

    signedToken, err := jwtWrapper.GenerateToken(user.Email)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error signing token"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token_type": "Bearer",
        "token":      signedToken,
        "id":         user.ID,
		"role":       user.Role,
		"seller":     user.Seller,
    })
}

func ChangePasswordUser(c *gin.Context) {
	var payload ChangePassword
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user entity.Users
	db := config.DB()

	// ค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ UserID
	result := db.Where("id = ?", payload.UserID).First(&user)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		}
		return
	}

	// ตรวจสอบรหัสผ่านเก่า
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect old password"})
		return
	}

	// แฮชรหัสผ่านใหม่
	hashedNewPassword, err := config.HashPassword(payload.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password"})
		return
	}

	// อัปเดตรหัสผ่านใหม่ในฐานข้อมูล
	user.Password = hashedNewPassword
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}