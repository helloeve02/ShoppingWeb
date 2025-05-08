package entity

import (
	"time"
	"gorm.io/gorm"
)

type Orders struct {
    gorm.Model
    TotalPrice   int   `valid:"required~TotalPrice is required,int~Price must be a valid number"`
    OrderDate    time.Time `valid:"required~OrderDate is required"`
    
    OrderstatusID uint     `valid:"required~OrderstatusID is required,int~OrderstatusID must be a valid number"`
    Orderstatus   OrderStatus `gorm:"foreignKey:OrderstatusID" valid:"-"`

    UserID       uint      `valid:"required~User is required"`
    Users   Users `gorm:"foreignKey:UserID" valid:"-"`
    WalletsID    uint
    Wallets Wallets `gorm:"foreignKey:WalletsID"`
    ShippingID   uint
    Shipping Shipping `gorm:"foreignKey:ShippingID" valid:"-"`
    
    Orderitem    []OrderItems `gorm:"foreignKey:OrderID"`
    Invoice      []Invoice    `gorm:"foreignKey:OrderID"`
    Return	[]Return `gorm:"foreignKey:OrderID"`
    Transaction    []Transactions `gorm:"foreignKey:OrderID"`
}
