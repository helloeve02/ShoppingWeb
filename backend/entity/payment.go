package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Amount          float64 `valid:"required~Amount is required"`
	PayerName		string 
	PaymentDate     time.Time
	UserID          uint `valid:"required~UserID is required"`
	PaymentStatusID uint
	PaymentStatus   PaymentStatus `gorm:"foriegnKey:PaymentStatusID"`
	PaymentImage    string `gorm:"type:longtext" valid:"required~Image is required"`
	Transactions  	[]Transactions `gorm:"foreignKey:PaymentID"`
	User  []Users  `gorm:"foreignKey:PaymentID"`
	
}
