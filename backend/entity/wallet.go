package entity

import "gorm.io/gorm"

type Wallets struct {
    gorm.Model
    Balance       int      `valid:"required~Balance is required"`
    UserID        uint         `valid:"required~UserID is required"`
    User          Users        `gorm:"foreignKey:UserID;references:ID" valid:"-"`
    Transactions  []Transactions `gorm:"foreignKey:WalletsID"`
    Orders []Orders `gorm:"foreignKey:WalletsID"`
}
