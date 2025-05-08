package entity

import "gorm.io/gorm"

type OrderStatus struct {
	gorm.Model
	Status string `valid:"required~Status is required"`

	Order	[]Orders `gorm:"foreignKey:OrderstatusID"`
}