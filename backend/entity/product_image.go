package entity

import "gorm.io/gorm"

type ProductImages struct {
	gorm.Model
	Image     string `json:"image" valid:"required~Image is required"`
	ProductID uint   `json:"product_id" valid:"required~Product ID is required"`
}
