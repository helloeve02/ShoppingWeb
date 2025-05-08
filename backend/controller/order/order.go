package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"net/http"
	"time"
)

func GetOrderByID(c *gin.Context) {
	// รับค่า userID จากพารามิเตอร์ใน URL
	userID := c.Param("id")

	// กำหนด struct สำหรับเก็บผลลัพธ์ที่จะ return
	var order []entity.Orders

	// Get the database connection
	db := config.DB()

	// Query with joins to get payment details filtered by userID
	err := db.Preload("Users").Preload("Orderstatus").Preload("Wallets").Preload("Shipping").
		Where("user_id = ?", userID).Find(&order).Error
	if err != nil {
		// Handle errors and return an appropriate response
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to fetch order details"})
		return
	}

	// Return the fetched payments as a JSON response
	c.JSON(http.StatusOK, gin.H{"order": order})
}

func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM orders WHERE user_id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

// func CreateOrder(c *gin.Context) {
//     var order entity.Orders
// 	db := config.DB()
//     // รับข้อมูล JSON จาก client
//     if err := c.ShouldBindJSON(&order); err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
//     }

//     // ใช้ GORM สร้างคำสั่งซื้อพร้อมกับ OrderItems
//     if err := db.Create(&order).Error; err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     c.JSON(http.StatusCreated, gin.H{
//         "message": "Order created successfully",
//         "order":   order,
//     })
// }



func UpdateOrderByUserID(c *gin.Context) {
	var order entity.Orders
	userID := c.Param("id") // รับค่า UserID จาก URL

	db := config.DB()

	// ค้นหาข้อมูล Payment ที่ตรงกับ UserID
	result := db.Where("user_id = ?", userID).First(&order)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found for this user"})
		return
	}

	// ตรวจสอบว่าข้อมูลที่ส่งมามีปัญหาหรือไม่
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	// อัปเดตข้อมูล Payment
	result = db.Save(&order)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "data": order})
}

func CreateOrderItem(c *gin.Context) {
    var orderItems []entity.OrderItems  // รับข้อมูลเป็น array ของ OrderItems
    db := config.DB()

    // รับข้อมูล JSON จาก client
    if err := c.ShouldBindJSON(&orderItems); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ใช้ GORM สร้างหลายรายการคำสั่งซื้อ
    if err := db.Create(&orderItems).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{
        "message": "orderitems created successfully",
        "orderitems": orderItems,  // ส่งคืนรายการคำสั่งซื้อที่ถูกสร้าง
    })
}

// func CreateOrderItem(c *gin.Context) {
// 	var ordersitem entity.OrderItems

// 	if err := c.ShouldBindJSON(&ordersitem); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	db := config.DB()

// 	orderitem := entity.OrderItems{
// 		Quantity: ordersitem.Quantity,
// 		ProductID   : ordersitem.ProductID,
// 		Price : ordersitem.Price,
//     	UserID    : ordersitem.UserID,
//     	TotalPrice : ordersitem.TotalPrice,
//     	OrderID   : ordersitem.OrderID,
// 	}
// 	if err := db.Create(&orderitem).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": orderitem})
// }



func CreateOrder(c *gin.Context) {
	var orders entity.Orders

	if err := c.ShouldBindJSON(&orders); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db := config.DB()

	order := entity.Orders{
		TotalPrice: orders.TotalPrice,
   		OrderDate:  time.Now(),
    	OrderstatusID : orders.OrderstatusID,
    	UserID    : orders.UserID,
    	WalletsID : orders.WalletsID,
    	ShippingID   : orders.ShippingID,
	}
	if err := db.Create(&order).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": order, "orderID": order.ID})
}


