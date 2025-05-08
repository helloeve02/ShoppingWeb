package entity

import (
	"time"

	"gorm.io/gorm"
)

type Transactions struct {
	gorm.Model
	Amount  float64 
	History time.Time `valid:"required~History is required"`
	
	UserID uint  `valid:"required~User is required"`
	User   Users `gorm:"foreignKey:UserID" valid:"-"`

	WalletsID uint  `valid:"required~Wallets is required"`
	Wallets   Wallets `gorm:"foreignKey:WalletsID" valid:"-"`

	OrderID uint  `valid:"required~OrderID is required"`
	Orders   Orders `gorm:"foreignKey:OrderID" valid:"-"`

	PaymentID  uint			`valid:"required~PaymentID is required"`
	Payment     Payment `gorm:"foriegnKey:PaymentID" valid:"-"`
	// Payment  	[]Payment `gorm:"foreignKey:TransactionsID"`
}
