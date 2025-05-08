package entity

import "gorm.io/gorm"

type InvoiceType struct {
	gorm.Model
	Name string

	Invoice	[]Invoice `gorm:"foreignKey:InvoiceTypeID"`
}