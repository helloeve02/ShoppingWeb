package entity

import "gorm.io/gorm"

type OrderItems struct {
	gorm.Model
	Quantity int
	Price int
	TotalPrice  int 

	OrderID     uint    
	Order Orders `gorm:"foreignKey:OrderID" valid:"-"`
	ProductID   uint    
	Product Products `gorm:"foreignKey:ProductID" valid:"-"` // Skip validation
	UserID	uint
	User    Users    `gorm:"foreignKey:UserID" valid:"-"`    // Skip validation


}