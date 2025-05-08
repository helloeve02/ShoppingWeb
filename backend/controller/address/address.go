package address

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"log"
	"net/http"
)

func CreateAddress(c *gin.Context) {
	var address entity.Address
	db := config.DB()

	// Bind JSON payload เข้ากับ struct
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload", "details": err.Error()})
		return
	}

	// ตรวจสอบว่าฟิลด์ AddressTypeID และ UserID ต้องไม่เป็น 0
	if address.AddressTypeID == 0 || address.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "AddressTypeID and UserID must be valid non-zero values"})
		return
	}

	// ตรวจสอบว่ามี UserID อยู่ในฐานข้อมูลหรือไม่
	var user entity.Users
	if err := db.First(&user, address.UserID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found with the provided UserID"})
		log.Printf("UserID: %d, AddressTypeID: %d", address.UserID, address.AddressTypeID)
		return
	}

	// ตรวจสอบว่ามี AddressTypeID อยู่ในฐานข้อมูลหรือไม่
	var addressType entity.AddressType
	if err := db.First(&addressType, address.AddressTypeID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "AddressType not found with the provided AddressTypeID"})
		return
	}

	// เตรียมข้อมูลสำหรับการสร้าง Address
	newAddress := entity.Address{
		Name:          address.Name,
		Address:       address.Address,
		SubDistrict:   address.SubDistrict,
		District:      address.District,
		Province:      address.Province,
		PostalCode:    address.PostalCode,
		PhoneNumber:   address.PhoneNumber,
		UserID:        address.UserID,
		AddressTypeID: address.AddressTypeID,
	}

	// บันทึกข้อมูล Address ลงฐานข้อมูล
	if err := db.Create(&newAddress).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create address", "details": err.Error()})
		return
	}

	// ส่งผลลัพธ์กลับไปยัง Client
	c.JSON(http.StatusCreated, gin.H{
		"message": "Address created successfully",
		"data":    newAddress,
		"id":      newAddress.ID,
	})
}

// GET /adress/:id// ปิดไปแล้วแต่ลืม
func GetAddress(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	var addresses []entity.Address // ตรวจสอบว่ากำลังดึงข้อมูลแบบ array
	if err := db.Where("user_id = ?", id).Find(&addresses).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No address found"})
		return
	}

	c.JSON(http.StatusOK, addresses) // ตรวจสอบว่า response เป็น array ของ addresses
}

// GET /concerts
func ListAddress(c *gin.Context) {
	var address []entity.Address
	db := config.DB()
	result := db.Preload("AddressType").Find(&address)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, address)
}

// DELETE /Address/:id
func DeleteAddress(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	// ลบ Concert ตาม ID
	if tx := db.Delete(&entity.Address{}, id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Address not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Address deleted successfully"})
}

// PUT /Address/:id
func UpdateAddress(c *gin.Context) {
	var address entity.Address
	addressID := c.Param("id")
	db := config.DB()
	result := db.First(&address, addressID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Adress not found"})
		return
	}
	// bind ข้อมูลใหม่ที่ต้องการอัปเดตเข้ากับ concert
	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Unable to map payload"})
		return
	}
	// บันทึกการอัปเดต
	if err := db.Save(&address).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Address updated successfully"})
}

// GET /adressBy/:id
func GetAddressByPayload(c *gin.Context) {
	var address entity.Address
	ID := c.Param("id")
	// 3. เชื่อมต่อฐานข้อมูล
	db := config.DB()

	// 4. ใช้ GORM เพื่อดึงข้อมูล Address โดยใช้ ID
	// Preload() ใช้โหลดข้อมูลที่สัมพันธ์กับ AddressType และ User
	results := db.First(&address, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if address.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, address)
}
