package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/sut67/team17/config"
	"github.com/sut67/team17/entity"
	"gorm.io/gorm"
)

func GetTransactions(c *gin.Context) {
	var transactions []entity.Transactions
	db := config.DB()
	result := db.Find(&transactions)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, transactions)
}

// func GetTransactionByID(c *gin.Context) {
// 	ID := c.Param("id")
// 	var transaction entity.Transactions
// 	db := config.DB()
// 	result := db.First(&transaction, ID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	if transaction.ID == 0 {
// 		c.JSON(http.StatusNoContent, gin.H{})
// 		return
// 	}
// 	c.JSON(http.StatusOK, transaction)
// }

func GetTransactionByID(c *gin.Context) {
	// Get the database connection
	db := config.DB()

	// Get the User ID from the URL parameter
	id := c.Param("id")

	// Fetch all cart items for the user
	var tran []entity.Transactions
	if err := db.Where("user_id = ?", id).
		Preload("Wallets").
		Preload("User").
		// Preload("Product.ProductImages").
		Find(&tran).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No cart items found for this user"})
		return
	}

	// Return the list of cart items
	c.JSON(http.StatusOK, tran)
}

func CreateTransaction(c *gin.Context) {
	var transaction entity.Transactions
	var Wallet entity.Wallets
	var payload struct {
		Amount    float64   `json:"Amount"`
		History   time.Time `json:"History"`
		UserID    uint      `json:"UserID"`
		PaymentID uint      `json:"PaymentID"`
	}

	db := config.DB()

	// รับข้อมูล JSON จาก client
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ค้นหา Wallet จาก WalletID ที่ได้รับจาก transaction (หรือในกรณีนี้คือ UserID)
	if err := db.Where("user_id = ?", payload.UserID).First(&Wallet).Error; err != nil {
		// ถ้าไม่พบ Wallet สำหรับ UserID นี้
		c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found for the user"})
		return
	}

	// สร้าง transaction ในฐานข้อมูล
	transaction.Amount = payload.Amount
	transaction.History = payload.History
	transaction.UserID = payload.UserID
	transaction.PaymentID = payload.PaymentID
	transaction.WalletsID = Wallet.ID // ใส่ WalletID ที่ค้นพบ

	if err := db.Create(&transaction).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// อัพเดต Balance ใน Wallet โดยใช้ WalletsID จาก transaction
	if err := db.Model(&Wallet).Where("id = ?", transaction.WalletsID).Update("balance", gorm.Expr("balance + ?", transaction.Amount)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update wallet balance"})
		return
	}

	// ส่งผลลัพธ์กลับไปยัง client
	c.JSON(http.StatusCreated, gin.H{
		"message":     "Transaction created and wallet balance updated successfully",
		"transaction": transaction,
		"wallet":      Wallet,
	})
}

func DeleteTransaction(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM transactions WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func UpdateTransactionByID(c *gin.Context) {
	var transaction entity.Transactions
	ID := c.Param("id")
	db := config.DB()

	result := db.Where("id = ?", ID).First(&transaction)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Transaction not found"})
		return
	}

	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&transaction)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to update transaction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully", "data": transaction})
}
func CreateTransactionCancel(c *gin.Context) {
    var transaction entity.Transactions
    var Wallet entity.Wallets
    var payload struct {
        Amount    float64   `json:"Amount"`
        History   time.Time `json:"History"`
        UserID    uint      `json:"UserID"`
        PaymentID uint      `json:"PaymentID"`
    }

    db := config.DB()

    // รับข้อมูล JSON จาก client
    if err := c.ShouldBindJSON(&payload); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // ค้นหา Wallet จาก WalletID ที่ได้รับจาก transaction (หรือในกรณีนี้คือ UserID)
    if err := db.Where("user_id = ?", payload.UserID).First(&Wallet).Error; err != nil {
        // ถ้าไม่พบ Wallet สำหรับ UserID นี้
        c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found for the user"})
        return
    }

    // สร้าง transaction ในฐานข้อมูล
    transaction.Amount = payload.Amount
    transaction.History = payload.History
    transaction.UserID = payload.UserID
    transaction.PaymentID = payload.PaymentID
    transaction.WalletsID = Wallet.ID  // ใส่ WalletID ที่ค้นพบ

    if err := db.Create(&transaction).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // อัพเดต Balance ใน Wallet โดยใช้ WalletsID จาก transaction
    // if err := db.Model(&Wallet).Where("id = ?", transaction.WalletsID).Update("balance", gorm.Expr("balance + ?", transaction.Amount)).Error; err != nil {
    //     c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update wallet balance"})
    //     return
    // }

    // ส่งผลลัพธ์กลับไปยัง client
    c.JSON(http.StatusCreated, gin.H{
        "message":    "Transaction created and wallet balance updated successfully",
        "transaction": transaction,
        "wallet":     Wallet,
    })
}
// func CreateTransactionRefun(c *gin.Context) {
//     var transaction entity.Transactions
//     var Wallet entity.Wallets
//     var Return entity.Return
//     var payload struct {
//         Amount    float64   `json:"Amount"`
//         History   time.Time `json:"History"`
//         UserID    uint      `json:"UserID"`
//         PaymentID uint      `json:"PaymentID"`
//         ReturnID  uint      `json:"ReturnID"`
//     }

//     db := config.DB()

//     // รับข้อมูล JSON จาก client
//     if err := c.ShouldBindJSON(&payload); err != nil {
//         c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//         return
//     }

//     // ค้นหาข้อมูลจากตาราง Refun โดยใช้ ReturnID
//     if err := db.Where("id = ?", payload.ReturnID).First(&Return).Error; err != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": "Return record not found"})
//         return
//     }

//     // กำหนด Amount จากข้อมูลใน Return
//     payload.Amount = Return.Amount  // เอาจำนวนเงินจาก Return มาตั้งใน Amount ของ payload

//     // ค้นหา Wallet จาก UserID
//     if err := db.Where("user_id = ?", payload.UserID).First(&Wallet).Error; err != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": "Wallet not found for the user"})
//         return
//     }

//     // สร้าง transaction ในฐานข้อมูล
//     transaction.Amount = payload.Amount
//     transaction.History = payload.History
//     transaction.UserID = payload.UserID
//     transaction.PaymentID = payload.PaymentID
//     transaction.WalletsID = Wallet.ID  // ใส่ WalletID ที่ค้นพบ

//     if err := db.Create(&transaction).Error; err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//         return
//     }

//     // อัพเดต Balance ใน Wallet โดยใช้ WalletsID จาก transaction
//     if err := db.Model(&Wallet).Where("id = ?", transaction.WalletsID).Update("balance", gorm.Expr("balance + ?", transaction.Amount)).Error; err != nil {
//         c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update wallet balance"})
//         return
//     }

//     // ส่งผลลัพธ์กลับไปยัง client
//     c.JSON(http.StatusCreated, gin.H{
//         "message":    "Transaction created and wallet balance updated successfully",
//         "transaction": transaction,
//         "wallet":     Wallet,
//     })
// }
