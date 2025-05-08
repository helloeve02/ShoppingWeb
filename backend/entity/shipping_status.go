package entity

import "gorm.io/gorm"

type ShippingStatus struct {
	gorm.Model
	Status string

	Shipping []Shipping `gorm:"foreignKey:ShippingStatusID"`
}