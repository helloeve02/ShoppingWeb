package payment

import (
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
)

// POST /payments
func CreatePayment(c *gin.Context) {
	var paymentInput struct {
		Amount          float64 `form:"Amount" binding:"required,min=50"`   // Amount is required
		PaymentDate     string  `form:"PaymentDate" binding:"required"`     // PaymentDate is required
		PayerName       string  `form:"PayerName" binding:"required"`       // PayerName is required
		UserID          uint    `form:"UserID" binding:"required"`          // UserID is required
		PaymentStatusID uint    `form:"PaymentStatusID" binding:"required"` // PaymentStatusID is required
		// TransactionsID  uint    `form:"TransactionsID" binding:"required"`  // TransactionsID is required
	}

	// Bind form data to the struct
	if err := c.ShouldBind(&paymentInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse PaymentDate
	paymentDate, err := time.Parse("2006-01-02T15:04:05", paymentInput.PaymentDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use ISO 8601 format (e.g., 2025-01-07T12:00:00)"})
		return
	}

	// Handle file upload
	file, err := c.FormFile("file") // Matches the `formData.append("file", file)` from the frontend
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Payment image is required"})
		return
	}

	// Validate file type and size
	if file.Size > 2*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image must be smaller than 2MB"})
		return
	}
	if file.Header.Get("Content-Type") != "image/jpeg" && file.Header.Get("Content-Type") != "image/png" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only JPG and PNG images are allowed"})
		return
	}

	// Generate a unique filename using a timestamp
	timestamp := time.Now().UnixNano()
	uniqueFilename := fmt.Sprintf("%d%s", timestamp, filepath.Ext(file.Filename))
	filePath := filepath.Join("uploads", uniqueFilename)

	// Save the uploaded file to the server
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment image"})
		return
	}

	// Create a Payment entity
	payment := entity.Payment{
		Amount:          paymentInput.Amount,
		PaymentDate:     paymentDate,
		PayerName:       paymentInput.PayerName,
		UserID:          paymentInput.UserID,          // UserID is now included
		PaymentStatusID: paymentInput.PaymentStatusID, // PaymentStatusID is now included
		// TransactionsID:  paymentInput.TransactionsID,  // TransactionsID is now included
		PaymentImage:    filePath,                      // Store the file path
	}

	// Save to the database
	db := config.DB()
	if err := db.Create(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save payment"})
		return
	}

	// Success response
	c.JSON(http.StatusCreated, gin.H{
		"message": "Payment submitted successfully",
		"data":    payment,
	})
}



// GET /payments
func ListPayments(c *gin.Context) {
	var payments []struct {
		ID              uint      `json:"id"`
		Amount          float64   `json:"amount"`
		PayerName		string 		`json:"PayerName"`
		PaymentDate     time.Time `json:"payment_date"`
		UserID          uint      `json:"user_id"`           // Foreign Key
		// OrderID         uint      `json:"order_id"`          // Foreign Key
		PaymentStatusID uint      `json:"payment_status_id"` // Foreign Key
		// TransactionsID  uint      `json:"transactions_id"`
		// PaymentMethod   string    `json:"payment_method"`
		PaymentImage        string    `json:"PaymentImage"` // เพิ่มฟิลด์ ImageURL
	}

	// Get the database connection
	db := config.DB()

	// Query with joins to get payment details including the ImageURL
	results := db.Table("payments").
		Select("payments.id,payments.payer_name,  payments.payment_status_id, payments.payment_date, payments.user_id, payments.amount,  payments.payment_image").
		Joins("INNER JOIN payment_statuses ON payments.payment_status_id = payment_statuses.id ").
		Where("payments.payment_status_id=1").
		// Joins("LEFT JOIN orders ON orders.id = payments.order_id").
		Scan(&payments)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, payments)
}

// GET /payments/:id
func ListPaymentByID(c *gin.Context) {
	// รับค่า userID จากพารามิเตอร์ใน URL
	userID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var payments []entity.Payment

	// Get the database connection
	db := config.DB()

	// Query with joins to get payment details filtered by userID
	err := db.Preload("User").Preload("PaymentStatus").
		Where("user_id = ?", userID).Find(&payments).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch payment details"})
		return
	}

	// Return the fetched payments as a JSON response
	c.JSON(http.StatusOK, gin.H{"payments": payments})
}




// DELETE /payments/:id
func DeletePayment(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM payments WHERE user_id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// PUT update Payment by UserID
func UpdatePaymentByUserID(c *gin.Context) {
	var payment entity.Payment
	userID := c.Param("id") // รับค่า UserID จาก URL

	db := config.DB()

	// ค้นหาข้อมูล Payment ที่ตรงกับ UserID
	result := db.Where("user_id = ?", userID).First(&payment)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found for this user"})
		return
	}

	// ตรวจสอบว่าข้อมูลที่ส่งมามีปัญหาหรือไม่
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// อัปเดตข้อมูล Payment
	result = db.Save(&payment)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update payment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "data": payment})
}

func UpdatePaymentStatusCancel(c *gin.Context) {
	// Retrieve the payment ID from the URL parameter
	paymentID := c.Param("payment_id")
	var requestBody struct {
		PaymentStatusID uint `json:"payment_status_id"`
	}

	// Parse the JSON request body to get the new PaymentStatusID
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the new status is 2, as per your requirement
	if requestBody.PaymentStatusID != 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment status ID. Only status 2 is allowed."})
		return
	}

	// Get the database connection
	db := config.DB()

	// Update the payment status
	result := db.Model(&entity.Payment{}).Where("id = ?", paymentID).Update("payment_status_id", 2)

	// Check for errors in the update
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Check if any rows were affected
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found or already updated."})
		return
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"message": "Payment status updated successfully."})

}
func UpdatePaymentStatusVerify(c *gin.Context) {
	// Retrieve the payment ID from the URL parameter
	paymentID := c.Param("payment_id")
	var requestBody struct {
		PaymentStatusID uint `json:"payment_status_id"`
	}

	// Parse the JSON request body to get the new PaymentStatusID
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the new status is 2, as per your requirement
	if requestBody.PaymentStatusID != 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payment status ID. Only status 3 is allowed."})
		return
	}

	// Get the database connection
	db := config.DB()

	// Update the payment status
	result := db.Model(&entity.Payment{}).Where("id = ?", paymentID).Update("payment_status_id", 3)

	// Check for errors in the update
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	// Check if any rows were affected
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment not found or already updated."})
		return
	}

	// Return success response
	// c.JSON(http.StatusOK, gin.H{"message": "Payment status updated successfully."})
	c.JSON(http.StatusCreated, gin.H{
		"message": "Payment status updated successfully.",
		// "data":    result,
		"payment_id":       paymentID,
		"new_payment_status": 3,
	})

}

func GetPaymentStatusByID(c *gin.Context) {
	// รับค่า userID จากพารามิเตอร์ใน URL
	userID := c.Param("id")
	
	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var payment_statuses []struct {
		ID              uint      `json:"id"`
		Status          string    `json:"status"` 
	}

	// Get the database connection
	db := config.DB()
	
	// 1. ค้นหา payment_status_id ตาม userID ที่ได้รับจาก parameter
	var paymentStatusID uint
	err := db.Table("payments").
		Select("payment_status_id").
		Where("id = ?", userID).
		Scan(&paymentStatusID).Error
	
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found or failed to fetch payment status ID"})
		return
	}

	// 2. ใช้ payment_status_id ที่ได้จากขั้นตอนแรกในการค้นหาข้อมูลจาก payment_statuses
	results := db.Table("payment_statuses").
		Select("payment_statuses.id, payment_statuses.status").
		Where("payment_statuses.id = ?", paymentStatusID).
		Scan(&payment_statuses)

	// Check for errors in the query
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Return the results as JSON
	c.JSON(http.StatusOK, payment_statuses)
}


