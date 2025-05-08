package entity

import "gorm.io/gorm"

type Products struct {
	gorm.Model
	ProductsName    string  `json:"product_name" valid:"required~Product name is required, stringlength(1|100)"`
	Description     string  `json:"description" valid:"required~Description is required, stringlength(1|10000)"`
	Price           int `json:"price" valid:"required~Price is required,float~Price must be a valid number"`
	Stock           uint    `json:"stock" valid:"required~Stock is required,range(1|1000000)"`

	BrandID        uint    `json:"brand_id"`
	ProductStatusID uint   `json:"product_status_id" valid:"required~Product status is required"`
    UserID         uint    `json:"user_id" valid:"required~User is required"`
    CategoryID     uint    `json:"category_id" valid:"required~Category is required"`

	Promotions     []PromotionProducts `gorm:"foreignKey:ProductID" json:"promotions"`
	CartItems      []CartItems         `gorm:"foreignKey:ProductID" json:"cart_items"`
	OrderItems     []OrderItems        `gorm:"foreignKey:ProductID" json:"order_items"`
	ProductImages  []ProductImages     `gorm:"foreignKey:ProductID" json:"product_images"`
	Reviews        []Reviews           `gorm:"foreignKey:ProductID" json:"reviews"`
}
