package entity

import "gorm.io/gorm"

type CartItems struct {
	gorm.Model
	Quantity   int     `valid:"required~Quantity is required"`
	// TotalPrice float64 `valid:"float~TotalPrice must be a valid number,optional"`
	ProductID  uint    `valid:"required~ProductID is required"`
	Product Products `gorm:"foreignKey:ProductID" valid:"-"` // Skip validation
	UserID     uint    `valid:"required~UserID is required"`
	User    Users    `gorm:"foreignKey:UserID" valid:"-"`    // Skip validation
}
