package entity

import (
	"gorm.io/gorm"
)

type Invoice struct {
	gorm.Model
	FullName string `valid:"required~FullName is required"`
	Email    string `valid:"email~Email is invalid, required~Email is required"`
	TaxID    string `valid:"stringlength(13|13)~TaxID must be 13 characters, required~TaxID is required"`

	InvoiceTypeID uint        `valid:"required~InvoiceType is required"`
	InvoiceType   InvoiceType `gorm:"foreignKey:InvoiceTypeID" valid:"-"`

	OrderID uint   `valid:"required~Order is required"`
	Order   Orders `gorm:"foreignKey:OrderID" valid:"-"`

	UserID uint  `valid:"required~User is required"`
	User   Users `gorm:"foreignKey:UserID" valid:"-"`
}
