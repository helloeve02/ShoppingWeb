package entity

import "gorm.io/gorm"

type ProductStatus struct {
	gorm.Model
	ProductStatusName 	string	`json:"product_status_name"`
	Product	[]Products	`gorm:"foreignKey:ProductStatusID"`
}